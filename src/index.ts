import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { IndexController } from './controllers/index-controller';
import { SoundcloudController } from './controllers/soundcloud-controller';
import Environment from './lib/environment';

const { PORT } = Environment;

export const api = new Elysia().use(SoundcloudController).use(IndexController);

// cors
api.use(cors());

// swagger docs
if (Environment.IS_DEV) {
  const version = await Environment.VERSION();

  api.use(
    swagger({
      version: version,
      path: '/docs',
      documentation: {
        info: {
          title: 'Tools API',
          version: version,
        },
        tags: [
          { name: 'General', description: 'General API endpoints' },
          { name: 'Soundcloud', description: 'Soundcloud API endpoints' },
        ],
      },
      exclude: ['/docs', '/docs/json'],
      theme: 'dark',
      scalarConfig: {
        theme: 'purple',
      },
    }),
  );
}

api.listen(PORT);
console.log(`Listening on port ${PORT}`);

export type Api = typeof api;
