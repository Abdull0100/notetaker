<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  const id = $props.id();
</script>

<Navbar />

<div class="min-h-screen flex items-center justify-center bg-background p-4">
  <Card.Root class="mx-auto w-full max-w-sm shadow-lg border">
    <Card.Header class="text-center">
      <Card.Title class="text-3xl font-bold">Forgot Password</Card.Title>
      <Card.Description>Enter your email to receive a reset code</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input id="email-{id}" type="email" placeholder="you@example.com" required />
        </div>
        <Button type="submit" class="w-full" onclick={() => window.location.href = '/forgot-password-otp'}>Send Reset Code</Button>
      </div>
      <div class="mt-6 text-center text-sm">
        Remember your password?
        <a href="/login" class="underline text-primary hover:text-primary-foreground"> Sign in </a>
      </div>
    </Card.Content>
  </Card.Root>
</div>
