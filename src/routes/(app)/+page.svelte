<script>
  import TaskCard from '$lib/components/task/TaskCard.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Textarea from '$lib/components/ui/textarea.svelte';
  import Select from '$lib/components/ui/select.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import Alert from '$lib/components/ui/alert.svelte';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { toast } from '$lib/components/ui/use-toast.js';

  export let data;
  export let form;

  const defaultCreateValues = {
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    status: 'Pending'
  };

  let createState = {
    values: { ...defaultCreateValues },
    errors: {},
    message: '',
    success: false
  };

  let pendingCreate = false;

  // Handle create form via enhance
  const handleCreateEnhance = ({ form }) => {
    pendingCreate = true;
    return async ({ result }) => {
      pendingCreate = false;

      if (result.type === 'success') {
        createState = {
          values: { ...defaultCreateValues },
          errors: {},
          message: 'Task created successfully!',
          success: true
        };

        toast({
          title: 'Task created',
          description: 'Your task was saved successfully.',
          variant: 'success'
        });

        // reload tasks list
        await invalidateAll();
        form.reset();
      } else if (result.type === 'failure') {
        createState = {
          values: result.data?.values ?? { ...defaultCreateValues },
          errors: result.data?.errors ?? {},
          message: result.data?.message ?? 'Unable to create task.',
          success: false
        };
      }

      return result;
    };
  };

  const submitFilter = (event) => {
    event.currentTarget.form?.requestSubmit();
  };

  // If server-side validation fails on create, keep the values/errors
  $: if (form && form.action === 'create') {
    const hasErrors = form.errors && Object.keys(form.errors).length > 0;
    const hasMessage = Boolean(form.message);
    if (hasErrors || hasMessage) {
      createState = {
        values: form.values ?? { ...defaultCreateValues },
        errors: form.errors ?? {},
        message: form.message ?? '',
        success: form.success ?? false
      };
    }
  }
</script>

<div class="space-y-8">
  <!-- CREATE TASK -->
  <section class="grid gap-4 rounded-xl border border-border bg-card/70 p-6 shadow-sm">
    <div>
      <h2 class="text-xl font-semibold">Create a task</h2>
      <p class="text-sm text-muted-foreground">Provide details below to keep track of your work.</p>
    </div>

    {#if createState.message}
      <Alert variant={createState.success ? 'success' : 'destructive'}>
        {createState.message}
      </Alert>
    {/if}

    <form
      method="POST"
      action="?/create"
      class="grid gap-4"
      use:enhance={handleCreateEnhance}
    >
      <div class="grid gap-2">
        <Label forId="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Draft project proposal"
          maxlength={100}
          required
          value={createState.values.title}
          className={createState.errors.title
            ? 'border-destructive focus-visible:ring-destructive'
            : ''}
        />
        {#if createState.errors.title}
          <p class="text-sm text-destructive">{createState.errors.title}</p>
        {/if}
      </div>

      <div class="grid gap-2">
        <Label forId="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          maxlength={500}
          placeholder="Add any extra context or acceptance criteria"
          value={createState.values.description}
        />
        {#if createState.errors.description}
          <p class="text-sm text-destructive">{createState.errors.description}</p>
        {/if}
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div class="grid gap-2">
          <Label forId="priority">Priority</Label>
          <Select
            id="priority"
            name="priority"
            required
            value={createState.values.priority}
            className={createState.errors.priority
              ? 'border-destructive focus-visible:ring-destructive'
              : ''}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          {#if createState.errors.priority}
            <p class="text-sm text-destructive">{createState.errors.priority}</p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label forId="due_date">Due date</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            required
            value={createState.values.due_date}
            className={createState.errors.due_date
              ? 'border-destructive focus-visible:ring-destructive'
              : ''}
          />
          {#if createState.errors.due_date}
            <p class="text-sm text-destructive">{createState.errors.due_date}</p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label forId="status">Status</Label>
          <Select id="status" name="status" value={createState.values.status}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <Button type="submit" disabled={pendingCreate}>
          {#if pendingCreate}
            Saving...
          {:else}
            Add task
          {/if}
        </Button>
      </div>
    </form>
  </section>

  <!-- TASK LIST / FILTERS -->
  <section class="space-y-4">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-xl font-semibold">Your tasks</h2>
        <p class="text-sm text-muted-foreground">
          Sort, filter and search to find what you need quickly.
        </p>
      </div>
    </div>

    <form method="GET" class="grid gap-4 rounded-xl border border-border bg-card/70 p-4 shadow-sm">
      <div class="grid gap-3 md:grid-cols-4">
        <div class="grid gap-2">
          <Label forId="search">Search</Label>
          <Input
            id="search"
            name="search"
            placeholder="Search by title"
            value={data.filters.search}
            on:change={submitFilter}
          />
        </div>

        <div class="grid gap-2">
          <Label forId="status-filter">Status</Label>
          <Select
            id="status-filter"
            name="status"
            value={data.filters.status}
            on:change={submitFilter}
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label forId="priority-filter">Priority</Label>
          <Select
            id="priority-filter"
            name="priority"
            value={data.filters.priority}
            on:change={submitFilter}
          >
            <option value="all">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label forId="sort">Sort by</Label>
          <Select
            id="sort"
            name="sort"
            value={data.filters.sort}
            on:change={submitFilter}
          >
            <option value="due_date">Due date</option>
            <option value="priority">Priority</option>
            <option value="created_at">Created date</option>
          </Select>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <Button type="submit" variant="secondary">Apply filters</Button>

        <!-- 🔧 FIX: reset filters by going to same route with no query params -->
        <a
          href="."
          class="text-sm font-medium text-primary hover:underline"
        >
          Reset filters
        </a>
      </div>
    </form>

    {#if data.tasks.length === 0}
      <div class="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <h3 class="text-lg font-semibold">No tasks yet</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Create your first task using the form above. Tasks you add will show up here and sync per
          account.
        </p>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {#each data.tasks as task (task.id)}
          <TaskCard {task} />
        {/each}
      </div>
    {/if}
  </section>
</div>
