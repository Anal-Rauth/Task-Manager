<script>
  import { cn } from '$lib/utils/classnames.js';
  export let variant = 'default';
  export let className = '';

  const variants = {
    default: 'border-border text-foreground',
    success: 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100',
    destructive: 'border-destructive/70 bg-destructive/10 text-destructive',
    warning: 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100',
    muted: 'border-muted bg-muted text-muted-foreground'
  };
</script>

<div role="status" class={cn('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm', variants[variant] ?? variants.default, className)}>
  <slot />
</div>
