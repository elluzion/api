import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { SoundcloudController } from './controllers/soundcloud-controller';

const api = new Elysia({ prefix: '/api' }).use(SoundcloudController).use(
  swagger({
    version: '1.0.0',
    path: '/docs',
    documentation: {
      info: {
        title: 'Tools API',
        version: '1.0.0',
      },
    },
    theme: 'dark',
    scalarConfig: {
      theme: 'purple',
    },
  }),
);

export type Api = typeof api;
export default api;
