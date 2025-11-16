<script>
  import { cn } from '$lib/utils/classnames.js';
  export let className = '';
  export let value = undefined;
  export let placeholder = '';
  export let name;
  export let rows = 4;
  export let maxLength = undefined;
  export let id = undefined;
</script>

<textarea
  bind:value={value}
  {placeholder}
  {name}
  {rows}
  {maxLength}
  {id}
  class={cn(
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-background',
    className
  )}
></textarea>
