from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from ..database import get_db
from ..models import TechStack
from ..schemas import TechStackCreate, TechStackUpdate, TechStackResponse

router = APIRouter(prefix="/techstack", tags=["Tech Stack"])


@router.get("/", response_model=List[TechStackResponse])
async def get_all_tech_stack(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all tech stack items with optional category filter."""
    query = select(TechStack)
    if category:
        query = query.where(TechStack.category == category)
    query = query.order_by(TechStack.category, TechStack.proficiency.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Get all unique categories."""
    result = await db.execute(
        select(TechStack.category).distinct()
    )
    categories = result.scalars().all()
    return {"categories": categories}


@router.get("/{tech_id}", response_model=TechStackResponse)
async def get_tech(tech_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific tech stack item by ID."""
    result = await db.execute(select(TechStack).where(TechStack.id == tech_id))
    tech = result.scalar_one_or_none()
    if not tech:
        raise HTTPException(status_code=404, detail="Tech stack item not found")
    return tech


@router.post("/", response_model=TechStackResponse, status_code=status.HTTP_201_CREATED)
async def create_tech(tech: TechStackCreate, db: AsyncSession = Depends(get_db)):
    """Create a new tech stack item."""
    # Check if name already exists
    existing = await db.execute(
        select(TechStack).where(TechStack.name == tech.name)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="Tech with this name already exists"
        )
    
    db_tech = TechStack(**tech.model_dump())
    db.add(db_tech)
    await db.commit()
    await db.refresh(db_tech)
    return db_tech


@router.put("/{tech_id}", response_model=TechStackResponse)
async def update_tech(
    tech_id: int,
    tech: TechStackUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a tech stack item."""
    result = await db.execute(select(TechStack).where(TechStack.id == tech_id))
    db_tech = result.scalar_one_or_none()
    if not db_tech:
        raise HTTPException(status_code=404, detail="Tech stack item not found")
    
    update_data = tech.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tech, field, value)
    
    await db.commit()
    await db.refresh(db_tech)
    return db_tech


@router.delete("/{tech_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tech(tech_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a tech stack item."""
    result = await db.execute(select(TechStack).where(TechStack.id == tech_id))
    db_tech = result.scalar_one_or_none()
    if not db_tech:
        raise HTTPException(status_code=404, detail="Tech stack item not found")
    
    await db.delete(db_tech)
    await db.commit()
