<script>
  import { cn } from '$lib/utils/classnames.js';
  export let className = '';
</script>

<div class={cn('rounded-xl border border-border bg-card text-card-foreground shadow-sm', className)}>
  <slot />
</div>
