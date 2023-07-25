import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
	interface Session {
		// eslint-disable-next-line @typescript-eslint/ban-types
		user: {} & DefaultSession['user'];
	}
}
