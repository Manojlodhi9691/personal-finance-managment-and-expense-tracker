from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.account import Account
from app.models.transaction import Transaction

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"]
)


# Get all accounts
@router.get("/")
def get_accounts(db: Session = Depends(get_db)):

    accounts = (
        db.query(Account)
        .filter(Account.user_id == 1)
        .all()
    )

    result = []

    for account in accounts:

        income = (
            db.query(func.sum(Transaction.amount))
            .filter(
                Transaction.account_id == account.id,
                Transaction.transaction_type == "income"
            )
            .scalar()
        ) or 0

        expenses = (
            db.query(func.sum(Transaction.amount))
            .filter(
                Transaction.account_id == account.id,
                Transaction.transaction_type == "expense"
            )
            .scalar()
        ) or 0

        balance = (
            account.opening_balance
            + income
            - expenses
        )

        result.append({
            "id": account.id,
            "name": account.name,
            "account_type": account.account_type,
            "opening_balance": account.opening_balance,
            "balance": balance
        })

    return result


# Create account
@router.post("/")
def create_account(
    data: dict,
    db: Session = Depends(get_db)
):

    account = Account(
        user_id=1,
        name=data.get("name"),
        account_type=data.get("account_type"),
        opening_balance=float(
            data.get("opening_balance", 0)
        )
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return {
        "message": "Account created successfully",
        "account": {
            "id": account.id,
            "name": account.name,
            "account_type": account.account_type,
            "opening_balance": account.opening_balance,
            "balance": account.opening_balance
        }
    }


# Delete account
@router.delete("/{account_id}")
def delete_account(
    account_id: int,
    db: Session = Depends(get_db)
):

    account = (
        db.query(Account)
        .filter(
            Account.id == account_id,
            Account.user_id == 1
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    db.delete(account)
    db.commit()

    return {
        "message": "Account deleted successfully"
    }