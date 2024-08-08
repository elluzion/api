import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { IndexController } from './controllers/index-controller';
import { SoundcloudController } from './controllers/soundcloud-controller';
import Environment from './lib/environment';

const { PORT } = Environment;

export const api = new Elysia().use(SoundcloudController).use(IndexController).use(cors()).listen(PORT);

if (Environment.IS_DEV) {
  api.use(
    swagger({
      version: await Environment.VERSION(),
      path: '/docs',
      documentation: {
        info: {
          title: 'Tools API',
          version: await Environment.VERSION(),
        },
      },
      theme: 'dark',
      scalarConfig: {
        theme: 'purple',
      },
    }),
  );
}

console.log(`Listening on port ${PORT}`);

export type Api = typeof api;
