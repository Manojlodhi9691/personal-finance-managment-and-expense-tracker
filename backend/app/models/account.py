from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    account_type = Column(
        String,
        nullable=False
    )

    opening_balance = Column(
        Float,
        nullable=False,
        default=0
    )

    user = relationship("User")

    transactions = relationship(
        "Transaction",
        back_populates="account",
        cascade="all, delete-orphan"
    )