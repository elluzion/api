import { REG_ARTIST_LIST_SEPARATOR } from './regex';

export function artistStringToList(artistString: string): string[] {
  return artistString
    .split(REG_ARTIST_LIST_SEPARATOR)
    .filter((x) => x && ` ${x} `.match(REG_ARTIST_LIST_SEPARATOR) == null)
    .map((x) => x.trim());
}
