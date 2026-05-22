import { request } from './client';

export type ProblemReportInput = {
  message: string;
  category?: string;
  app_version?: string;
  platform?: string;
  user_email?: string;
};

/** Submit a problem report to the backend (public endpoint, no auth). */
export function submitProblemReport(body: ProblemReportInput) {
  return request<{ id: number }>('/api/problem-reports', {
    method: 'POST',
    body,
  });
}
