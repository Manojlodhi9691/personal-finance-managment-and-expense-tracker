from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"]
)


@router.get("/")
def get_budgets(db: Session = Depends(get_db)):

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == 1)
        .all()
    )

    result = []

    for budget in budgets:

        spent = (
            db.query(func.sum(Transaction.amount))
            .filter(
                Transaction.user_id == 1,

                # Match category ignoring capital letters
                func.lower(func.trim(Transaction.category))
                == func.lower(func.trim(budget.category)),

                # Make sure only expenses are counted
                func.lower(func.trim(Transaction.transaction_type))
                == "expense"
            )
            .scalar()
        ) or 0

        remaining = budget.amount - spent

        percentage = (
            (spent / budget.amount) * 100
            if budget.amount > 0
            else 0
        )

        result.append({
            "id": budget.id,
            "category": budget.category,
            "budget": budget.amount,
            "spent": float(spent),
            "remaining": float(remaining),
            "percentage": float(percentage)
        })

    return result


@router.post("/")
def create_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db)
):

    budget = Budget(
        user_id=1,
        category=data.category.strip(),
        amount=data.amount
    )

    db.add(budget)
    db.commit()
    db.refresh(budget)

    return {
        "message": "Budget created successfully",
        "budget": {
            "id": budget.id,
            "category": budget.category,
            "amount": budget.amount
        }
    }


@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db)
):

    budget = (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == 1
        )
        .first()
    )

    if not budget:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    db.delete(budget)
    db.commit()

    return {
        "message": "Budget deleted successfully"
    }