import { NoEnvVarError } from '../errors/NoEnvVarError';
import { browserEnv } from './browserEnv';

const isDev = process.env.NODE_ENV === 'development';

const {
  DATABASE_URL,
  UPLOAD_CLIENT_PUBLIC_KEY,
  NEXTAUTH_SECRET,
  NEXTAUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

if (!DATABASE_URL) throw new NoEnvVarError('database url');

if (!UPLOAD_CLIENT_PUBLIC_KEY) throw new NoEnvVarError('upload client public key');

if (!NEXTAUTH_SECRET) throw new NoEnvVarError('next auth secret');
if (!isDev && !NEXTAUTH_URL) throw new NoEnvVarError('next auth url');

if (!GOOGLE_CLIENT_ID) throw new NoEnvVarError('vk client id');
if (!GOOGLE_CLIENT_SECRET) throw new NoEnvVarError('vk client secret');

let serverEnv = {
  ...browserEnv,
  uploadClientPublicKey: UPLOAD_CLIENT_PUBLIC_KEY,
  nextAuthSecret: NEXTAUTH_SECRET,
  nextAuthUrl: NEXTAUTH_URL,
  googleClientId: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET,
} as const;

serverEnv = new Proxy(serverEnv, {
  get(...args) {
    if (typeof window === 'undefined') return Reflect.get(...args);
    throw new Error("Don't use serverEnv in the browser");
  },
});

export { serverEnv };
