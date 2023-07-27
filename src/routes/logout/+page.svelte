<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	onMount(() => {
		const isAppReloaded = sessionStorage.getItem('reloadApp');
		if (!isAppReloaded) {
			sessionStorage.setItem('reloadApp', 'true');
			window.location.reload();
		}
		if (!$page.data.session?.user.access_token) {
			setTimeout(() => {
				goto('/');
				sessionStorage.removeItem('reloadApp');
			}, 5000);
		}
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

				<p>
					Only way to log out now is to redirect to <a href="/">home page</a> and use client side signOut
					button
				</p>

				<p>session object is NOT getting deleted on signout! - This flow DOES NOT works!!</p>
			</div>
		{:else}
			<div class="signedin">
				No Data available that means you're logged out. Redirecting you to home page...
			</div>
		{/if}
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
