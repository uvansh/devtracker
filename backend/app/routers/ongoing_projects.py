from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from ..database import get_db
from ..models import OngoingProject, DailyGoal
from ..schemas import (
    OngoingProjectCreate, OngoingProjectUpdate, OngoingProjectResponse,
    DailyGoalCreate, DailyGoalUpdate, DailyGoalResponse
)

router = APIRouter(prefix="/ongoing-projects", tags=["Ongoing Projects"])


@router.get("/", response_model=List[OngoingProjectResponse])
async def get_all_ongoing_projects(
    priority: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all ongoing projects with optional priority filter."""
    query = select(OngoingProject)
    if priority:
        query = query.where(OngoingProject.priority == priority)
    query = query.order_by(OngoingProject.deadline)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{project_id}", response_model=OngoingProjectResponse)
async def get_ongoing_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific ongoing project by ID."""
    result = await db.execute(
        select(OngoingProject).where(OngoingProject.id == project_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Ongoing project not found")
    return project


@router.post("/", response_model=OngoingProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_ongoing_project(
    project: OngoingProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new ongoing project."""
    db_project = OngoingProject(**project.model_dump())
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=OngoingProjectResponse)
async def update_ongoing_project(
    project_id: int,
    project: OngoingProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an ongoing project."""
    result = await db.execute(
        select(OngoingProject).where(OngoingProject.id == project_id)
    )
    db_project = result.scalar_one_or_none()
    if not db_project:
        raise HTTPException(status_code=404, detail="Ongoing project not found")
    
    update_data = project.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    await db.commit()
    await db.refresh(db_project)
    return db_project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ongoing_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an ongoing project."""
    result = await db.execute(
        select(OngoingProject).where(OngoingProject.id == project_id)
    )
    db_project = result.scalar_one_or_none()
    if not db_project:
        raise HTTPException(status_code=404, detail="Ongoing project not found")
    
    await db.delete(db_project)
    await db.commit()


# Daily Goals Routes
@router.get("/{project_id}/goals", response_model=List[DailyGoalResponse])
async def get_project_goals(project_id: int, db: AsyncSession = Depends(get_db)):
    """Get all daily goals for a project."""
    result = await db.execute(
        select(DailyGoal).where(DailyGoal.project_id == project_id).order_by(DailyGoal.due_date)
    )
    return result.scalars().all()


@router.post("/goals", response_model=DailyGoalResponse, status_code=status.HTTP_201_CREATED)
async def create_daily_goal(goal: DailyGoalCreate, db: AsyncSession = Depends(get_db)):
    """Create a new daily goal."""
    # Verify project exists
    result = await db.execute(
        select(OngoingProject).where(OngoingProject.id == goal.project_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Ongoing project not found")
    
    db_goal = DailyGoal(**goal.model_dump())
    db.add(db_goal)
    await db.commit()
    await db.refresh(db_goal)
    return db_goal


@router.put("/goals/{goal_id}", response_model=DailyGoalResponse)
async def update_daily_goal(
    goal_id: int,
    goal: DailyGoalUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a daily goal."""
    result = await db.execute(select(DailyGoal).where(DailyGoal.id == goal_id))
    db_goal = result.scalar_one_or_none()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Daily goal not found")
    
    update_data = goal.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_goal, field, value)
    
    await db.commit()
    await db.refresh(db_goal)
    return db_goal


@router.delete("/goals/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_daily_goal(goal_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a daily goal."""
    result = await db.execute(select(DailyGoal).where(DailyGoal.id == goal_id))
    db_goal = result.scalar_one_or_none()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Daily goal not found")
    
    await db.delete(db_goal)
    await db.commit()
