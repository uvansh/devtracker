from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import Job, JobResource, JobStatus
from ..schemas import (
    JobCreate, JobUpdate, JobResponse,
    JobResourceCreate, JobResourceResponse
)

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/", response_model=List[JobResponse])
async def get_all_jobs(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all job applications with optional status filter."""
    query = select(Job)
    if status:
        query = query.where(Job.status == status)
    query = query.offset(skip).limit(limit).order_by(Job.last_updated.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific job by ID."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(job: JobCreate, db: AsyncSession = Depends(get_db)):
    """Create a new job application."""
    db_job = Job(**job.model_dump())
    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)
    return db_job


@router.put("/{job_id}", response_model=JobResponse)
async def update_job(job_id: int, job: JobUpdate, db: AsyncSession = Depends(get_db)):
    """Update a job application."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    db_job = result.scalar_one_or_none()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = job.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_job, field, value)
    
    await db.commit()
    await db.refresh(db_job)
    return db_job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a job application."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    db_job = result.scalar_one_or_none()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    await db.delete(db_job)
    await db.commit()


# Job Resources Routes
@router.get("/{job_id}/resources", response_model=List[JobResourceResponse])
async def get_job_resources(job_id: int, db: AsyncSession = Depends(get_db)):
    """Get all resources for a job."""
    result = await db.execute(
        select(JobResource).where(JobResource.job_id == job_id)
    )
    return result.scalars().all()


@router.post("/{job_id}/resources", response_model=JobResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_job_resource(
    job_id: int,
    resource: JobResourceCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new resource for a job."""
    # Verify job exists
    result = await db.execute(select(Job).where(Job.id == job_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_resource = JobResource(job_id=job_id, **resource.model_dump())
    db.add(db_resource)
    await db.commit()
    await db.refresh(db_resource)
    return db_resource


@router.delete("/{job_id}/resources/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_resource(
    job_id: int,
    resource_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a job resource."""
    result = await db.execute(
        select(JobResource).where(
            JobResource.id == resource_id,
            JobResource.job_id == job_id
        )
    )
    db_resource = result.scalar_one_or_none()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    await db.delete(db_resource)
    await db.commit()
