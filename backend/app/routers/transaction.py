from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from app.auth.auth import get_current_user
from sqlalchemy import func, extract, case


router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionResponse)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    category_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0)
):
    # Single query with JOIN — no N+1 problem
    query = (
        db.query(Transaction, Category)
        .join(Category, Transaction.category_id == Category.id)
        .filter(Transaction.user_id == current_user.id)
    )

    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if type:
        query = query.filter(Category.type == type)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    results = query.order_by(Transaction.date.desc()).offset(offset).limit(limit).all()

    return [_build_response(t, c) for t, c in results]


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None)
):
    # Single query with conditional aggregation instead of two separate queries
    query = db.query(
        func.coalesce(func.sum(
            case((Category.type == "income", Transaction.amount), else_=0)
        ), 0).label("total_income"),
        func.coalesce(func.sum(
            case((Category.type == "expense", Transaction.amount), else_=0)
        ), 0).label("total_expense"),
    ).join(Category, Transaction.category_id == Category.id).filter(
        Transaction.user_id == current_user.id
    )

    if month and year:
        query = query.filter(
            extract("month", Transaction.date) == month,
            extract("year", Transaction.date) == year
        )

    result = query.one()

    return {
        "total_income": float(result.total_income),
        "total_expense": float(result.total_expense),
        "balance": float(result.total_income - result.total_expense)
    }


@router.get("/monthly-breakdown")
def get_monthly_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    year: Optional[int] = Query(None)
):
    from datetime import datetime

    if not year:
        year = datetime.now().year

    # Single query instead of 24 separate queries
    results = (
        db.query(
            extract("month", Transaction.date).label("month"),
            func.coalesce(func.sum(
                case((Category.type == "income", Transaction.amount), else_=0)
            ), 0).label("income"),
            func.coalesce(func.sum(
                case((Category.type == "expense", Transaction.amount), else_=0)
            ), 0).label("expense"),
        )
        .join(Category, Transaction.category_id == Category.id)
        .filter(
            Transaction.user_id == current_user.id,
            extract("year", Transaction.date) == year
        )
        .group_by(extract("month", Transaction.date))
        .all()
    )

    # Build a lookup from query results
    month_data = {int(r.month): {"income": float(r.income), "expense": float(r.expense)} for r in results}

    # Return all 12 months, filling in zeros for months with no data
    return [
        {
            "month": m,
            "income": month_data.get(m, {}).get("income", 0),
            "expense": month_data.get(m, {}).get("expense", 0),
        }
        for m in range(1, 13)
    ]


@router.get("/category-breakdown")
def get_category_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None)
):
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