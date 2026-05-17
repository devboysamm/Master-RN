import { request } from './client';
import type { AppContent } from './mock';

export const getAppContent = () => request<AppContent>('/api/app-content');
