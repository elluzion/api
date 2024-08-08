/**
 *
 * @param query A song title query such as "Artist 1 , Artist 2 & Artist 3 - Song Title (feat. Artist 4) - Artist 5 Remix"
 * @returns an object with the title separated into artists and song title
 */
export function parseQuery(query: string) {
  // Cleanup query
  query = query
    .replace('(ft.', '(feat.') // some people use ft. as a short form, we unify it to feat.
    .replace('(w/', '(feat.') // or they use w/
    .replace('(featuring', '(feat.') // or they use featuring
    .replaceAll('[', '(') // replace [] with ()
    .replaceAll(']', ')'); // ^^

  // filter feature bracket artists from query if available
  const queryFeatureArtists = query.includes('(feat.') ? query.split('(feat.')[1].split(')')[0] : undefined;
  // remove feature bracket
  query = query.replace(`(feat.${queryFeatureArtists})`, '');

  const queryParts = query.split('-');
  const queryArtists = queryParts.length > 1 ? queryParts[0] : undefined;
  const queryTitle = queryArtists ? queryParts.slice(1).join(' ') : query;

  const title = cleanWhitespace(queryTitle);
  let artists: string[] = [];

  // MAIN ARTISTS
  if (queryArtists) {
    artists.push(...artistStringToList(queryArtists));
  }

  // FEATURE ARTISTS
  if (queryFeatureArtists) {
    artists.push(...artistStringToList(queryFeatureArtists));
  }

  // ARTISTS FORMATTING (CAMEL CASE)
  artists = artists.map((artist) => {
    return artist
      .split(' ')
      .map((x) => pascalCase(x))
      .join(' ');
  });

  // RELEASE TYPE
  const typesRegex = /remix|edit|vip|flip|bootleg/;
  const type = pascalCase(queryTitle.toLowerCase().match(typesRegex)?.[0] || 'Original');

  return {
    title: title,
    artists: artists,
    type: type,
  };
}

/**
 * Splits an artist string into an array of artists, separated by commas, ampersands, or "x".
 *
 * @param {string} artistString - The string containing the artist names separated by commas, ampersands, or "x".
 * @return {string[]} An array of artist names, with leading and trailing whitespace removed from each name.
 */
export function artistStringToList(artistString: string): string[] {
  // artists separated by comma or &
  return artistString.split(/(?:,|\s&|\sx)\s+/).map((x) => x.trim());
}

/**
 * Removes excessive whitespace from a string and replaces it with a specified filler character or single whitespace if none is specified.
 *
 * @param {string} input - The input string to clean.
 * @param {string} [filler=' '] - The character to replace whitespace with. Defaults to a space.
 * @return {string} The cleaned string with no extra whitespace.
 */
function cleanWhitespace(input: string, filler?: string) {
  return input.replace(/\s+/g, filler || ' ').trim();
}

/**
 * Converts a string to PascalCase.
 *
 * @param {string} input - The input string to convert.
 * @return {string} The input string converted to PascalCase.
 */
function pascalCase(input: string) {
  return input[0].toUpperCase() + input.slice(1).toLowerCase();
}
