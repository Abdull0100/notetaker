<script lang="ts">
  import { useSession, signOut } from "$lib/auth-client";
  import { goto } from "$app/navigation";
  
  // Get reactive session data using the latest better-auth pattern
  const session = useSession();

  async function handleSignOut() {
    await signOut();
    goto('/');
  }
</script>

<!-- Display session status using reactive session store -->
<div class="p-4 border rounded-lg">
  <h3 class="text-lg font-semibold mb-2">Authentication Status</h3>
  
  {#if $session.data}
    <div class="text-green-600 space-y-2">
      <p>✅ Logged in as: <strong>{$session.data.user.email}</strong></p>
      <p>User ID: {$session.data.user.id}</p>
      <p>Session expires: {new Date($session.data.session.expiresAt).toLocaleString()}</p>
      <button 
        onclick={handleSignOut}
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Sign Out
      </button>
    </div>
  {:else if $session.isPending}
    <div class="text-blue-600">
      <p>🔄 Checking authentication status...</p>
    </div>
  {:else if $session.error}
    <div class="text-red-600">
      <p>❌ Authentication error: {$session.error.message}</p>
    </div>
  {:else}
    <div class="text-gray-600">
      <p>🔒 Not logged in</p>
      <div class="mt-2 space-x-2">
        <button 
          onclick={() => goto('/login')}
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
        <button 
          onclick={() => goto('/signup')}
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>
  {/if}
</div>
