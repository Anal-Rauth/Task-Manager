<script>
  import { cn } from '$lib/utils/classnames.js';
  export let variant = 'default';
  export let className = '';

  const variants = {
    default: 'bg-primary/10 text-primary ring-primary/20',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive/10 text-destructive ring-destructive/20',
    outline: 'text-foreground ring-1 ring-border'
  };
</script>

<span class={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', variants[variant] ?? variants.default, className)}>
  <slot />
</span>
