<!-- Assuming this is your Login.svelte component or similar -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  const id = $props.id();
</script>

<Navbar />

<!-- This wrapper div must be the one that occupies the full viewport space -->
<div class="min-h-screen flex items-center justify-center bg-background p-4">
  <Card.Root class="mx-auto w-full max-w-sm shadow-lg border">
    <Card.Header class="text-center">
      <Card.Title class="text-3xl font-bold">Welcome Back</Card.Title>
      <Card.Description>Sign in to your account</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input id="email-{id}" type="email" placeholder="you@example.com" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password-{id}">Password</Label>
            <a href="/forgot-password" class="ml-auto inline-block text-sm text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password-{id}" type="password" required />
        </div>
        <Button type="submit" class="w-full">Login</Button>
        <Button variant="outline" class="w-full flex items-center gap-2">
          <!-- Google SVG icon here. Removed path for brevity, assume it's valid. -->
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
          </svg>
          Login with Google
        </Button>
      </div>
      <div class="mt-6 text-center text-sm">
        Don't have an account?
        <a href="##" class="underline text-primary hover:text-primary-foreground"> Sign up </a>
      </div>
    </Card.Content>
  </Card.Root>
</div>