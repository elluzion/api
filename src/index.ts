import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { SoundcloudController } from './controllers/soundcloud-controller';
import Environment from './lib/environment';

const { PORT } = Environment;

const api = new Elysia()
  .use(SoundcloudController)
  .use(cors())
  .use(
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
  )
  .listen(PORT);

console.log(`Listening on port ${PORT}`);

export type Api = typeof api;
