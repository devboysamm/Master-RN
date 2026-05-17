import { request } from './client';
import type { Module, Lesson } from './mock';

export const getModules    = () => request<Module[]>('/api/modules');
export const getModule     = (id: number) => request<Module>(`/api/modules/${id}`);
export const getModuleLessons = (id: number) => request<Lesson[]>(`/api/modules/${id}/lessons`);
