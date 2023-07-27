<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	onMount(async () => {
		const idToken = $page.data?.session?.user.id_token as string;

		await fetch(
			import.meta.env.VITE_ISSUER +
				`oidc/logout?post_logout_redirect_uri=${encodeURIComponent(
					window.location.origin
				)}&id_token_hint=${idToken}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);
	});
</script>

<div class="content">
	<h2>Server Side Flow - Logout</h2>

	<p>
		This page deals with server side signout. As soon as you land on this page, you'll should have
		been loged out.
	</p>

	<p>
		{#if $page.data.session && Object.keys($page.data?.session?.user || {}).length}
			<div class="signedin">
				<span>Unfortunately you're still signed in as</span>
				<strong>{$page.data.session.user.email}</strong>
				<strong>{$page.data.session.user.name}</strong>
			</div>
		{/if}
	</p>

	<p>
		Only way to log out now is to redirect to <a href="/">home page</a> and use client side signOut button
	</p>

	<p>
		next-auth.session-token cookie is NOT getting deleted on signout! - This flow DOES NOT works!!
	</p>
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1.6rem;
		line-height: 2rem;
		padding: 2rem;

		.signedin {
			display: flex;
			flex-direction: column;
			align-items: center;
			line-height: 2rem;
		}
	}
</style>
