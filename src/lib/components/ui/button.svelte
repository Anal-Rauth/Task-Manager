<script>
  import { cn } from '$lib/utils/classnames.js';
  export let type = 'button';
  export let variant = 'default';
  export let size = 'default';
  export let className = '';
  export let disabled = false;

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted hover:text-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };
</script>

<button
  on:click             
  {...$$restProps}
  type={type}
  class={cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
    variants[variant] ?? variants.default,
    sizes[size] ?? sizes.default,
    className
  )}
  disabled={disabled}
>
  <slot />
</button>
