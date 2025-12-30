<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { authClient } from "$lib/client";
	import { getUser } from "./user.remote";

	let { children } = $props();

	let user = $derived(await getUser());

	const signOut = async () => {
        await authClient.signOut();
        goto(resolve("/auth/login"));
    }
	
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex flex-col h-screen">
	<div class="navbar bg-base-100 shadow-sm">
  		<div class="flex-1">
    		<a class="btn btn-ghost text-xl" href="/">Gasthaus Reservations</a>
  		</div>
  		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				{#if user.id}
					<li><button onclick={signOut}>Logout</button></li>
				{:else}
					<li><a href="/auth/login">Login</a></li>
				{/if}
			</ul>
  		</div>
	</div>
	<div class="flex flex-col m-6">
        {@render children()}
	</div>
</div>