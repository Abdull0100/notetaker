<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { authClient, authHelpers, signIn } from "$lib/auth-client";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  interface Props {
    id?: string;
  }
  
  let { id = Math.random().toString(36).substr(2, 9) }: Props = $props();

  // Form state
  let email = $state("");
  let password = $state("");
  let isLoading = $state(false);
  let errorMessage = $state("");
  let showResendOption = $state(false);

  async function handleEmailLogin(event: SubmitEvent) {
    event.preventDefault();
    
    if (!email || !password) {
      errorMessage = "Please fill in all fields";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const result = await signIn.email({
        email,
        password,
      });
      
      if (result.error) {
        // Handle specific error cases
        if (result.error.status === 403) {
          errorMessage = "Please verify your email address before signing in. Check your inbox for the verification link.";
          showResendOption = true;
        } else {
          errorMessage = result.error.message || "Login failed";
          showResendOption = false;
        }
      } else {
        // Success - redirect to dashboard or home
        await goto("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage = "An unexpected error occurred";
    } finally {
      isLoading = false;
    }
  }

  async function handleGoogleLogin() {
    isLoading = true;
    errorMessage = "";

    try {
      const result = await signIn.social({
        provider: "google",
      });
      
      if (result.error) {
        errorMessage = result.error.message || "Google login failed";
      }
      // Success handling will be done by the redirect
    } catch (error) {
      console.error("Google login error:", error);
      errorMessage = "Google login failed";
    } finally {
      isLoading = false;
    }
  }

  async function resendVerificationEmail() {
    if (!email) {
      errorMessage = "Please enter your email address first";
      return;
    }

    isLoading = true;
    try {
      await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "/dashboard", // Redirect to dashboard after verification
      });
      errorMessage = "Verification email sent! Please check your inbox.";
      showResendOption = false;
    } catch (error) {
      console.error("Resend verification error:", error);
      errorMessage = "Failed to send verification email. Please try again.";
    } finally {
      isLoading = false;
    }
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm shadow-lg border">
  <Card.Header class="text-center">
    <Card.Title class="text-3xl font-bold">Welcome Back</Card.Title>
    <Card.Description>Sign in to your account</Card.Description>
  </Card.Header>

  <Card.Content>
    <form onsubmit={handleEmailLogin}>
      <div class="grid gap-4">
        {#if page.form?.missing}
          <div class="text-sm text-destructive bg-destructive/10 p-2 rounded">
            The email field is required
          </div>
        {/if}
        {#if page.form?.incorrect}
          <div class="text-sm text-destructive bg-destructive/10 p-2 rounded">
            Invalid credentials!
          </div>
        {/if}
        {#if errorMessage}
          <div class="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {errorMessage}
          </div>
          {#if showResendOption}
            <div class="mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="w-full"
                onclick={resendVerificationEmail}
                disabled={isLoading}
              >
                {#snippet children()}
                  {#if isLoading}
                    <span class="animate-spin mr-2">⏳</span>
                  {/if}
                  Resend Verification Email
                {/snippet}
              </Button>
            </div>
          {/if}
        {/if}

        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input 
            name="email" 
            id="email-{id}" 
            type="email" 
            bind:value={email}
            placeholder="you@example.com" 
            disabled={isLoading}
            required 
          />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password-{id}">Password</Label>
            <a href="/forgot-password" class="ml-auto inline-block text-sm text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input 
            name="password" 
            id="password-{id}" 
            type="password" 
            bind:value={password}
            disabled={isLoading}
            required 
          />
        </div>

        <Button type="submit" class="w-full" disabled={isLoading}>
          {#snippet children()}
            {#if isLoading}
              <span class="animate-spin mr-2">⏳</span>
            {/if}
            Login
          {/snippet}
        </Button>

        <Button
          type="button"
          variant="outline"
          class="w-full flex items-center gap-2"
          onclick={handleGoogleLogin}
          disabled={isLoading}
        >
          {#snippet children()}
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            Login with Google
          {/snippet}
        </Button>
      </div>

      <div class="mt-6 text-center text-sm">
        Don't have an account?
        <a href="/signup" class="underline text-primary hover:text-primary-foreground"> Sign up </a>
      </div>
    </form>
  </Card.Content>
</Card.Root>
