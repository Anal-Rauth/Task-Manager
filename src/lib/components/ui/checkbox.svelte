<script>
  export let checked = false;
  export let name;
  export let value = 'on';
  export let className = '';
</script>

<label class={`inline-flex items-center gap-2 text-sm ${className}`}>
  <input
    type="checkbox"
    bind:checked
    {name}
    {value}
    class="h-4 w-4 rounded border border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  />
  <slot />
</label>
