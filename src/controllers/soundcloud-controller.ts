import Elysia, { error, t } from 'elysia';
import { downloadFromSoundcloud, importFromSoundcloud } from '../lib/soundcloud-helpers';
import { Song } from '../types/song';

export const SoundcloudController = (app: Elysia) =>
  app.group('/soundcloud', (app) =>
    app
      .get(
        '/import',
        async ({ query: { url } }) => {
          const validateError = isValidSoundcloudUrl(url);
          if (validateError) return validateError;

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
          const validateError = isValidSoundcloudUrl(url);
          if (validateError) return validateError;

          /// TODO: VERCEL ERROR - CANNOT STORE FILES IN VERCEL
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

function isValidSoundcloudUrl(url?: string) {
  let _error = undefined;

  if (!url || !(typeof url === 'string')) {
    _error = error(400, 'No URL provided');
  }

  // Validate URL
  if (!url!.startsWith('https://soundcloud.com') && !url!.startsWith('https://on.soundcloud.com')) {
    _error = error(404, `"${url}" is not a soundcloud URL.`);
  }

  return _error;
}
