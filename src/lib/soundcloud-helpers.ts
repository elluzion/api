import fs from 'node:fs';
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
  try {
    const soundcloud = new Soundcloud();
    const track = await soundcloud.tracks.getAlt(url);

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
      artUrl: track.artwork_url || track.user.avatar_url,
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
  const soundcloud = new Soundcloud();
  const tempId = Math.random().toString(36).substring(2, 10);
  const track = await soundcloud.tracks.getAlt(url);

  try {
    let filePath = `temp/tracks/${tempId}`;
    filePath = await soundcloud.util.downloadTrack(track, filePath);

    // Read the downloaded audio file as a buffer
    const file = fs.readFileSync(filePath);

    // Delete the temporary file
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log(filePath + ' was deleted');
    });

    return new File([file], 'audio.mp3');
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
