import { request } from './client';
import type { Module } from './mock';

export type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
  order_index: number;
  module_count?: number;
};

export const getCategories = () => request<Category[]>('/api/categories');
export const getCategoryModules = (id: number) =>
  request<Module[]>(`/api/categories/${id}/modules`);
