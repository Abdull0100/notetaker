<script lang="ts">
	import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { signIn } from "@auth/sveltekit/client"; // import client helper

  // form state (for email/password if you wire later)
  let email = "";
  let password = "";

  async function handleGoogleLogin() {
    await signIn("google", { callbackUrl: "/" }); // redirect after login
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-background p-4">
  <Card.Root class="mx-auto w-full max-w-sm shadow-lg border">
    <Card.Header class="text-center">
      <Card.Title class="text-3xl font-bold">Welcome Back</Card.Title>
      <Card.Description>Sign in to your account</Card.Description>
    </Card.Header>

    <Card.Content>
      <form class="grid gap-4" use:enhance method="POST" action="?/login">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input name="email" id="email" type="email" bind:value={email} placeholder="you@example.com" required />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="##" class="ml-auto inline-block text-sm text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input name="password" id="password" type="password" bind:value={password} required />
        </div>

        <Button type="submit" class="w-full">Login</Button>

        <Button
          type="button"
          variant="outline"
          class="w-full flex items-center gap-2"
          onclick={handleGoogleLogin}
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
          </svg>
          Login with Google
        </Button>
      </form>

      <div class="mt-6 text-center text-sm">
        Don't have an account?
        <a href="##" class="underline text-primary hover:text-primary-foreground"> Sign up </a>
      </div>
    </Card.Content>
  </Card.Root>
</div>
