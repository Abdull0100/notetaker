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
      <Card.Title class="text-3xl font-bold">Reset Password</Card.Title>
      <Card.Description>Enter your new password</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="new-password-{id}">New Password</Label>
          <Input id="new-password-{id}" type="password" required />
        </div>
        <div class="grid gap-2">
          <Label for="confirm-new-password-{id}">Confirm New Password</Label>
          <Input id="confirm-new-password-{id}" type="password" required />
        </div>
        <Button type="submit" class="w-full" onclick={() => window.location.href = '/login'}>Reset Password</Button>
      </div>
      <div class="mt-6 text-center text-sm">
        Remember your password?
        <a href="/login" class="underline text-primary hover:text-primary-foreground"> Sign in </a>
      </div>
    </Card.Content>
  </Card.Root>
</div>
