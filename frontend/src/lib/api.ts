import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Dashboard
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getContributions: (days = 365) => api.get(`/dashboard/contributions?days=${days}`),
  getTime: () => api.get('/dashboard/time'),
  logContribution: (data: {
    problems_solved?: number;
    jobs_applied?: number;
    todos_completed?: number;
    projects_worked?: number;
  }) => api.post('/dashboard/log-contribution', null, { params: data }),
};

// Jobs
export const jobsApi = {
  getAll: (status?: string) => api.get('/jobs', { params: { status } }),
  getById: (id: number) => api.get(`/jobs/${id}`),
  create: (job: any) => api.post('/jobs', job),
  update: (id: number, job: any) => api.put(`/jobs/${id}`, job),
  delete: (id: number) => api.delete(`/jobs/${id}`),
  getResources: (jobId: number) => api.get(`/jobs/${jobId}/resources`),
  createResource: (jobId: number, resource: any) => api.post(`/jobs/${jobId}/resources`, resource),
  deleteResource: (jobId: number, resourceId: number) =>
    api.delete(`/jobs/${jobId}/resources/${resourceId}`),
};

// LeetCode
export const leetcodeApi = {
  getAll: (filters?: { difficulty?: string; topic?: string; is_solved?: boolean }) =>
    api.get('/leetcode', { params: filters }),
  getStats: () => api.get('/leetcode/stats'),
  getById: (id: number) => api.get(`/leetcode/${id}`),
  create: (problem: any) => api.post('/leetcode', problem),
  update: (id: number, problem: any) => api.put(`/leetcode/${id}`, problem),
  markAsSolved: (id: number) => api.post(`/leetcode/${id}/solve`),
  delete: (id: number) => api.delete(`/leetcode/${id}`),
};

// Projects
export const projectsApi = {
  getAll: (filters?: { status?: string; is_featured?: boolean }) =>
    api.get('/projects', { params: filters }),
  getFeatured: () => api.get('/projects/featured'),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (project: any) => api.post('/projects', project),
  update: (id: number, project: any) => api.put(`/projects/${id}`, project),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Ongoing Projects
export const ongoingProjectsApi = {
  getAll: (priority?: string) => api.get('/ongoing-projects', { params: { priority } }),
  getById: (id: number) => api.get(`/ongoing-projects/${id}`),
  create: (project: any) => api.post('/ongoing-projects', project),
  update: (id: number, project: any) => api.put(`/ongoing-projects/${id}`, project),
  delete: (id: number) => api.delete(`/ongoing-projects/${id}`),
  getGoals: (projectId: number) => api.get(`/ongoing-projects/${projectId}/goals`),
  createGoal: (goal: any) => api.post('/ongoing-projects/goals', goal),
  updateGoal: (goalId: number, goal: any) => api.put(`/ongoing-projects/goals/${goalId}`, goal),
  deleteGoal: (goalId: number) => api.delete(`/ongoing-projects/goals/${goalId}`),
};

// Tech Stack
export const techStackApi = {
  getAll: (category?: string) => api.get('/techstack', { params: { category } }),
  getCategories: () => api.get('/techstack/categories'),
  getById: (id: number) => api.get(`/techstack/${id}`),
  create: (tech: any) => api.post('/techstack', tech),
  update: (id: number, tech: any) => api.put(`/techstack/${id}`, tech),
  delete: (id: number) => api.delete(`/techstack/${id}`),
};

// Todos
export const todosApi = {
  getAll: (filters?: {
    is_completed?: boolean;
    category?: string;
    priority?: string;
    today_only?: boolean;
  }) => api.get('/todos', { params: filters }),
  getToday: () => api.get('/todos/today'),
  getById: (id: number) => api.get(`/todos/${id}`),
  create: (todo: any) => api.post('/todos', todo),
  update: (id: number, todo: any) => api.put(`/todos/${id}`, todo),
  toggle: (id: number) => api.post(`/todos/${id}/toggle`),
  delete: (id: number) => api.delete(`/todos/${id}`),
};

export default api;
