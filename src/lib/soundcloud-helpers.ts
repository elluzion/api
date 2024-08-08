import fs from 'node:fs';
import path from 'node:path';
import { Soundcloud } from 'soundcloud.ts';
import type { Song } from '../types/song';
import { parseQuery } from './utils/string-utils';

/**
 * Imports a song from Soundcloud based on the provided URL.
 *
 * @param {string} url - The URL of the Soundcloud track.
 * @return {Promise<Song>} The parsed data of the imported song.
 * @throws {Error}
 */
export async function importFromSoundcloud(url: string) {
  url = url.trim();

  url = (await SoundcloudUtils.validateSoundcloudUrl(url)) || '';
  if (url == '') return undefined;

  try {
    const soundcloud = new Soundcloud();
    const track = await soundcloud.tracks.getAlt(url);

    if (!track || !(track instanceof Object)) {
      return undefined;
    }

    const { title, artists, type } = parseQuery(track.title);
    const releaseDate = new Date(track.release_date || track.display_date);
    const labelName = track.label_name || track.user.username;

    if (artists.length == 0) {
      artists.push(track.user.username);
    }

    const data: Song = {
      url: url,
      artists: artists,
      title: title,
      permalink: track.permalink,
      releaseDate: releaseDate,
      label: labelName,
      artUrl: SoundcloudUtils.improveSoundcloudArtwork(track.artwork_url) || track.user.avatar_url,
      genre: track.genre,
      type: type,
    };

    return data;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

/**
 * Downloads a track from Soundcloud and returns it as a File object.
 *
 * @param {string} url - The URL of the Soundcloud track.
 * @return {Promise<File | undefined>} The downloaded track as a File object, or undefined if an error occurred.
 */
export async function downloadFromSoundcloud(url: string) {
  url = url.trim();

  url = (await SoundcloudUtils.validateSoundcloudUrl(url)) || '';
  if (url == '') return undefined;

  const soundcloud = new Soundcloud();
  const tempId = Math.random().toString(36).substring(2, 10);
  const track = await soundcloud.tracks.getAlt(url);

  try {
    let filePath = `temp/tracks/${tempId}`;
    filePath = await soundcloud.util.downloadTrack(track, filePath);

    // Read the downloaded audio file as a buffer
    const file = fs.readFileSync(filePath);

    // Delete the temporary file
    filePath = path.dirname(filePath);
    fs.rm(filePath, { recursive: true, force: true }, (err) => {
      if (err) throw err;
    });

    return new File([file], 'audio.mp3');
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export class SoundcloudUtils {
  /**
   * Checks if the provided URL is a valid Soundcloud URL.
   *
   * @param {string} url - The URL to validate.
   * @return {string | undefined} The validated URL or undefined.
   */
  static async validateSoundcloudUrl(url: string) {
    const DEFAULT_URL = 'https://soundcloud.com/';
    const APP_URL = 'https://on.soundcloud.com/';
    const MOBILE_URL = 'https://m.soundcloud.com/';

    if (url.startsWith(MOBILE_URL)) {
      return url.replace(MOBILE_URL, DEFAULT_URL);
    }

    if (url.startsWith(APP_URL)) {
      const r = await fetch(url);
      if (!r.ok || !r.url) {
        return undefined;
      }
      url = r.url;
    }

    if (url.startsWith(DEFAULT_URL)) {
      return url;
    }

    return undefined;
  }

  /**
   * Replaces the size parameter in a Soundcloud artwork URL with the specified target size.
   *
   * @param {string} url - The Soundcloud artwork URL.
   * @param {'large' | 'original' | 't500x500'} [targetSize='t500x500'] - The target size for the artwork. Defaults to 't500x500'.
   * @return {string} - The modified Soundcloud artwork URL with the target size.
   */
  static improveSoundcloudArtwork(url: string, targetSize: 'large' | 'original' | 't500x500' = 't500x500') {
    if (url.includes('sndcdn.com/artworks-')) {
      return url.replace(/([tl]\d+x\d+|(?:large|original))(?=\.\w+$)/, targetSize);
    }
    return url;
  }
}
