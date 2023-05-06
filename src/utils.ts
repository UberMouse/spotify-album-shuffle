import { Album, SimplifiedTrack } from "spotify-types";

export function assertIsDefined(value: any, message?: string): asserts value {
  if (value === undefined) {
    throw new Error(message ?? "Expected value to be defined");
  }
}

export function assert(value: any, message?: string): asserts value {
  if (!value) {
    throw new Error(message ?? "Expected value to be truthy");
  }
}

export function getRandomAlbum(albums: Album[]): Album {
  const index = Math.floor(Math.random() * albums.length);

  return albums[index];
}

export function getLastTrack(album: Album): SimplifiedTrack {
  assert("items" in album.tracks);

  return album.tracks.items[album.tracks.items.length - 1];
}
