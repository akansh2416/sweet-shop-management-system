import api from './client';
import  type { Sweet, AuthResponse } from '../types';

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

export const sweetsAPI = {
  getAll: () => api.get<Sweet[]>('/sweets'),
  getById: (id: number) => api.get<Sweet>(`/sweets/${id}`),
  search: (query: string) => 
    api.get<{ data: Sweet[] }>('/sweets/search', { params: { q: query } }),
  create: (data: Omit<Sweet, 'id' | 'createdAt'>) =>
    api.post<Sweet>('/sweets', data),
  update: (id: number, data: Partial<Sweet>) =>
    api.put<Sweet>(`/sweets/${id}`, data),
  delete: (id: number) => api.delete(`/sweets/${id}`),
};

export const inventoryAPI = {
  purchase: (sweetId: number, quantity: number) =>
    api.post('/inventory/purchase', { sweetId, quantity }),
  restock: (sweetId: number, quantity: number) =>
    api.post('/inventory/restock', { sweetId, quantity }),
  getLowStock: () => api.get<Sweet[]>('/inventory/low-stock'),
};

export const checkHealth = () => api.get('/health');