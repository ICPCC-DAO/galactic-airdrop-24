import { AuthClient } from '@dfinity/auth-client';

export const createAuthClient = (): Promise<AuthClient> =>
  AuthClient.create({
    idleOptions: {
      idleTimeout: 1000 * 60 * 60 * 24 * 7, // 7 days
      disableDefaultIdleCallback: true, // disable the default reload behavior
    },
  });
