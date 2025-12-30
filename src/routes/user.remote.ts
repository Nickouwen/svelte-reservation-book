import { getRequestEvent, query } from '$app/server';
import { auth } from '$lib/auth';

export const getUser = query(async () => {
	const event = getRequestEvent();
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	return {
		id: session?.user.id || null,
		email: session?.user.email || null
	};
});