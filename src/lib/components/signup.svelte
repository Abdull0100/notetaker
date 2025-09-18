<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { enhance } from "$app/forms"; // optional progressive enhancement
  import { signIn } from "@auth/sveltekit/client"; // for Google signup

  const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <!-- Wrap inputs in a form -->
  <form method="POST" use:enhance>
    <Card.Header>
      <Card.Title class="text-2xl">Sign Up</Card.Title>
      <Card.Description>
        Enter your information below to create your account
      </Card.Description>
    </Card.Header>

    <Card.Content>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="name-{id}">Full Name</Label>
          <Input name="name" id="name-{id}" type="text" placeholder="John Doe" required />
        </div>
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input name="email" id="email-{id}" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <Label for="password-{id}">Password</Label>
          <Input name="password" id="password-{id}" type="password" required />
        </div>
        <div class="grid gap-2">
          <Label for="confirm-password-{id}">Confirm Password</Label>
          <Input name="confirm-password" id="confirm-password-{id}" type="password" required />
        </div>

        <!-- Submits to signup/+page.server.ts default action -->
        <Button type="submit" class="w-full">Create Account</Button>

        <!-- Google signup button -->
        <Button
          type="button"
          variant="outline"
          class="w-full"
          onclick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Sign up with Google
        </Button>
      </div>

      <div class="mt-4 text-center text-sm">
        Already have an account?
        <a href="/login" class="underline"> Sign in </a>
      </div>
    </Card.Content>
  </form>
</Card.Root>
