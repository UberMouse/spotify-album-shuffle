import { stringify } from "querystring";

import { Album, Saved, Track } from "spotify-types";

import { getToken } from "./auth";
import { Paginate } from "./types";
import { assert } from "./utils";

type Options = {
  endpoint: string;
  query?: Record<string, string | number>;
  body?: Record<string, string | number>;
  method: "GET" | "POST" | "PUT";
};
async function callApi<T extends undefined>({
  endpoint,
  method,
  query,
  body,
}: Options): Promise<T>;
async function callApi<T>({
  endpoint,
  method,
  query,
  body,
}: Options): Promise<T>;
async function callApi<T>({
  endpoint,
  method,
  query,
  body,
}: Options): Promise<T | undefined> {
  const response = await fetch(
    `https://api.spotify.com/v1${endpoint}${
      query ? `?${stringify(query)}` : ""
    }`,
    {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Authorization: `Bearer ${getToken().access_token}`,
      },
    }
  );

  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export function startQueueFromAlbum(album: Album) {
  return callApi({
    endpoint: `/me/player/play`,
    method: "PUT",
    body: {
      context_uri: album.uri,
    },
  });
}

export function getQueue() {
  return callApi<{
    currently_playing: Track;
    queue: Track[];
  }>({
    endpoint: `/me/player/queue`,
    method: "GET",
  });
}

export async function appendAlbumToQueue(album: Album): Promise<void> {
  assert("items" in album.tracks);

  for (const track of album.tracks.items) {
    await callApi({
      endpoint: `/me/player/queue`,
      method: "POST",
      query: {
        uri: track.uri,
      },
    });
  }
}

export async function getSavedAlbums(): Promise<Album[]> {
  const albums: Album[] = [];

  let page = 0;
  while (true) {
    page += 1;
    const data = await callApi<Paginate<Saved<"album", Album>>>({
      endpoint: "/me/albums",
      method: "GET",
      query: {
        limit: 50,
        offset: (page - 1) * 50,
      },
    });

    if (data.items) {
      albums.push(...data.items.map((a) => a.album));
    }
    if (!data.next) {
      break;
    }
  }

  return albums;
}
