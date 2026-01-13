from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime, date, timedelta

from ..database import get_db
from ..models import TodoItem, DailyContribution
from ..schemas import TodoItemCreate, TodoItemUpdate, TodoItemResponse

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.get("/", response_model=List[TodoItemResponse])
async def get_all_todos(
    is_completed: Optional[bool] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    today_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Get all todos with optional filters."""
    query = select(TodoItem)
    
    if is_completed is not None:
        query = query.where(TodoItem.is_completed == is_completed)
    if category:
        query = query.where(TodoItem.category == category)
    if priority:
        query = query.where(TodoItem.priority == priority)
    if today_only:
        today_start = datetime.combine(date.today(), datetime.min.time())
        today_end = datetime.combine(date.today(), datetime.max.time())
        query = query.where(
            TodoItem.created_at >= today_start,
            TodoItem.created_at <= today_end
        )
    
    query = query.order_by(TodoItem.is_completed, TodoItem.priority.desc(), TodoItem.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/today", response_model=List[TodoItemResponse])
async def get_today_todos(db: AsyncSession = Depends(get_db)):
    """Get today's todos."""
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    
    result = await db.execute(
        select(TodoItem).where(
            TodoItem.due_date >= today_start,
            TodoItem.due_date <= today_end
        ).order_by(TodoItem.is_completed, TodoItem.priority.desc())
    )
    return result.scalars().all()


@router.get("/{todo_id}", response_model=TodoItemResponse)
async def get_todo(todo_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific todo by ID."""
    result = await db.execute(select(TodoItem).where(TodoItem.id == todo_id))
    todo = result.scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.post("/", response_model=TodoItemResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: TodoItemCreate, db: AsyncSession = Depends(get_db)):
    """Create a new todo item."""
    db_todo = TodoItem(**todo.model_dump())
    db.add(db_todo)
    await db.commit()
    await db.refresh(db_todo)
    return db_todo


@router.put("/{todo_id}", response_model=TodoItemResponse)
async def update_todo(
    todo_id: int,
    todo: TodoItemUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a todo item."""
    result = await db.execute(select(TodoItem).where(TodoItem.id == todo_id))
    db_todo = result.scalar_one_or_none()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    update_data = todo.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    await db.commit()
    await db.refresh(db_todo)
    return db_todo


@router.post("/{todo_id}/toggle", response_model=TodoItemResponse)
async def toggle_todo(todo_id: int, db: AsyncSession = Depends(get_db)):
    """Toggle todo completion status."""
    result = await db.execute(select(TodoItem).where(TodoItem.id == todo_id))
    db_todo = result.scalar_one_or_none()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db_todo.is_completed = not db_todo.is_completed
    await db.commit()
    await db.refresh(db_todo)
    return db_todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a todo item."""
    result = await db.execute(select(TodoItem).where(TodoItem.id == todo_id))
    db_todo = result.scalar_one_or_none()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    await db.delete(db_todo)
    await db.commit()
