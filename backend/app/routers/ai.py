from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.category import Category
from app.schemas.transaction import AITransactionInput
from app.services.ai_service import parse_transaction_text
from app.auth.auth import get_current_user

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/parse-transaction")
def parse_transaction(
    data: AITransactionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    User sends natural language text.
    We fetch their categories, send everything to Groq,
    and return structured data that pre-fills the transaction form.
    """
    user_categories = db.query(Category).filter(
        Category.user_id == current_user.id
    ).all()

    category_names = [c.name for c in user_categories]
    result = parse_transaction_text(data.text, category_names)

    # If AI matched a category name, find its ID for the frontend
    if "category" in result and "error" not in result:
        matched = next(
            (c for c in user_categories if c.name.lower() == result["category"].lower()),
            None
        )
        if matched:
            result["category_id"] = matched.id

    return result