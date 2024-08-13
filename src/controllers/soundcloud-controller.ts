import Elysia, { error, t } from 'elysia';
import { downloadFromSoundcloud, importFromSoundcloud, SoundcloudUtils } from '../lib/soundcloud-helpers';
import { Song } from '../types/song';

export const SoundcloudController = (app: Elysia) =>
  app.group('/soundcloud', (app) =>
    app
      .get(
        '/import',
        async ({ query: { url } }) => {
          if (!url) {
            return error(400, 'Missing URL');
          }

          const isValid = (await SoundcloudUtils.validateSoundcloudUrl(url)) ? true : false;
          if (!isValid) return error(400, 'Invalid URL');

          const data = await importFromSoundcloud(url);
          return data || error(404, 'Song not found');
        },
        {
          detail: { description: 'Returns a Song from a provided URL.' },
          query: t.Object({ url: t.String() }),
          response: {
            200: Song,
            400: t.String(),
            404: t.String(),
            500: t.String(),
          },
        },
      )
      .get(
        '/download',
        async ({ query: { url } }) => {
          if (!url) {
            return error(400, 'Missing URL');
          }

          const isValid = (await SoundcloudUtils.validateSoundcloudUrl(url)) ? true : false;
          if (!isValid) return error(400, 'Invalid URL');

          const file = await downloadFromSoundcloud(url);
          return file || error(500, 'Error downloading song');
        },
        {
          detail: {
            description: 'Returns a Soundcloud Song as an audio file.',
          },
          query: t.Object({ url: t.String() }),
          response: {
            200: t.File(),
            400: t.String(),
            404: t.String(),
            500: t.String(),
          },
        },
      ),
  );
