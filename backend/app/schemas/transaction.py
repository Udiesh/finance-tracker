from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class TransactionCreate(BaseModel):
    amount: float
    description: str
    date: date
    category_id: int


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[date] = None
    category_id: Optional[int] = None


class TransactionResponse(BaseModel):
    id: int
    amount: float
    description: str
    date: date
    category_id: int
    category_name: Optional[str] = None
    category_icon: Optional[str] = None
    category_type: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AITransactionInput(BaseModel):
    text: str