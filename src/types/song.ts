import { t, type Static } from 'elysia';

export const Song = t.Object({
  url: t.String(),
  artists: t.Array(t.String()),
  title: t.String(),
  permalink: t.String(),
  releaseDate: t.Date(),
  label: t.Optional(t.String()),
  type: t.String(),
  artUrl: t.Optional(t.String()),
  genre: t.Optional(t.String()),
});

export type Song = Static<typeof Song>;
