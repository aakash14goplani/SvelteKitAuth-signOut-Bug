### Bug Report

- `signOut` using API endpoint on server side is not working as expected for SvelteKitAuth package.
- When we hit `/auth/signout` the request pass through but it does not invalidates session and `session-token` cookie still persist.
- Client side `signIn` and `signOut` are working fine. Also `/auth/signin` i.e. `signIn` on server side works fine as well. It is just `signOut` part that is broken.

**Live Demo:** https://svelte-kit-auth-sign-out-bug.vercel.app/

**GitHub issue URL:** https://github.com/nextauthjs/next-auth/issues/8134
