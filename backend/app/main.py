from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import init_db, connect_mongodb, close_mongodb
from .routers import (
    jobs_router,
    leetcode_router,
    techstack_router,
    projects_router,
    ongoing_projects_router,
    todos_router,
    dashboard_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    await init_db()
    await connect_mongodb()
    yield
    # Shutdown
    await close_mongodb()


app = FastAPI(
    title=settings.APP_NAME,
    description="Personal Job Tracker and Problem Solving Tracker for Developers",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")
app.include_router(leetcode_router, prefix="/api")
app.include_router(techstack_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(ongoing_projects_router, prefix="/api")
app.include_router(todos_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to DevTracker API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
