import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals }) => {
	let url = '';
	try {
		const session = await locals.getSession();
		if (!session?.user) {
			const tokenCall = await fetch('/auth/csrf');
			const csrfTokenResponse = await new Response(tokenCall.body).json();
			const csrfToken = csrfTokenResponse.csrfToken;

			const formData = new URLSearchParams();
			formData.append('redirect', 'false');
			formData.append('csrfToken', csrfToken);

			const signInRequest = await fetch('/auth/signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Auth-Return-Redirect': '1'
				},
				body: formData.toString()
			});
			const signInResponse = await new Response(signInRequest.body).json();

			if (signInResponse?.url) {
				url = signInResponse.url;
			}
		}
	} catch (e: any) {
		console.log('Exception thrown while auto-sign-out: ', e);
	}

	if (url) {
		console.log('Auto logout user: ', url);
		throw redirect(302, url);
	}
}) satisfies PageServerLoad;
