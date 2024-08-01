import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import fs from "node:fs";
import { SoundcloudController } from './controllers/soundcloud-controller';
import Environment from './lib/environment';

// Validate environment variables
Environment.validate();

const { PORT, TLS_KEY, TLS_CERT } = Environment;

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
      key: TLS_KEY ? fs.readFileSync(TLS_KEY) : undefined,
      cert: TLS_CERT ? fs.readFileSync(TLS_CERT) : undefined,
    },
  });

console.log(`Listening on port ${PORT}`);

export type Api = typeof api;
