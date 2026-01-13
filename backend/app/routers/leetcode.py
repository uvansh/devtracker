from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import LeetCodeProblem
from ..schemas import (
    LeetCodeProblemCreate, LeetCodeProblemUpdate, LeetCodeProblemResponse
)

router = APIRouter(prefix="/leetcode", tags=["LeetCode"])


@router.get("/", response_model=List[LeetCodeProblemResponse])
async def get_all_problems(
    difficulty: Optional[str] = None,
    topic: Optional[str] = None,
    is_solved: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all LeetCode problems with optional filters."""
    query = select(LeetCodeProblem)
    
    if difficulty:
        query = query.where(LeetCodeProblem.difficulty == difficulty)
    if topic:
        query = query.where(LeetCodeProblem.topic.ilike(f"%{topic}%"))
    if is_solved is not None:
        query = query.where(LeetCodeProblem.is_solved == is_solved)
    
    query = query.offset(skip).limit(limit).order_by(LeetCodeProblem.problem_number)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/stats")
async def get_problem_stats(db: AsyncSession = Depends(get_db)):
    """Get LeetCode statistics."""
    # Total problems
    total_result = await db.execute(select(func.count(LeetCodeProblem.id)))
    total = total_result.scalar()
    
    # Solved problems
    solved_result = await db.execute(
        select(func.count(LeetCodeProblem.id)).where(LeetCodeProblem.is_solved == True)
    )
    solved = solved_result.scalar()
    
    # By difficulty
    difficulty_stats = {}
    for diff in ["Easy", "Medium", "Hard"]:
        diff_result = await db.execute(
            select(func.count(LeetCodeProblem.id)).where(
                LeetCodeProblem.difficulty == diff,
                LeetCodeProblem.is_solved == True
            )
        )
        difficulty_stats[diff.lower()] = diff_result.scalar()
    
    return {
        "total": total,
        "solved": solved,
        "easy": difficulty_stats.get("easy", 0),
        "medium": difficulty_stats.get("medium", 0),
        "hard": difficulty_stats.get("hard", 0),
    }


@router.get("/{problem_id}", response_model=LeetCodeProblemResponse)
async def get_problem(problem_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific problem by ID."""
    result = await db.execute(
        select(LeetCodeProblem).where(LeetCodeProblem.id == problem_id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@router.post("/", response_model=LeetCodeProblemResponse, status_code=status.HTTP_201_CREATED)
async def create_problem(
    problem: LeetCodeProblemCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new LeetCode problem entry."""
    # Check if problem number already exists
    existing = await db.execute(
        select(LeetCodeProblem).where(
            LeetCodeProblem.problem_number == problem.problem_number
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="Problem with this number already exists"
        )
    
    db_problem = LeetCodeProblem(**problem.model_dump())
    db.add(db_problem)
    await db.commit()
    await db.refresh(db_problem)
    return db_problem


@router.put("/{problem_id}", response_model=LeetCodeProblemResponse)
async def update_problem(
    problem_id: int,
    problem: LeetCodeProblemUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a LeetCode problem."""
    result = await db.execute(
        select(LeetCodeProblem).where(LeetCodeProblem.id == problem_id)
    )
    db_problem = result.scalar_one_or_none()
    if not db_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    update_data = problem.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_problem, field, value)
    
    await db.commit()
    await db.refresh(db_problem)
    return db_problem


@router.post("/{problem_id}/solve", response_model=LeetCodeProblemResponse)
async def mark_as_solved(problem_id: int, db: AsyncSession = Depends(get_db)):
    """Mark a problem as solved and increment solve count."""
    result = await db.execute(
        select(LeetCodeProblem).where(LeetCodeProblem.id == problem_id)
    )
    db_problem = result.scalar_one_or_none()
    if not db_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    db_problem.is_solved = True
    db_problem.times_solved += 1
    db_problem.last_solved = datetime.utcnow()
    
    await db.commit()
    await db.refresh(db_problem)
    return db_problem


@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_problem(problem_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a LeetCode problem."""
    result = await db.execute(
        select(LeetCodeProblem).where(LeetCodeProblem.id == problem_id)
    )
    db_problem = result.scalar_one_or_none()
    if not db_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    await db.delete(db_problem)
    await db.commit()
