import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import fs from "node:fs";
import { SoundcloudController } from './controllers/soundcloud-controller';

const PORT = process.env.PORT || 3000;
const tlsKey = process.env.TLS_KEY_PATH;
const tlsCert = process.env.TLS_CERT_PATH;

const api = new Elysia()
  .use(SoundcloudController)
  .use(cors())
  .use(
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
  )
  .listen({
    port: PORT,
    tls: {
      key: tlsKey ? fs.readFileSync(tlsKey) : undefined,
      cert: tlsCert ? fs.readFileSync(tlsCert) : undefined,
    },
  });

console.log(`Listening on port ${PORT}`);

export type Api = typeof api;
