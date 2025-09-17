<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<nav class="flex items-center justify-between p-4 border-b">
  <div class="flex items-center space-x-2">
    <h1 class="text-xl font-bold cursor-pointer hover:text-primary" onclick={() => window.location.href = '/'}>NoteTaker</h1>
  </div>
  <div class="flex items-center space-x-2">
    <Button variant="ghost" onclick={() => window.location.href = '/login'}>Login</Button>
    <Button variant="outline" onclick={() => window.location.href = '/signup'}>Sign Up</Button>
  </div>
</nav>
