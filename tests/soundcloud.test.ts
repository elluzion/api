import { expect, test } from 'bun:test';
import { client } from './client';

test('successful soundcloud.com import', async () => {
  const URL = 'https://soundcloud.com/skrillex/skrillex-fred-again-flowdan-rumble';
  const { data } = await client.soundcloud.import.get({ query: { url: URL } });
  expect(data).not.toBeNull();
});

test('successful m.soundcloud.com import', async () => {
  const URL = 'https://m.soundcloud.com/skrillex/skrillex-fred-again-flowdan-rumble';
  const { data } = await client.soundcloud.import.get({ query: { url: URL } });
  expect(data).not.toBeNull();
});

test('successful on.soundcloud.com import', async () => {
  const URL = 'https://on.soundcloud.com/nChC4';
  const { data } = await client.soundcloud.import.get({ query: { url: URL } });
  expect(data).not.toBeNull();
});

test('wrong link - errored import', async () => {
  const URL = 'https://soundcloud.com/';
  const { data } = await client.soundcloud.import.get({ query: { url: URL } });
  expect(data).toBeNull();
});
