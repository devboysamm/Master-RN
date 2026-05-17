import { request } from './client';
import type { Lesson } from './mock';

export const getLesson = (id: number) => request<Lesson>(`/api/lessons/${id}`);
