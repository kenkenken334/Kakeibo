import { defineEnv, string } from 'void/env';

export default defineEnv({
  AUTH_GOOGLE_CLIENT_ID: string(),
  AUTH_GOOGLE_CLIENT_SECRET: string(),
  BETTER_AUTH_SECRET: string(),
});
