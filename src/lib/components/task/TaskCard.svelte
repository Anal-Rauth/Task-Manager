<script>
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Textarea from '$lib/components/ui/textarea.svelte';
  import Select from '$lib/components/ui/select.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import { formatDate, fromNow, isOverdue } from '$lib/utils/date.js';
  import { createEventDispatcher, tick } from 'svelte';

  export let task;
  export let pendingAction = false;
  export let formResult = null;

  let editing = false;
  let localTask = { ...task };

  const defaultUpdateState = {
    errors: {},
    message: '',
    success: false
  };

  let updateState = { ...defaultUpdateState };
  const dispatch = createEventDispatcher();

  $: if (!editing) {
    localTask = { ...task };
    updateState = { ...defaultUpdateState };
  }

  const statusVariant = {
    Pending: 'outline',
    'In Progress': 'secondary',
    Completed: 'success'
  };

  const priorityColor = {
    Low: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
    Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    High: 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
  };

  const confirmDelete = (event) => {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      event.preventDefault();
      return false;
    }
    return true;
  };

  const closeEditor = async () => {
    editing = false;
    await tick();
  };

  const notifyPending = () => {
    dispatch('pending');
  };

  const toDateInputValue = (value) => (value ? value.slice(0, 10) : '');

  // Action result reactive handler
  $: if (formResult && formResult.action === 'update') {
    const targetId = formResult.id ?? formResult?.values?.id;

    if (targetId === task.id) {
      if (formResult.success) {
        updateState = { ...defaultUpdateState, success: true };
        editing = false;
      } else {
        editing = true;
        updateState = {
          errors: formResult.errors ?? {},
          message: formResult.message ?? '',
          success: false
        };

        if (formResult.values) {
          const { id: _ignored, ...rest } = formResult.values;
          localTask = { ...localTask, ...rest };
        }
      }
    }
  }
</script>


<!-- CARD -->
<div class="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">

  <!-- HEADER -->
  <div class="flex items-start justify-between gap-3">
    <div class="space-y-1">
      <h3 class="text-lg font-semibold leading-tight">{task.title}</h3>

      <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant={statusVariant[task.status] ?? 'outline'}>{task.status}</Badge>

        <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColor[task.priority]}`}>
          Priority: {task.priority}
        </span>

        <span class={`text-sm ${
          isOverdue(task.due_date) && task.status !== 'Completed'
          ? 'text-destructive font-medium' : ''
        }`}>
          Due {formatDate(task.due_date)} · {fromNow(task.due_date)}
        </span>
      </div>
    </div>

    <!-- ACTION BUTTONS -->
    <div class="flex items-center gap-2">
      {#if !editing}
        <!-- Only show Edit in view mode -->
        <Button
          variant="ghost"
          size="sm"
          on:click={() => {
            editing = true;
            updateState = { ...defaultUpdateState };
          }}
        >
          Edit
        </Button>
      {/if}

      <!-- Delete always shown -->
      <form
        method="POST"
        action="?/delete"
        on:submit={(event) => { if (confirmDelete(event)) notifyPending(); }}
      >
        <input type="hidden" name="id" value={task.id} />
        <Button type="submit" variant="destructive" size="sm" disabled={pendingAction}>
          Delete
        </Button>
      </form>
    </div>
  </div>

  <!-- VIEW MODE CONTENT -->
  {#if !editing}
    {#if task.description}
      <p class="line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
    {:else}
      <p class="text-sm text-muted-foreground italic">No description provided.</p>
    {/if}

    <div class="flex flex-wrap items-center gap-3 mt-2">
      <!-- Toggle Status -->
      <form method="POST" action="?/toggle" on:submit={notifyPending}>
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="status" value={task.status} />
        <Button type="submit" variant="secondary" size="sm" disabled={pendingAction}>
          {task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
        </Button>
      </form>

      {#if task.status !== 'Completed'}
        <!-- Move to In Progress -->
        <form method="POST" action="?/update" on:submit={notifyPending}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="title" value={task.title} />
          <input type="hidden" name="description" value={task.description ?? ''} />
          <input type="hidden" name="priority" value={task.priority} />
          <input type="hidden" name="due_date" value={task.due_date} />
          <input type="hidden" name="status" value="In Progress" />
          <Button type="submit" variant="ghost" size="sm" disabled={pendingAction}>
            Move to in progress
          </Button>
        </form>
      {/if}
    </div>

  {:else}

    <!-- DIVIDER -->
    <div class="h-px bg-border my-1"></div>

    <!-- EDIT FORM -->
    <form
      method="POST"
      action="?/update"
      class="space-y-3"
      on:submit={() => notifyPending()}
    >
      <input type="hidden" name="id" value={task.id} />

      {#if updateState.message}
        <p class="text-sm text-destructive">{updateState.message}</p>
      {/if}

      <!-- Title -->
      <div class="grid gap-2">
        <Label forId={`title-${task.id}`}>Title</Label>
        <Input
          id={`title-${task.id}`}
          name="title"
          value={localTask.title}
          maxlength={100}
          required
          className={updateState.errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {#if updateState.errors.title}
          <p class="text-sm text-destructive">{updateState.errors.title}</p>
        {/if}
      </div>

      <!-- Description -->
      <div class="grid gap-2">
        <Label forId={`description-${task.id}`}>Description</Label>
        <Textarea
          id={`description-${task.id}`}
          name="description"
          rows={3}
          maxlength={500}
          value={localTask.description ?? ''}
          className={updateState.errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {#if updateState.errors.description}
          <p class="text-sm text-destructive">{updateState.errors.description}</p>
        {/if}
      </div>

      <!-- Priority / Due Date / Status -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="grid gap-2">
          <Label forId={`priority-${task.id}`}>Priority</Label>
          <Select
            id={`priority-${task.id}`}
            name="priority"
            value={localTask.priority}
            required
            className={updateState.errors.priority ? 'border-destructive focus-visible:ring-destructive' : ''}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          {#if updateState.errors.priority}
            <p class="text-sm text-destructive">{updateState.errors.priority}</p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label forId={`due-${task.id}`}>Due date</Label>
          <Input
            id={`due-${task.id}`}
            name="due_date"
            type="date"
            required
            value={toDateInputValue(localTask.due_date)}
            className={updateState.errors.due_date ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {#if updateState.errors.due_date}
            <p class="text-sm text-destructive">{updateState.errors.due_date}</p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label forId={`status-${task.id}`}>Status</Label>
          <Select
            id={`status-${task.id}`}
            name="status"
            value={localTask.status}
            required
            className={updateState.errors.status ? 'border-destructive focus-visible:ring-destructive' : ''}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          {#if updateState.errors.status}
            <p class="text-sm text-destructive">{updateState.errors.status}</p>
          {/if}
        </div>
      </div>

      <!-- FORM BUTTONS -->
      <div class="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" on:click={closeEditor}>Cancel</Button>
        <Button type="submit" disabled={pendingAction}>Save changes</Button>
      </div>
    </form>

  {/if}
</div>
