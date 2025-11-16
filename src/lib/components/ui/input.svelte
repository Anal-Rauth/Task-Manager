<script>
  import { cn } from '$lib/utils/classnames.js';
  export let type = 'text';
  export let className = '';
  export let value = undefined;
  export let placeholder = '';
  export let required = false;
  export let maxLength = undefined;
  export let name;
  export let id = undefined;
</script>

<input
  {type}
  {value}
  {placeholder}
  {required}
  {maxLength}
  {name}
  {id}
  class={cn(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-background',
    className
  )}
/>
