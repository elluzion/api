import Elysia from 'elysia';
import Environment from '../lib/environment';

export const IndexController = (app: Elysia) =>
  app.get('/', async ({ headers: { referer } }) => {
    return {
      from: referer,
      version: await Environment.VERSION(),
      docs: '/docs',
    };
  });
