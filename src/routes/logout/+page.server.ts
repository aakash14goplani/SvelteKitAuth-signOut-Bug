import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals }) => {
	let url = '';
	try {
		const session = await locals.getSession();
		if (session && !!session.user.access_token) {
			const tokenCall = await fetch('/auth/csrf');
			const csrfTokenResponse = await new Response(tokenCall.body).json();
			const csrfToken = csrfTokenResponse.csrfToken;

			const formDataAuthCore = new URLSearchParams();
			formDataAuthCore.append('redirect', 'false');
			formDataAuthCore.append('csrfToken', csrfToken);
	
			const signInRequest = await fetch('/auth/signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Auth-Return-Redirect': '1'
				},
				body: formDataAuthCore.toString()
			});
			const signInResponse = await new Response(signInRequest.body).json();

			if (signInResponse?.url) {
				url = signInResponse.url;
			}
		}
	} catch (e: any) {
		console.log('Exception thrown while auto-sign-out: ', e);
	}

	if (url && !url.includes('login')) {
		console.log('Auto logout user: ', url);
		throw redirect(302, url);
	}
}) satisfies PageServerLoad;
