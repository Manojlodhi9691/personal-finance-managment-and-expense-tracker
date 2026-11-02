from datetime import date
from typing import Optional

from pydantic import BaseModel


class GoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0
    deadline: Optional[date] = None


class GoalResponse(GoalCreate):
    id: int

    class Config:
        from_attributes = True