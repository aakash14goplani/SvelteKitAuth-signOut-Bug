import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals, url: _url }) => {
	let url = '';
	try {
		const session = await locals.getSession();
		if (session && !!session.user.access_token) {
			const tokenCall = await fetch('/auth/csrf');
			const csrfTokenResponse = await new Response(tokenCall.body).json();
			const csrfToken = csrfTokenResponse.csrfToken;
			const idToken = session.user.id_token as string;

			const formDataAuthCore = new URLSearchParams();
			formDataAuthCore.append('redirect', 'true');
			formDataAuthCore.append('callbackUrl', `${_url.origin}`);
			formDataAuthCore.append('csrfToken', csrfToken);
			// formDataAuthCore.append('id_token_hint', idToken);
	
			const signInRequest = await fetch('/auth/signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Auth-Return-Redirect': '1'
				},
				body: formDataAuthCore.toString()
			});
			const signInResponse = await new Response(signInRequest.body).json();

			const formDataOIDC = new URLSearchParams();
			formDataOIDC.append('id_token_hint', idToken);
			formDataOIDC.append('post_logout_redirect_uri', `${_url.origin}`);

			await fetch(import.meta.env.VITE_ISSUER + 'oidc/logout' + formDataOIDC.toString(), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

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
