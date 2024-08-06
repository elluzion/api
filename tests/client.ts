import { treaty } from '@elysiajs/eden';
import type { Api as ApiType } from '../src';
import { api } from '../src';

// Start up the API itself
const _api = api;
// Get the API URL
const apiUrl = _api.server!.url.origin;

export const client = treaty<ApiType>(apiUrl);
