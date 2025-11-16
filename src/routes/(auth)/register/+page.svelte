<script>
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import Alert from '$lib/components/ui/alert.svelte';
  import { enhance } from '$app/forms';
  import { toast } from '$lib/components/ui/use-toast.js';

  export let form;

  const defaultValues = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  const passwordRules = [
    { label: 'At least 8 characters', check: (value) => (value?.length ?? 0) >= 8 },
    { label: 'Include at least one uppercase letter', check: (value) => /[A-Z]/.test(value ?? '') },
    { label: 'Include at least one lowercase letter', check: (value) => /[a-z]/.test(value ?? '') },
    { label: 'Include at least one number', check: (value) => /[0-9]/.test(value ?? '') }
  ];

  let pending = false;
  const enhanceOptions = () => {
    pending = true;
    return ({ result }) => {
      pending = false;
      if (result.type === 'redirect') {
        toast({
          title: 'Account created',
          description: 'Check your email to confirm and sign in.',
          variant: 'success'
        });
      }
      return result;
    };
  };

  $: values = form?.values ?? defaultValues;
  $: errors = form?.errors ?? {};
  $: message = form?.message ?? '';
</script>

<div class="mx-auto flex w-full max-w-md flex-col gap-6">
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold">Create your account</h1>
    <p class="text-sm text-muted-foreground">Join Task Manager and stay organised.</p>
  </div>
  {#if message}
    <Alert variant="destructive">{message}</Alert>
  {/if}
  <form method="POST" class="space-y-5" use:enhance={enhanceOptions}>
    <div class="space-y-2">
      <Label forId="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        value={values.email}
        className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      {#if errors.email}
        <p class="text-sm text-destructive">{errors.email}</p>
      {/if}
    </div>
    <div class="space-y-2">
      <Label forId="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        required
        value={values.password}
        className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      <p class="text-sm text-muted-foreground">
        Use at least 8 characters with uppercase, lowercase, and a number.
      </p>
      {#if errors.password}
        <p class="text-sm text-destructive">{errors.password}</p>
      {/if}
      {#if values.password || errors.password}
        <Alert variant={errors.password ? 'destructive' : 'muted'}>
          <div class="space-y-2">
            <p class="text-sm font-medium">Password must include:</p>
            <ul class="list-disc space-y-1 pl-4 text-sm">
              {#each passwordRules as rule}
                <li class={rule.check(values.password) ? 'text-foreground' : 'text-destructive'}>
                  {rule.label}
                </li>
              {/each}
            </ul>
          </div>
        </Alert>
      {/if}
    </div>
    <div class="space-y-2">
      <Label forId="confirmPassword">Confirm password</Label>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        value={values.confirmPassword}
        className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      {#if errors.confirmPassword}
        <p class="text-sm text-destructive">{errors.confirmPassword}</p>
      {/if}
    </div>
    <Button type="submit" className="w-full" disabled={pending}>
      {#if pending}
        Creating account...
      {:else}
        Sign up
      {/if}
    </Button>
  </form>
  <p class="text-center text-sm text-muted-foreground">
    Already have an account?
    <a class="text-primary hover:underline" href="/login">Sign in</a>
  </p>
</div>
