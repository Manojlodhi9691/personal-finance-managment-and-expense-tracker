from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import TransactionCreate

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


# Get all transactions
@router.get("/")
def get_transactions(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    return [
        {
            "id": t.id,
            "account_id": t.account_id,
            "amount": t.amount,
            "category": t.category,
            "description": t.description,
            "transaction_type": t.transaction_type,
            "date": t.date
        }
        for t in transactions
    ]


# Add transaction
@router.post("/")
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db)
):

    # Check whether account exists
    account = (
        db.query(Account)
        .filter(
            Account.id == data.account_id,
            Account.user_id == 1
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    transaction = Transaction(
        user_id=1,
        account_id=data.account_id,
        amount=data.amount,
        category=data.category.strip().lower(),
        description=data.description,
        transaction_type=data.transaction_type.strip().lower(),
        date=data.date
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        "message": "Transaction added successfully",
        "transaction": {
            "id": transaction.id,
            "account_id": transaction.account_id,
            "amount": transaction.amount,
            "category": transaction.category,
            "description": transaction.description,
            "transaction_type": transaction.transaction_type,
            "date": transaction.date
        }
    }


# Analytics summary
@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db)
):

    # Total income
    total_income = (
        db.query(func.sum(Transaction.amount))
        .filter(
            Transaction.transaction_type == "income"
        )
        .scalar()
    ) or 0

    # Total expenses
    total_expenses = (
        db.query(func.sum(Transaction.amount))
        .filter(
            Transaction.transaction_type == "expense"
        )
        .scalar()
    ) or 0

    # Balance
    balance = total_income - total_expenses

    # Expenses by category
    category_data = (
        db.query(
            Transaction.category,
            func.sum(Transaction.amount).label("total")
        )
        .filter(
            Transaction.transaction_type == "expense"
        )
        .group_by(Transaction.category)
        .all()
    )

    expenses_by_category = [
        {
            "category": category,
            "amount": float(total)
        }
        for category, total in category_data
    ]

    # Monthly expenses
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.transaction_type == "expense"
        )
        .order_by(Transaction.date)
        .all()
    )

    monthly_totals = {}

    for transaction in transactions:

        month = transaction.date.strftime("%Y-%m")

        if month not in monthly_totals:
            monthly_totals[month] = 0

        monthly_totals[month] += transaction.amount

    monthly_expenses = [
        {
            "month": month,
            "amount": amount
        }
        for month, amount in monthly_totals.items()
    ]

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
        "expenses_by_category": expenses_by_category,
        "monthly_expenses": monthly_expenses
    }