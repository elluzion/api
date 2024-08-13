/**
 * The regular expression used to match braces ([...], {...}, (...))
 */
export const REG_MATCH_BRACKETS = /(?<=\[)[^\]]+(?=\])|(?<=\{)[^}]+(?=\})|(?<=\().+?(?=\))/gs;

/**
 * The regular expression used to match song release types
 */
export const REG_SONG_RELEASE_TYPE = /remix|edit|vip|flip|bootleg/gi;

/**
 * The regular expression used to match brackets including (a) featuring artist(s)
 */
export const REG_FEAT_BRACE = /^(f(ea)?t(uring)?(\.)?|w\/)(\.|\s)/gi;

/**
 * The regular expression used to match artists separated by comma, & and others
 */
export const REG_ARTIST_LIST_SEPARATOR = /(?:,|\s(&|x|ft\.?))\s+/gi;
