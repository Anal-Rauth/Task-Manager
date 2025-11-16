<script>
  export let error;
  export let status;
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
  <div class="rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1 text-sm font-medium text-destructive">
    {status}
  </div>
  <h1 class="text-3xl font-semibold">Something went wrong</h1>
  <p class="max-w-xl text-muted-foreground">{error?.message ?? 'An unexpected error occurred. Please try again.'}</p>
  <a
    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/80"
    href="/"
  >
    Back to safety
  </a>
</div>
