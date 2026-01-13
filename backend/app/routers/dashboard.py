from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, date, timedelta
from typing import List

from ..database import get_db
from ..models import Job, LeetCodeProblem, Project, TodoItem, DailyContribution
from ..schemas import DashboardStats, ContributionHeatmap

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Get dashboard statistics."""
    # Total jobs
    total_jobs_result = await db.execute(select(func.count(Job.id)))
    total_jobs = total_jobs_result.scalar() or 0
    
    # Active applications (not rejected/withdrawn/accepted)
    active_statuses = ['wishlist', 'applied', 'phone_screen', 'technical', 'onsite', 'offer']
    active_result = await db.execute(
        select(func.count(Job.id)).where(Job.status.in_(active_statuses))
    )
    active_applications = active_result.scalar() or 0
    
    # Problems solved
    problems_result = await db.execute(
        select(func.count(LeetCodeProblem.id)).where(LeetCodeProblem.is_solved == True)
    )
    problems_solved = problems_result.scalar() or 0
    
    # Projects count
    projects_result = await db.execute(select(func.count(Project.id)))
    projects_count = projects_result.scalar() or 0
    
    # Today's todos
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    
    todos_today_result = await db.execute(
        select(func.count(TodoItem.id)).where(
            TodoItem.created_at >= today_start,
            TodoItem.created_at <= today_end
        )
    )
    todos_today = todos_today_result.scalar() or 0
    
    todos_completed_result = await db.execute(
        select(func.count(TodoItem.id)).where(
            TodoItem.created_at >= today_start,
            TodoItem.created_at <= today_end,
            TodoItem.is_completed == True
        )
    )
    todos_completed_today = todos_completed_result.scalar() or 0
    
    # Calculate streak (simplified - consecutive days with contributions)
    current_streak = await calculate_streak(db)
    
    # Total contributions
    total_contributions_result = await db.execute(
        select(func.sum(DailyContribution.total_contributions))
    )
    total_contributions = total_contributions_result.scalar() or 0
    
    return DashboardStats(
        total_jobs=total_jobs,
        active_applications=active_applications,
        problems_solved=problems_solved,
        projects_count=projects_count,
        todos_today=todos_today,
        todos_completed_today=todos_completed_today,
        current_streak=current_streak,
        total_contributions=total_contributions
    )


async def calculate_streak(db: AsyncSession) -> int:
    """Calculate the current contribution streak."""
    streak = 0
    current_date = date.today()
    
    while True:
        result = await db.execute(
            select(DailyContribution).where(
                func.date(DailyContribution.date) == current_date
            )
        )
        contribution = result.scalar_one_or_none()
        
        if contribution and contribution.total_contributions > 0:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    
    return streak


@router.get("/contributions", response_model=List[ContributionHeatmap])
async def get_contribution_heatmap(
    days: int = 365,
    db: AsyncSession = Depends(get_db)
):
    """Get contribution data for heatmap (like LeetCode/GitHub)."""
    start_date = date.today() - timedelta(days=days)
    
    result = await db.execute(
        select(DailyContribution).where(
            DailyContribution.date >= start_date
        ).order_by(DailyContribution.date)
    )
    contributions = result.scalars().all()
    
    # Create a dictionary for quick lookup
    contrib_dict = {
        contrib.date.date(): contrib.total_contributions
        for contrib in contributions
    }
    
    # Generate heatmap data for all days
    heatmap_data = []
    current = start_date
    while current <= date.today():
        count = contrib_dict.get(current, 0)
        level = min(count // 2, 4)  # Convert count to level 0-4
        
        heatmap_data.append(ContributionHeatmap(
            date=current.isoformat(),
            count=count,
            level=level
        ))
        current += timedelta(days=1)
    
    return heatmap_data


@router.post("/log-contribution")
async def log_daily_contribution(
    problems_solved: int = 0,
    jobs_applied: int = 0,
    todos_completed: int = 0,
    projects_worked: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Log or update daily contribution."""
    today = datetime.combine(date.today(), datetime.min.time())
    
    # Check if entry exists for today
    result = await db.execute(
        select(DailyContribution).where(
            func.date(DailyContribution.date) == date.today()
        )
    )
    contribution = result.scalar_one_or_none()
    
    if contribution:
        contribution.problems_solved += problems_solved
        contribution.jobs_applied += jobs_applied
        contribution.todos_completed += todos_completed
        contribution.projects_worked += projects_worked
        contribution.total_contributions = (
            contribution.problems_solved +
            contribution.jobs_applied +
            contribution.todos_completed +
            contribution.projects_worked
        )
    else:
        total = problems_solved + jobs_applied + todos_completed + projects_worked
        contribution = DailyContribution(
            date=today,
            problems_solved=problems_solved,
            jobs_applied=jobs_applied,
            todos_completed=todos_completed,
            projects_worked=projects_worked,
            total_contributions=total
        )
        db.add(contribution)
    
    await db.commit()
    await db.refresh(contribution)
    
    return {"message": "Contribution logged successfully", "total": contribution.total_contributions}


@router.get("/time")
async def get_current_time():
    """Get current time for dashboard display."""
    now = datetime.now()
    return {
        "datetime": now.isoformat(),
        "date": now.strftime("%B %d, %Y"),
        "time": now.strftime("%I:%M %p"),
        "day": now.strftime("%A"),
        "greeting": get_greeting(now.hour)
    }


def get_greeting(hour: int) -> str:
    """Get appropriate greeting based on time of day."""
    if hour < 12:
        return "Good Morning"
    elif hour < 17:
        return "Good Afternoon"
    elif hour < 21:
        return "Good Evening"
    else:
        return "Good Night"
