<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { goto } from "$app/navigation";

  function navigateToSignup() {
    goto('/signup');
  }

  function navigateToLogin() {
    goto('/login');
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Welcome to NoteTaker</Card.Title>
    <Card.Description>Your personal note-taking companion</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <div class="text-center space-y-2">
        <p class="text-sm text-muted-foreground">
          Get started by creating your account or signing in to access your notes.
        </p>
      </div>
      <div class="grid gap-2">
        <Button class="w-full" onclick={navigateToSignup}>
          {#snippet children()}Get Started{/snippet}
        </Button>
        <Button variant="outline" class="w-full" onclick={navigateToLogin}>
          {#snippet children()}Sign In{/snippet}
        </Button>
      </div>
    </div>
    <div class="mt-4 text-center text-sm">
      <p class="text-muted-foreground">
        Organize your thoughts, capture ideas, and never forget important information.
      </p>
    </div>
  </Card.Content>
</Card.Root>
