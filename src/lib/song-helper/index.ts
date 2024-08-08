import { cleanWhitespace, pascalCase } from '../utils/strings';
import { REG_FEAT_BRACE, REG_MATCH_BRACES, REG_SONG_RELEASE_TYPE } from './regex';
import { artistStringToList } from './utils';

/**
 *
 * @param query A song title query such as "Artist 1 , Artist 2 & Artist 3 - Song Title (feat. Artist 4) - Artist 5 Remix"
 * @returns an object with the title separated into artists and song title
 */
export function parseSongQuery(input: string) {
  const parts = input.split(' - ').map((x) => x.trim());

  const artists: string[] = [];
  const title = cleanWhitespace(parts.at(-1)!);
  const braces = input.match(REG_MATCH_BRACES);

  var type = 'Original';

  // ARTISTS
  if (parts.length > 1) {
    artists.push(...artistStringToList(parts[0]));
  }

  // BRACES
  braces?.forEach((x) => parseBrackets(x));

  // RELEASE TYPE

  return {
    artists: Array.from(new Set(artists)),
    title,
    type,
  };

  //#region FUNCTIONS
  function parseBrackets(content: string) {
    // Brace content includes a feature
    let indicator = content.match(REG_FEAT_BRACE)?.[0];

    // Brace includes info about the release type
    if (!indicator) {
      indicator = content.match(REG_SONG_RELEASE_TYPE)?.[0];

      // Release type caught - update type
      if (indicator) {
        type = pascalCase(indicator);
      }
    }

    if (!indicator) {
      // Brace is neither
      return;
    }

    // Remove indicator from content
    content = content.replace(indicator, '').trim();
    // Add artists to list
    artists.push(...artistStringToList(content));
  }
  //#endregion
}
