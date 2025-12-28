<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { authClient } from "$lib/client";

    export let data;
    const { user } = data;

    const signOut = () => {
        authClient.signOut();
        goto(resolve("/auth/login"));
    }

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#if user}
    <button class="btn btn-primary" onclick={signOut}>Sign Out</button>
{:else}
    <button class="btn btn-primary" onclick={() => goto(resolve("/auth/login"))}>Login</button>
{/if}