from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.api.accounts import router as account_router
from app.models.user import User
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.api.auth import router as auth_router
from app.api.transactions import router as transaction_router

from app.api.predictions import router as prediction_router
from app.api.budgets import router as budget_router
from app.models.account import Account
from app.api.accounts import router as account_router
# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Finance Manager API",
    description="Personal Finance Management and Expense Prediction API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Finance Manager API is running",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# Authentication
app.include_router(
    auth_router,
    prefix="/api/auth"
)
app.include_router(
    prediction_router,
    prefix="/api/predictions"
)
# Transactions
app.include_router(
    transaction_router,
    prefix="/api"
)
app.include_router(
    budget_router,
    prefix="/api"
)
app.include_router(account_router, prefix="/api")