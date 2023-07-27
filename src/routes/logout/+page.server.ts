import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals, url: _url }) => {
	try {
		const session = await locals.getSession();
		if (session && !!session.user.access_token) {
			const tokenCall = await fetch('/auth/csrf');
			const csrfTokenResponse = await new Response(tokenCall.body).json();
			const csrfToken = csrfTokenResponse.csrfToken;

			const formDataAuthCore = new URLSearchParams();
			formDataAuthCore.append('redirect', 'false');
			formDataAuthCore.append('callbackUrl', `${_url.origin}`);
			formDataAuthCore.append('csrfToken', csrfToken);
	
			await fetch('/auth/signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Auth-Return-Redirect': '1'
				},
				body: formDataAuthCore.toString()
			});
		}
	} catch (e: any) {
		console.log('Exception thrown while auto-sign-out: ', e);
	}
}) satisfies PageServerLoad;
