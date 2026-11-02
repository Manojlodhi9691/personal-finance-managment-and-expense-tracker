from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String

from app.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    name = Column(String, nullable=False)

    target_amount = Column(Float, nullable=False)

    current_amount = Column(
        Float,
        default=0,
    )

    deadline = Column(Date, nullable=True)