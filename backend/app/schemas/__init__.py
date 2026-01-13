from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ============ Job Schemas ============

class JobStatus(str, Enum):
    WISHLIST = "wishlist"
    APPLIED = "applied"
    PHONE_SCREEN = "phone_screen"
    TECHNICAL = "technical"
    ONSITE = "onsite"
    OFFER = "offer"
    REJECTED = "rejected"
    ACCEPTED = "accepted"
    WITHDRAWN = "withdrawn"


class JobResourceBase(BaseModel):
    resource_type: str
    title: str
    content: Optional[str] = None
    link: Optional[str] = None


class JobResourceCreate(JobResourceBase):
    pass


class JobResourceResponse(JobResourceBase):
    id: int
    job_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class JobBase(BaseModel):
    company_name: str
    position: str
    status: JobStatus = JobStatus.WISHLIST
    careers_link: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    company_name: Optional[str] = None
    position: Optional[str] = None
    status: Optional[JobStatus] = None
    careers_link: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None


class JobResponse(JobBase):
    id: int
    last_updated: Optional[datetime] = None
    created_at: datetime
    resources: List[JobResourceResponse] = []
    
    class Config:
        from_attributes = True


# ============ LeetCode Schemas ============

class LeetCodeProblemBase(BaseModel):
    problem_number: int
    title: str
    difficulty: str
    topic: Optional[str] = None
    link: Optional[str] = None
    notes: Optional[str] = None
    solution_approach: Optional[str] = None
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None
    is_solved: bool = False


class LeetCodeProblemCreate(LeetCodeProblemBase):
    pass


class LeetCodeProblemUpdate(BaseModel):
    title: Optional[str] = None
    difficulty: Optional[str] = None
    topic: Optional[str] = None
    link: Optional[str] = None
    notes: Optional[str] = None
    solution_approach: Optional[str] = None
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None
    is_solved: Optional[bool] = None


class LeetCodeProblemResponse(LeetCodeProblemBase):
    id: int
    times_solved: int
    last_solved: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Tech Stack Schemas ============

class TechStackBase(BaseModel):
    name: str
    category: str
    proficiency: int = Field(ge=1, le=5, default=1)
    icon: Optional[str] = None
    color: Optional[str] = None


class TechStackCreate(TechStackBase):
    pass


class TechStackUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = Field(ge=1, le=5, default=None)
    icon: Optional[str] = None
    color: Optional[str] = None


class TechStackResponse(TechStackBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Project Schemas ============

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    brief_description: Optional[str] = None
    demo_link: Optional[str] = None
    github_link: Optional[str] = None
    image_url: Optional[str] = None
    tech_stack: Optional[str] = None
    is_featured: bool = False
    status: str = "completed"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    brief_description: Optional[str] = None
    demo_link: Optional[str] = None
    github_link: Optional[str] = None
    image_url: Optional[str] = None
    tech_stack: Optional[str] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Ongoing Project Schemas ============

class DailyGoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    due_date: Optional[datetime] = None


class DailyGoalCreate(DailyGoalBase):
    project_id: int


class DailyGoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime] = None


class DailyGoalResponse(DailyGoalBase):
    id: int
    project_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class OngoingProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    progress: int = Field(ge=0, le=100, default=0)
    priority: str = "medium"


class OngoingProjectCreate(OngoingProjectBase):
    pass


class OngoingProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    progress: Optional[int] = Field(ge=0, le=100, default=None)
    priority: Optional[str] = None


class OngoingProjectResponse(OngoingProjectBase):
    id: int
    created_at: datetime
    daily_goals: List[DailyGoalResponse] = []
    
    class Config:
        from_attributes = True


# ============ Todo Schemas ============

class TodoItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    priority: str = "medium"
    due_date: Optional[datetime] = None
    category: Optional[str] = None


class TodoItemCreate(TodoItemBase):
    pass


class TodoItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = None


class TodoItemResponse(TodoItemBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Dashboard Schemas ============

class DailyContributionBase(BaseModel):
    date: datetime
    problems_solved: int = 0
    jobs_applied: int = 0
    todos_completed: int = 0
    projects_worked: int = 0


class DailyContributionResponse(DailyContributionBase):
    id: int
    total_contributions: int
    
    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_jobs: int
    active_applications: int
    problems_solved: int
    projects_count: int
    todos_today: int
    todos_completed_today: int
    current_streak: int
    total_contributions: int


class ContributionHeatmap(BaseModel):
    date: str
    count: int
    level: int  # 0-4 for intensity
