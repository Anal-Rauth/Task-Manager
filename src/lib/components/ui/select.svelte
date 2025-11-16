<script>
  import { cn } from '$lib/utils/classnames.js';
  export let className = '';
  export let name;
  export let value = undefined;
  export let required = false;
  export let id = undefined;
</script>

<select
  {name}
  {required}
  {id}
  bind:value
  class={cn(
    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-background',
    className
  )}
>
  <slot />
</select>
