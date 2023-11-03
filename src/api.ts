import { stringify } from "querystring";

import { Album, Saved, SimplifiedTrack } from "spotify-types";

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

  if (response.status === 429) {
    const retryAfterS = Number(response.headers.get("Retry-After")) + 1;
    console.log("Hit rate limit, retrying after", retryAfterS, "seconds.");

    await new Promise((resolve) => setTimeout(resolve, retryAfterS * 1000));

    return callApi<T>({ endpoint, method, query, body });
  }

  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export async function startQueueFromAlbum(album: Album) {
  assert("items" in album.tracks);
  await callApi({
    endpoint: `/me/player/play`,
    method: "PUT",
    body: {
      context_uri: album.uri,
    },
  });

  // Spotify sucks and immediatly queueg after playing an album inserts after the first song..
  // So lets just queue up the rest of the album so that doesn't matter
  const allTracksButFirst = album.tracks.items.slice(1);

  return appendTracksToQueue(allTracksButFirst);
}

export async function appendAlbumToQueue(album: Album): Promise<void> {
  assert("items" in album.tracks);

  return appendTracksToQueue(album.tracks.items);
}

async function appendTracksToQueue(tracks: SimplifiedTrack[]) {
  for (const track of tracks) {
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

  const firstPage = await callApi<Paginate<Saved<"album", Album>>>({
    endpoint: "/me/albums",
    method: "GET",
    query: {
      limit: 50,
    },
  });

  const totalPages = Math.ceil(firstPage.total / 50);

  albums.push(...firstPage.items.map((item) => item.album));

  const albumPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      callApi<Paginate<Saved<"album", Album>>>({
        endpoint: "/me/albums",
        method: "GET",
        query: {
          limit: 50,
          offset: (i + 1) * 50,
        },
      })
    )
  );

  for (const page of albumPages) {
    albums.push(...page.items.map((item) => item.album));
  }

  return albums;
}
