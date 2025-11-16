<script>
  import { fade, fly } from 'svelte/transition';
  import { dismissToast, toasts } from './use-toast.js';

  const variants = {
    default: 'border-border bg-card text-card-foreground',
    success: 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-50',
    destructive: 'border-destructive/70 bg-destructive/10 text-destructive-foreground'
  };
</script>

<div class="pointer-events-none fixed inset-0 z-50 flex items-end justify-end px-4 py-6 sm:items-start">
  <div class="flex w-full flex-col gap-3 sm:max-w-sm">
    {#each $toasts as toast (toast.id)}
      <div
        class={`pointer-events-auto overflow-hidden rounded-lg border shadow-lg ${variants[toast.variant] ?? variants.default}`}
        in:fly={{ x: 16, duration: 200 }}
        out:fade
        on:click={() => dismissToast(toast.id)}
        role="status"
        aria-live="polite"
      >
        <div class="grid gap-1 px-4 py-3">
          {#if toast.title}
            <p class="font-semibold leading-tight">{toast.title}</p>
          {/if}
          {#if toast.description}
            <p class="text-sm text-muted-foreground">{toast.description}</p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
