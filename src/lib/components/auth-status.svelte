<script lang="ts">
  import { authClient } from "$lib/auth-client";
  
  // Get reactive session data - the proper way according to docs
  const session = authClient.useSession();
</script>

<!-- Display session status using reactive $ prefix as shown in docs -->
<div class="p-4 border rounded-lg">
  <h3 class="text-lg font-semibold mb-2">Authentication Status</h3>
  
  {#if $session.data}
    <div class="text-green-600">
      <p>✅ Logged in as: <strong>{$session.data.user.email}</strong></p>
      <p>User ID: {$session.data.user.id}</p>
      <p>Session expires: {new Date($session.data.session.expiresAt).toLocaleString()}</p>
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
    </div>
  {/if}
</div>
