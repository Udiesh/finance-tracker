from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from app.auth.auth import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionResponse)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new transaction.
    Verifies the category exists and belongs to this user
    before creating — prevents linking to someone else's category.
    """
    category = db.query(Category).filter(
        Category.id == data.category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    transaction = Transaction(**data.model_dump(), user_id=current_user.id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return _build_response(transaction, category)


@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    category_id: Optional[int] = Query(None, description="Filter by category"),
    type: Optional[str] = Query(None, description="Filter by 'income' or 'expense'"),
    start_date: Optional[date] = Query(None, description="Filter from this date"),
    end_date: Optional[date] = Query(None, description="Filter until this date"),
    limit: int = Query(50, description="Number of results"),
    offset: int = Query(0, description="Pagination offset")
):
    """
    Get transactions with optional filters.
    Supports filtering by category, type, date range
    and pagination — essential for when users have 
    hundreds of transactions.
    """
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if category_id:
        query = query.filter(Transaction.category_id == category_id)

    if type:
        query = query.join(Category).filter(Category.type == type)

    if start_date:
        query = query.filter(Transaction.date >= start_date)

    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.order_by(Transaction.date.desc()).offset(offset).limit(limit).all()

    result = []
    for t in transactions:
        category = db.query(Category).filter(Category.id == t.category_id).first()
        result.append(_build_response(t, category))

    return result


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None)
):
    """
    Returns total income, total expense, and balance.
    Used by the dashboard to show the overview cards.
    Can filter by month/year for monthly summaries.
    """
    from sqlalchemy import func, extract

    query = db.query(Transaction).join(Category).filter(
        Transaction.user_id == current_user.id
    )

    if month and year:
        query = query.filter(
            extract("month", Transaction.date) == month,
            extract("year", Transaction.date) == year
        )

    income = query.filter(Category.type == "income").with_entities(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).scalar()

    expense = query.filter(Category.type == "expense").with_entities(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).scalar()

    return {
        "total_income": float(income),
        "total_expense": float(expense),
        "balance": float(income - expense)
    }


@router.get("/monthly-breakdown")
def get_monthly_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    year: Optional[int] = Query(None)
):
    """
    Returns income and expense totals grouped by month.
    This powers the bar/line chart on the dashboard
    showing spending trends over time.
    """
    from sqlalchemy import func, extract
    from datetime import datetime

    if not year:
        year = datetime.now().year

    months = []
    for month in range(1, 13):
        query = db.query(Transaction).join(Category).filter(
            Transaction.user_id == current_user.id,
            extract("month", Transaction.date) == month,
            extract("year", Transaction.date) == year
        )

        income = query.filter(Category.type == "income").with_entities(
            func.coalesce(func.sum(Transaction.amount), 0)
        ).scalar()

        expense = query.filter(Category.type == "expense").with_entities(
            func.coalesce(func.sum(Transaction.amount), 0)
        ).scalar()

        months.append({
            "month": month,
            "income": float(income),
            "expense": float(expense)
        })

    return months

@router.get("/category-breakdown")
def get_category_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None)
):
    """
    Returns total amount spent per category.
    Powers the pie chart on the dashboard.
    """
    from sqlalchemy import func, extract
    from datetime import datetime

    if not month:
        month = datetime.now().month
    if not year:
        year = datetime.now().year

    results = (
        db.query(
            Category.name,
            Category.icon,
            Category.type,
            func.coalesce(func.sum(Transaction.amount), 0).label("total")
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .filter(
            Transaction.user_id == current_user.id,
            extract("month", Transaction.date) == month,
            extract("year", Transaction.date) == year
        )
        .group_by(Category.name, Category.icon, Category.type)
        .all()
    )

    return [
        {"name": r.name, "icon": r.icon, "type": r.type, "total": float(r.total)}
        for r in results
    ]

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a transaction — only if it belongs to this user"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    update_data = data.model_dump(exclude_unset=True)

    if "category_id" in update_data:
        category = db.query(Category).filter(
            Category.id == update_data["category_id"],
            Category.user_id == current_user.id
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

    for key, value in update_data.items():
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)

    category = db.query(Category).filter(Category.id == transaction.category_id).first()
    return _build_response(transaction, category)


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}



def _build_response(transaction: Transaction, category: Category) -> dict:
    """
    Helper function that combines transaction data with 
    its category info for the response. This way the frontend
    gets category name and icon without making a separate API call.
    """
    return {
        "id": transaction.id,
        "amount": transaction.amount,
        "description": transaction.description,
        "date": transaction.date,
        "category_id": transaction.category_id,
        "category_name": category.name if category else None,
        "category_icon": category.icon if category else None,
        "category_type": category.type if category else None,
        "created_at": transaction.created_at
    }