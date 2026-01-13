# DevTracker 🚀

A modern, glassmorphism-styled personal job tracker and problem-solving tracker for developers and job seekers. Built with FastAPI, Next.js, and TailwindCSS.

![DevTracker Dashboard](https://via.placeholder.com/1200x600/1e293b/ffffff?text=DevTracker+Dashboard)

## ✨ Features

### 🎯 Dashboard
- **Real-time Clock** with greeting based on time of day
- **Contribution Heatmap** (like LeetCode/GitHub)
- **Quick Stats** overview of all activities
- **Daily Todo List** with priorities
- **Recent Activity** feed

### 💼 Job Tracker
- Track job applications with status updates
- Company details, salary range, location
- Careers page links
- **Resources per company**: Interview problems, past experiences, goals
- Filterable and searchable table

### 🧩 LeetCode Tracker
- Track solved problems with difficulty levels
- Notes and solution approaches
- Time/Space complexity tracking
- Statistics by difficulty
- Mark as solved/unsolved

### 📁 Projects Showcase
- **Project Cards** with images and tech stack
- Demo and GitHub links
- Featured projects highlighting
- Detailed modal view
- Filter by status (completed, in-progress, planned)

### 📊 Progress Tracker
- Ongoing projects with deadlines
- Daily goals per project
- Progress percentage tracking
- Priority levels (low, medium, high)
- Expandable project details

### 🛠️ Tech Stack
- Add technologies you know
- Proficiency levels (1-5 stars)
- Categories (Languages, Frontend, Backend, etc.)
- Custom icons and colors
- Visual skill representation

### ✅ Todos
- Daily task management
- Priority and category tags
- Due date tracking
- Grouped by date (Today, Tomorrow, Overdue)
- Completion toggle

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL ORM with async support
- **SQLite/PostgreSQL** - SQL database
- **MongoDB** - NoSQL database (optional)
- **Pydantic** - Data validation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd devtracker/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Run the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd devtracker/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
devtracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI application
│   │   ├── config.py         # Configuration settings
│   │   ├── database.py       # Database connections
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── routers/          # API routes
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/              # Next.js App Router pages
    │   │   ├── page.tsx      # Dashboard
    │   │   ├── jobs/         # Job tracker
    │   │   ├── leetcode/     # LeetCode tracker
    │   │   ├── projects/     # Projects showcase
    │   │   ├── progress/     # Progress tracker
    │   │   ├── techstack/    # Tech stack
    │   │   ├── todos/        # Todo list
    │   │   └── settings/     # Settings
    │   ├── components/
    │   │   ├── layout/       # Sidebar, Header
    │   │   ├── dashboard/    # Dashboard widgets
    │   │   └── ui/           # Reusable UI components
    │   └── lib/
    │       └── api.ts        # API client
    ├── package.json
    └── tailwind.config.js
```

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Dark Theme** - Easy on the eyes
- **Gradient Accents** - Purple to pink gradients
- **Smooth Animations** - Framer Motion powered
- **Responsive Design** - Works on all screen sizes
- **Background Orbs** - Animated gradient blobs

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/contributions` - Get contribution heatmap data
- `POST /api/dashboard/log-contribution` - Log daily contribution

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job
- `GET /api/jobs/{id}/resources` - Get job resources

### LeetCode
- `GET /api/leetcode` - List all problems
- `GET /api/leetcode/stats` - Get statistics
- `POST /api/leetcode/{id}/solve` - Mark as solved

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/featured` - Get featured projects

### Tech Stack
- `GET /api/techstack` - List all technologies
- `GET /api/techstack/categories` - Get categories

### Todos
- `GET /api/todos/today` - Get today's todos
- `POST /api/todos/{id}/toggle` - Toggle completion

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for developers by developers
