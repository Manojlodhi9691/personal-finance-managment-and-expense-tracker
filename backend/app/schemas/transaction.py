from pydantic import BaseModel
from datetime import date


class TransactionCreate(BaseModel):
    account_id: int
    amount: float
    category: str
    description: str | None = None
    transaction_type: str
    date: date