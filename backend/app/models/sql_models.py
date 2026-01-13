from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base


class JobStatus(str, enum.Enum):
    """Enum for job application status."""
    WISHLIST = "wishlist"
    APPLIED = "applied"
    PHONE_SCREEN = "phone_screen"
    TECHNICAL = "technical"
    ONSITE = "onsite"
    OFFER = "offer"
    REJECTED = "rejected"
    ACCEPTED = "accepted"
    WITHDRAWN = "withdrawn"


class Job(Base):
    """Job application tracking model."""
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False, index=True)
    position = Column(String(255), nullable=False)
    status = Column(SQLEnum(JobStatus), default=JobStatus.WISHLIST)
    careers_link = Column(String(512))
    location = Column(String(255))
    salary_range = Column(String(100))
    notes = Column(Text)
    applied_date = Column(DateTime)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    resources = relationship("JobResource", back_populates="job", cascade="all, delete-orphan")


class JobResource(Base):
    """Resources related to a job (problems, experiences, goals)."""
    __tablename__ = "job_resources"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    resource_type = Column(String(50), nullable=False)  # problem, experience, goal
    title = Column(String(255), nullable=False)
    content = Column(Text)
    link = Column(String(512))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="resources")


class LeetCodeProblem(Base):
    """LeetCode problems tracking model."""
    __tablename__ = "leetcode_problems"
    
    id = Column(Integer, primary_key=True, index=True)
    problem_number = Column(Integer, nullable=False, unique=True)
    title = Column(String(255), nullable=False)
    difficulty = Column(String(20), nullable=False)  # Easy, Medium, Hard
    topic = Column(String(100))
    link = Column(String(512))
    notes = Column(Text)
    solution_approach = Column(Text)
    time_complexity = Column(String(50))
    space_complexity = Column(String(50))
    is_solved = Column(Boolean, default=False)
    times_solved = Column(Integer, default=0)
    last_solved = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class TechStack(Base):
    """User's tech stack with proficiency levels."""
    __tablename__ = "tech_stack"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    category = Column(String(50), nullable=False)  # language, framework, database, tool, etc.
    proficiency = Column(Integer, default=1)  # 1-5 scale
    icon = Column(String(100))  # Icon identifier
    color = Column(String(20))  # Hex color code
    created_at = Column(DateTime, default=datetime.utcnow)


class Project(Base):
    """Personal projects showcase model."""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    brief_description = Column(String(500))
    demo_link = Column(String(512))
    github_link = Column(String(512))
    image_url = Column(String(512))
    tech_stack = Column(Text)  # JSON array of technologies
    is_featured = Column(Boolean, default=False)
    status = Column(String(50), default="completed")  # completed, in_progress, planned
    created_at = Column(DateTime, default=datetime.utcnow)


class OngoingProject(Base):
    """Ongoing project progress tracker."""
    __tablename__ = "ongoing_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    deadline = Column(DateTime)
    progress = Column(Integer, default=0)  # 0-100 percentage
    priority = Column(String(20), default="medium")  # low, medium, high
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    daily_goals = relationship("DailyGoal", back_populates="project", cascade="all, delete-orphan")


class DailyGoal(Base):
    """Daily goals for ongoing projects."""
    __tablename__ = "daily_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("ongoing_projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    is_completed = Column(Boolean, default=False)
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("OngoingProject", back_populates="daily_goals")


class TodoItem(Base):
    """Daily todo items for the dashboard."""
    __tablename__ = "todo_items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    is_completed = Column(Boolean, default=False)
    priority = Column(String(20), default="medium")
    due_date = Column(DateTime)
    category = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class DailyContribution(Base):
    """Track daily contributions (like GitHub/LeetCode heatmap)."""
    __tablename__ = "daily_contributions"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, unique=True)
    problems_solved = Column(Integer, default=0)
    jobs_applied = Column(Integer, default=0)
    todos_completed = Column(Integer, default=0)
    projects_worked = Column(Integer, default=0)
    total_contributions = Column(Integer, default=0)
