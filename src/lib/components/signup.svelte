<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { authClient, authHelpers, signUp, signIn } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  interface Props {
    id?: string;
  }
  
  let { id = Math.random().toString(36).substr(2, 9) }: Props = $props();

  // Form state
  let name = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let isLoading = $state(false);
  let errorMessage = $state("");
  let showVerificationMessage = $state(false);

  async function handleEmailSignup(event: SubmitEvent) {
    event.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      errorMessage = "Please fill in all fields";
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match";
      return;
    }

    if (password.length < 8) {
      errorMessage = "Password must be at least 8 characters";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });
      
      if (result.error) {
        errorMessage = result.error.message || "Signup failed";
      } else {
        // Success - show verification message
        showVerificationMessage = true;
        errorMessage = "";
      }
    } catch (error) {
      console.error("Signup error:", error);
      errorMessage = "An unexpected error occurred";
    } finally {
      isLoading = false;
    }
  }

  async function handleGoogleSignup() {
    isLoading = true;
    errorMessage = "";

    try {
      const result = await signIn.social({
        provider: "google",
      });
      
      if (result.error) {
        errorMessage = result.error.message || "Google signup failed";
      }
      // Success handling will be done by the redirect
    } catch (error) {
      console.error("Google signup error:", error);
      errorMessage = "Google signup failed";
    } finally {
      isLoading = false;
    }
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign Up</Card.Title>
    <Card.Description>
      Enter your information below to create your account
    </Card.Description>
  </Card.Header>

  <Card.Content>
    <form onsubmit={handleEmailSignup}>
      <div class="grid gap-4">
        {#if showVerificationMessage}
          <div class="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
            <h4 class="font-medium">Account Created Successfully!</h4>
            <p class="mt-1">We've sent a verification email to <strong>{email}</strong>. Please check your inbox and click the verification link to activate your account.</p>
            <p class="mt-2 text-xs">Didn't receive the email? Check your spam folder or try signing up again.</p>
          </div>
        {:else if errorMessage}
          <div class="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {errorMessage}
          </div>
        {/if}

        <div class="grid gap-2">
          <Label for="name-{id}">Full Name</Label>
          <Input 
            name="name" 
            id="name-{id}" 
            type="text" 
            bind:value={name}
            placeholder="John Doe" 
            disabled={isLoading}
            required 
          />
        </div>
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input 
            name="email" 
            id="email-{id}" 
            type="email" 
            bind:value={email}
            placeholder="m@example.com" 
            disabled={isLoading}
            required 
          />
        </div>
        <div class="grid gap-2">
          <Label for="password-{id}">Password</Label>
          <Input 
            name="password" 
            id="password-{id}" 
            type="password" 
            bind:value={password}
            disabled={isLoading}
            required 
          />
        </div>
        <div class="grid gap-2">
          <Label for="confirm-password-{id}">Confirm Password</Label>
          <Input 
            name="confirm-password" 
            id="confirm-password-{id}" 
            type="password" 
            bind:value={confirmPassword}
            disabled={isLoading}
            required 
          />
        </div>

        <Button type="submit" class="w-full" disabled={isLoading}>
          {#snippet children()}
            {#if isLoading}
              <span class="animate-spin mr-2">⏳</span>
            {/if}
            Create Account
          {/snippet}
        </Button>

        <Button
          type="button"
          variant="outline"
          class="w-full"
          onclick={handleGoogleSignup}
          disabled={isLoading}
        >
          {#snippet children()}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 mr-2">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign up with Google
          {/snippet}
        </Button>
      </div>

      <div class="mt-4 text-center text-sm">
        Already have an account?
        <a href="/login" class="underline"> Sign in </a>
      </div>
    </form>
  </Card.Content>
</Card.Root>
