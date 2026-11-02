from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Account from which the money came / went
    account_id = Column(
        Integer,
        ForeignKey("accounts.id"),
        nullable=False
    )

    amount = Column(
        Float,
        nullable=False
    )

    category = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=True
    )

    transaction_type = Column(
        String,
        nullable=False
    )

    date = Column(
        Date,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="transactions"
    )

    account = relationship(
        "Account",
        back_populates="transactions"
    )