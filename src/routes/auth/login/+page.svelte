<script lang="ts">
	import { afterNavigate, goto, invalidateAll } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { authClient } from "$lib/client";

    let error = $state("");

    const login = async (e: Event) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            error = "All fields are required";
            return;
        }

        await authClient.signIn.email(
            {
                email,
                password
            },
            {
                onSuccess: () => {
                    error = "";
                    goto(resolve("/"));
                }
            }
        );
    }

</script>

<div class="flex flex-col flex-grow items-center justify-center">
    <form onsubmit={login}>
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Login</legend>

            <label class="label" for="email">Email</label>
            <input class="input" type="email" name="email" id="email" required />

            <label class="label" for="password">Password</label>
            <input class="input" type="password" name="password" id="password" required />

            {#if error}
                <p class="text-error">{error}</p>
            {/if}

            <br />
            <button class="btn btn-primary" type="submit">Login</button>
            
            <p class="label">Don't have an account? <a class="link" href={resolve("/auth/signup")}>Sign Up</a></p>
        </fieldset>
    </form>
</div>