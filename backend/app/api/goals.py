from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalResponse

router = APIRouter(
    prefix="/api/goals",
    tags=["Goals"],
)


@router.get("/", response_model=list[GoalResponse])
def get_goals(
    db: Session = Depends(get_db),
):
    return db.query(Goal).all()


@router.post("/", response_model=GoalResponse)
def create_goal(
    data: GoalCreate,
    db: Session = Depends(get_db),
):
    goal = Goal(
        user_id=1,
        name=data.name,
        target_amount=data.target_amount,
        current_amount=data.current_amount,
        deadline=data.deadline,
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal