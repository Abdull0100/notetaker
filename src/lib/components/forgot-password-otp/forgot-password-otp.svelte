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
      <Card.Title class="text-3xl font-bold">Enter Reset Code</Card.Title>
      <Card.Description>Enter the 6-digit code sent to your email</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="reset-code-{id}">Reset Code</Label>
          <Input id="reset-code-{id}" type="text" placeholder="Enter 6-digit code" maxlength="6" required />
        </div>
        <Button type="submit" class="w-full" onclick={() => window.location.href = '/reset-password'}>Verify Code</Button>
        <Button variant="outline" class="w-full">
          Resend Code
        </Button>
      </div>
      <div class="mt-6 text-center text-sm">
        Didn't receive the code?
        <a href="/forgot-password" class="underline text-primary hover:text-primary-foreground"> Try again </a>
      </div>
    </Card.Content>
  </Card.Root>
</div>
