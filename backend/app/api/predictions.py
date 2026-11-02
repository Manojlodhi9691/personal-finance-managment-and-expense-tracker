from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.database import get_db
from app.models.transaction import Transaction

router = APIRouter(tags=["Predictions"])


@router.get("/forecast")
def forecast(db: Session = Depends(get_db)):

    # Get monthly expenses from the database
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == 1,
            Transaction.transaction_type == "expense"
        )
        .order_by(Transaction.date)
        .all()
    )

    if not transactions:
        return {
            "message": "Not enough expense data for forecast",
            "current_month_expense": 0,
            "predicted_expense": 0,
            "change_percentage": 0,
            "months_used": 0
        }

    # Group expenses by month
    monthly_expenses = {}

    for transaction in transactions:
        month = transaction.date.strftime("%Y-%m")

        if month not in monthly_expenses:
            monthly_expenses[month] = 0

        monthly_expenses[month] += transaction.amount

    # Sort months
    sorted_months = sorted(monthly_expenses.keys())

    amounts = [
        monthly_expenses[month]
        for month in sorted_months
    ]

    # Current/latest month's expense
    current_expense = amounts[-1]

    # Use the last 3 months if available
    recent_amounts = amounts[-3:]

    # Average recent spending
    predicted_expense = sum(recent_amounts) / len(recent_amounts)

    # Calculate percentage change
    if current_expense > 0:
        change_percentage = (
            (predicted_expense - current_expense)
            / current_expense
        ) * 100
    else:
        change_percentage = 0

    # Determine next month
    latest_month = sorted_months[-1]

    year, month = map(int, latest_month.split("-"))

    if month == 12:
        next_year = year + 1
        next_month = 1
    else:
        next_year = year
        next_month = month + 1

    next_month_name = date(
        next_year,
        next_month,
        1
    ).strftime("%B")

    return {
        "message": "Forecast generated successfully",
        "current_month_expense": round(current_expense, 2),
        "predicted_expense": round(predicted_expense, 2),
        "change_percentage": round(change_percentage, 2),
        "next_month": next_month_name,
        "months_used": len(recent_amounts),
        "monthly_expenses": [
            {
                "month": month,
                "amount": round(monthly_expenses[month], 2)
            }
            for month in sorted_months
        ]
    }