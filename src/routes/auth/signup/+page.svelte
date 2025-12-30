<script lang="ts">
	import { afterNavigate, goto, invalidateAll } from "$app/navigation";
	import { authClient } from "$lib/client";
	import { resolve } from "$app/paths";

    let error = $state("");

    const signUp = async (e: Event) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        if (password !== confirmPassword) {
            error = "Passwords do not match";
            return;
        }

        if (!username || !email || !password || !confirmPassword) {
            error = "All fields are required";
            return;
        }

        await authClient.signUp.email(
            {
                email,
                password,
                name: username
            },
            {
                onSuccess: async () => {
                    error = "";
                    goto(resolve("/"));
                }
            }
        )
    }
</script>

<div class="flex flex-col items-center justify-center w-full h-screen">
    <form onsubmit={signUp}>
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Sign Up</legend>

            <label class="label" for="username">Name</label>
            <input class="input" type="text" name="username" id="username" required maxlength="30" minlength="3" />

            <label class="label" for="email">Email</label>
            <input class="input" type="email" name="email" id="email" required />

            <label class="label" for="password">Password</label>
            <input class="input" type="password" name="password" id="password" required minlength="6" />

            <label class="label" for="confirm-password">Confirm Password</label>
            <input class="input" type="password" name="confirm-password" id="confirm-password" required />

            <br />

            {#if error}
                <p class="text-error">{error}</p>
            {/if}
            <button class="btn btn-primary" type="submit">Sign Up</button>

            <p class="label">Already have an account? <a class="link" href={resolve("/auth/login")}>Login</a></p>
        </fieldset>
    </form>
</div>