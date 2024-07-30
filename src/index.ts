import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { SoundcloudController } from './controllers/soundcloud-controller';

const PORT = process.env.PORT || 3000;

const api = new Elysia().use(SoundcloudController).use(
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

api.listen(PORT);

console.log(`Listening on port ${PORT}`);

export type Api = typeof api;
export default api;
