import { expect, test } from 'bun:test';
import Environment from '../src/lib/environment';
import { client } from './client';

test('index route and version', async () => {
  const { data } = await client.index.get();
  expect(data?.version).toBe(await Environment.VERSION());
});
