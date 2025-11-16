import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Keep titles under 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or fewer')
    .optional()
    .transform((value) => value ?? ''),
  priority: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Select a priority'
  }),
  due_date: z.string({ required_error: 'Due date is required' }),
  status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending')
});

export const taskFiltersSchema = z.object({
  search: z.string().optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High', 'all']).optional().default('all'),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'all']).optional().default('all'),
  sort: z.enum(['due_date', 'priority', 'created_at']).optional().default('due_date')
});
