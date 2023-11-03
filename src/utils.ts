import { Album } from "spotify-types";

export function assertIsDefined(value: any, message?: string): asserts value {
  if (value === undefined || value === null) {
    throw new Error(message ?? "Expected value to be defined");
  }
}

export function assert(value: any, message?: string): asserts value {
  if (!value) {
    throw new Error(message ?? "Expected value to be truthy");
  }
}

export function getRandomAlbum(
  albums: Album[],
  alreadyQueuedAlbums: Album[]
): Album {
  let selectedAlbum: Album;
  do {
    const index = Math.floor(Math.random() * albums.length);

    selectedAlbum = albums[index];
  } while (alreadyQueuedAlbums.includes(selectedAlbum));

  return selectedAlbum;
}

export function getAlbumLengthMs(album: Album): number {
  assert("items" in album.tracks);

  return album.tracks.items.reduce((acc, curr) => acc + curr.duration_ms, 0);
}
