// src/routes/(app)/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { taskSchema, taskFiltersSchema } from '$lib/validation/task.js';
import { z } from 'zod';

const formatErrors = (error) => {
  const { fieldErrors } = error.flatten();
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
  );
};

const updateSchema = taskSchema.extend({
  id: z.string({ required_error: 'Task id missing' })
});

const deleteSchema = z.object({
  id: z.string({ required_error: 'Task id missing' })
});

const toggleSchema = z.object({
  id: z.string({ required_error: 'Task id missing' }),
  status: z.enum(['Pending', 'In Progress', 'Completed'])
});

export const load = async ({ locals, url }) => {
  const session = await locals.getSession();
  if (!session) {
    // redirect to login if not signed in
    throw redirect(303, '/auth');
  }

  const filters = taskFiltersSchema.parse({
    search: url.searchParams.get('search') ?? '',
    priority: url.searchParams.get('priority') ?? 'all',
    status: url.searchParams.get('status') ?? 'all',
    sort: url.searchParams.get('sort') ?? 'due_date'
  });

  let query = locals.supabase
    .from('tasks')
    .select('*')
    .eq('user_id', session.user.id);

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const order =
    filters.sort === 'priority'
      ? { column: 'priority', ascending: true }
      : filters.sort === 'created_at'
        ? { column: 'created_at', ascending: false }
        : { column: 'due_date', ascending: true };

  query = query.order(order.column, { ascending: order.ascending });

  const { data: tasks, error } = await query;

  // IMPORTANT: don't throw here – just log and return empty list
  if (error) {
    console.error('Error loading tasks', error);
    return {
      tasks: [],
      filters,
      loadError: 'Could not load tasks.'
    };
  }

  return {
    tasks: tasks ?? [],
    filters,
    loadError: null
  };
};

export const actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const raw = {
      title: formData.get('title'),
      description: formData.get('description') ?? '',
      priority: formData.get('priority'),
      due_date: formData.get('due_date'),
      status: formData.get('status') ?? 'Pending'
    };

    const parsed = taskSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        action: 'create',
        errors: formatErrors(parsed.error),
        values: raw,
        message: 'Please correct the highlighted fields.'
      });
    }

    const session = await locals.getSession();
    if (!session) {
      return fail(401, {
        action: 'create',
        values: raw,
        message: 'You must be signed in to create a task.'
      });
    }

    const payload = {
      ...parsed.data,
      user_id: session.user.id,
      updated_at: new Date().toISOString()
    };

    const { error } = await locals.supabase.from('tasks').insert(payload);

    if (error) {
      console.error('Error creating task', error);
      return fail(400, {
        action: 'create',
        values: parsed.data,
        message: 'Could not create task.'
      });
    }

    return { success: true, action: 'create' };
  },

  // 🔧 UPDATE: update DB, then redirect back – no 500s
  update: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const raw = {
      id: formData.get('id'),
      title: formData.get('title'),
      description: formData.get('description') ?? '',
      priority: formData.get('priority'),
      due_date: formData.get('due_date'),
      status: formData.get('status') ?? 'Pending'
    };

    const parsed = updateSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        action: 'update',
        errors: formatErrors(parsed.error),
        values: raw,
        message: 'Please review the task details.'
      });
    }

    const session = await locals.getSession();
    if (!session) {
      return fail(401, {
        action: 'update',
        values: raw,
        message: 'You must be signed in to update a task.'
      });
    }

    const { id, ...updateValues } = parsed.data;
    updateValues.updated_at = new Date().toISOString();

    const { error } = await locals.supabase
      .from('tasks')
      .update(updateValues)
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating task', error);
      return fail(400, {
        action: 'update',
        values: parsed.data,
        message: 'Unable to update the task.'
      });
    }

    // ⬅️ this is the key: go back to the task list, no ?/update 500 page
    throw redirect(303, url.pathname + url.search);
  },

  delete: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const raw = { id: formData.get('id') };

    const parsed = deleteSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { action: 'delete', message: 'Task identifier missing.' });
    }

    const session = await locals.getSession();
    if (!session) {
      return fail(401, { action: 'delete', message: 'You must be signed in to delete a task.' });
    }

    const { error } = await locals.supabase
      .from('tasks')
      .delete()
      .eq('id', parsed.data.id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting task', error);
      return fail(400, { action: 'delete', message: 'Unable to delete task.' });
    }

    throw redirect(303, url.pathname + url.search);
  },

  toggle: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const raw = {
      id: formData.get('id'),
      status: formData.get('status')
    };

    const parsed = toggleSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { action: 'toggle', message: 'Task identifier missing.' });
    }

    const session = await locals.getSession();
    if (!session) {
      return fail(401, { action: 'toggle', message: 'You must be signed in to update status.' });
    }

    const nextStatus =
      parsed.data.status === 'Completed' ? 'Pending' : 'Completed';

    const { error } = await locals.supabase
      .from('tasks')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .match({ id: parsed.data.id, user_id: session.user.id });

    if (error) {
      console.error('Error toggling task status', error);
      return fail(400, { action: 'toggle', message: 'Unable to update status.' });
    }

    // keep behavior consistent: reload the page with updated status
    throw redirect(303, url.pathname + url.search);
  }
};
