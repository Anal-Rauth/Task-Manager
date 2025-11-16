<script>
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
</script>

<div class="mx-auto flex w-full max-w-md flex-col gap-6">
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold">Reset your password</h1>
    <p class="text-sm text-muted-foreground">
      Enter your email address and we'll send you instructions to reset your password.
    </p>
  </div>
  <form class="space-y-5">
    <div class="space-y-2">
      <Label forId="email">Email</Label>
      <Input id="email" name="email" type="email" placeholder="you@example.com" required />
    </div>
    <Button type="button" className="w-full" disabled>
      Reset link will arrive soon
    </Button>
  </form>
  <p class="text-center text-sm text-muted-foreground">
    Remembered your password?
    <a class="text-primary hover:underline" href="/login">Back to login</a>
  </p>
</div>
