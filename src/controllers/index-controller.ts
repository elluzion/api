import Elysia from 'elysia';
import Environment from '../lib/environment';

export const IndexController = (app: Elysia) =>
  app.get(
    '/',
    async ({ request: { url } }) => {
      return {
        version: await Environment.VERSION(),
        docs: Environment.IS_DEV ? `${url}docs` : undefined,
      };
    },
    {
      detail: { description: 'Returns the current version of the API.', tags: ['General'] },
    },
  );
