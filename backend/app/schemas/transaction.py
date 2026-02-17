from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import Optional



class TransactionCreate(BaseModel):
    amount: float
    description: str
    date: date
    category_id: int

    @field_validator('amount')
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be greater than zero')
        if v > 10_000_000:
            raise ValueError('Amount seems unrealistically large')
        return round(v, 2)



class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[date] = None
    category_id: Optional[int] = None

    @field_validator('amount')
    @classmethod
    def amount_must_be_positive(cls, v):
        if v is not None:
            if v <= 0:
                raise ValueError('Amount must be greater than zero')
            if v > 10_000_000:
                raise ValueError('Amount seems unrealistically large')
            return round(v, 2)
        return v



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

    @field_validator('text')
    @classmethod
    def text_must_be_reasonable(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError('Text too short')
        if len(v) > 500:
            raise ValueError('Text too long, keep it under 500 characters')
        return v