from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def calculate_summary(db: Session):
    transactions = db.query(Transaction).all()

    income = sum(
        item.amount
        for item in transactions
        if item.transaction_type == "income"
    )

    expenses = sum(
        item.amount
        for item in transactions
        if item.transaction_type == "expense"
    )

    return {
        "income": income,
        "expenses": expenses,
        "balance": income - expenses,
        "savings": income - expenses,
    }