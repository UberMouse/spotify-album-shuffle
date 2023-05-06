import {
  RoutingEvent,
  createXStateTreeMachine,
  buildRootComponent,
  PickEvent,
} from "@koordinates/xstate-tree";
import { assign } from "@xstate/immer";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Album, SimplifiedTrack, Track } from "spotify-types";
import { createMachine } from "xstate";

import {
  appendAlbumToQueue,
  getQueue,
  getSavedAlbums,
  startQueueFromAlbum,
} from "./api";
import { authMachine } from "./auth";
import { authorize, root, history } from "./routes";
import { assertIsDefined, getLastTrack, getRandomAlbum } from "./utils";

type Events = RoutingEvent<typeof root> | PickEvent<"AUTHENTICATED">;
type Context = {
  albums?: Album[];
  queue?: Track[];
  currentlyPlaying?: Track;
  lastAddedTrack?: SimplifiedTrack;
};
const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BXAdgQSwBcALSAYjwFUAVACQFEA5agSQGE9r6ARAbQAYAuolCoA9rACWhSWJwiQAD0QBmFQE4MARnUBWAEwAOQ7pWH+KrQHYANCACeiI-ozqrK3eoAs+rfy0AbBYAvsF2aJi4BCTkAOIA8gD61EkASvHx1ALCSCDiUjJyCsoIXlZWGEZqXj78Vua6AXaOCFr6KhgqVvq6ht1l-Ia+oeHoGMhEpDgyAMbIhJAYAE6QkiszMjhQZAnJaRlZQgr50rLyuSUqAboY-F5tJoZ6+vpWTQ6IXuouPV3qQQEVC8tIYRiAIuNJmBppI5gsIBg5KkxGJCBgYIRNlAWDhTsgADbcebIMgQORgDCSHAANzEAGsKRCJjEYXDFkiUWiMVicXjCcSEFTaXCztlsscJKcihdVOoOrp+IqvPxGiYvBpmogAt1OnpvjVfLofOowUyoaz5uycMjURhUPjkPZUsgcGSALZ4fEAIywbtJ5MpNPpjLGzKms0tCI5tvtjudrrEHu9vsFQZFcjFR1yJ0K51AJT8XkMuoC11LvWVlk1CG1Lg0nn0Bq0Rv0JrC4ND5oj8MR1s5GDdcmkYiWVKgAEUsGApxgAGZgQgzYhsLBLFbTfH2AAKDvsY-9OApQuD407LO7VptaMHuMII7Hk+nFPni+Xq-XhE3O8dY9TwvmopCOK2aSrmxSII0NxqFYipBN4qr6NW6j8AErhWFogR1K8Xz6KaZ7hrCka9leA5Dneo5bI+M4QAuYBLG6VL7sBoigWc4GtFoliuDo+iAt4ATeN0SHtBgph+AYWhfPU7h4ZgYbQheUZ9raN7DhRE5TtRtH0YxWxkLwWg5CxBRsTKHFceoPF8V4AllIhHytPwraifUJjdIEtReLJkLnoRPbRteZH3pRmkhqg0IQIwYAAO6ej6fpkoega0gyp5yV2fmXv2qnkQ+oVpRFUWxcmbp-mI6Y4JmRl5Kx0r5og1j+LcPReGJARtN0uhIYqtxGjZKGWOoQ0qKE7Y4GINHwLkEQSiZdVKIgAC0AReBg9yNJZgz3F0AT2S0i0Ydo2EoV8QSmN8uHthCURQhAs1SnmC0IJ4lS+P4GjPHoGHVu0WiiSC3xDbowP8ENoJXfhCmZXdIFzY9JQHah60CX4hjbW8e2qAJGDoQCRiGF0RhtqM6W+WyCIrBAaxgBsY73WBZl6DjZjXG0ehBDBXjVq1FS+EEKiDJJVhuKY3nyRa-nKYQ9OmfVCBcRWAtPM2hi7WY1a9C4u09M2dQYXcYsZeTxH9tyY68jIBJEoQyAy-NJRDGtNlFitfjIeq7wtNq-BHT0oPe7UWiG2TREBXau7xu6cW+nb8OIDBLiBBhjQoQJgy2A53u+wq-yc5dJM+QRxthzlwUaU+sfscLolo0rlm9GrhjVoYfiVC3KoPM2Z3B0XodS6Rt5l1Rz4LkuK5rgpX67nTsMPexHU1+qgz16r7RNw5TwVPUha9OYfSlj3UPF-3pfqcPGA0QsOm4lsleM98txWMDO2ExY6jCcWOhvOoxiuTZI0Q1Jr3SWJFT55SfBgaKyBTi31ngzOW1gfDNT8PoQYGh2oZxaCgv6pY6geHgu1e4h8JZZRUkFM++UIiFRitHN0d8EHqk0EYFWnE9Cqxss3NwON26tWMOna4o1ghAA */
    predictableActionArguments: true,
    id: "app",
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {
        getInitialData: {
          data: {} as { albums: Album[] },
        },
        playRandomAlbum: {
          data: {} as SimplifiedTrack,
        },
        appendNewAlbum: {
          data: {} as SimplifiedTrack,
        },
        fetchCurrentlyPlaying: {
          data: {} as { currently_playing: Track; queue: Track[] },
        },
      },
    },
    tsTypes: {} as import("./app.typegen").Typegen0,
    context: {},
    invoke: {
      src: "auth",
      id: "auth-slot",
    },
    initial: "unAuthed",
    states: {
      unAuthed: {
        on: {
          AUTHENTICATED: {
            target: "authenticated",
          },
          GO_TO_ROOT: { actions: "startOAuthFlow" },
        },
      },
      authenticated: {
        initial: "redirecting",
        states: {
          redirecting: {
            entry: "redirectToRoot",
            on: {
              GO_TO_ROOT: "onRoot",
            },
          },
          onRoot: {
            initial: "gettingInitialData",
            states: {
              gettingInitialData: {
                invoke: {
                  src: "getInitialData",
                  onDone: {
                    target: "playRandomAlbum",
                    actions: "saveInitialData",
                  },
                },
              },
              playRandomAlbum: {
                invoke: {
                  src: "playRandomAlbum",
                  onDone: {
                    target: "monitoringQueue",
                    actions: "saveLastTrack",
                  },
                },
              },
              monitoringQueue: {
                initial: "fetchCurrentlyPlaying",
                states: {
                  fetchCurrentlyPlaying: {
                    invoke: {
                      src: "fetchCurrentlyPlaying",
                      onDone: {
                        target: "determining",
                        actions: "saveQueue",
                      },
                    },
                  },
                  determining: {
                    always: [
                      {
                        target: "appendNewAlbum",
                        cond: "currentlyPlayingIsLastAddedTrack",
                      },
                      { target: "waiting" },
                    ],
                  },
                  waiting: {
                    after: {
                      queueCheckDelay: "fetchCurrentlyPlaying",
                    },
                  },
                  appendNewAlbum: {
                    invoke: {
                      src: "appendNewAlbum",
                      onDone: {
                        target: "fetchCurrentlyPlaying",
                        actions: "saveLastTrack",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    services: {
      auth: authMachine,
      getInitialData: async () => {
        return { albums: await getSavedAlbums() };
      },
      fetchCurrentlyPlaying: async ({ lastAddedTrack }) => {
        // Takes a bit for Spotify to update the queue
        await new Promise((resolve) => setTimeout(resolve, 1000));
        assertIsDefined(lastAddedTrack);

        const queueInfo = await getQueue();
        const queue: Track[] = [];

        // The queue includes lots of duplicate tracks because it... loops?
        // This grabs from the queue until we detect the end ourselves
        for (const track of queueInfo.queue) {
          queue.push(track);

          if (track.id === lastAddedTrack.id) {
            break;
          }
        }

        return {
          currently_playing: queueInfo.currently_playing,
          queue,
        };
      },
      playRandomAlbum: async ({ albums }) => {
        assertIsDefined(albums);
        const randomAlbum = getRandomAlbum(albums);

        await startQueueFromAlbum(randomAlbum);

        console.log(getLastTrack(randomAlbum), randomAlbum);
        return getLastTrack(randomAlbum);
      },
      appendNewAlbum: async ({ albums }) => {
        assertIsDefined(albums);
        const randomAlbum = getRandomAlbum(albums);

        await appendAlbumToQueue(randomAlbum);

        return getLastTrack(randomAlbum);
      },
    },
    actions: {
      redirectToRoot: () => {
        setTimeout(() =>
          root.navigate({
            meta: {
              replace: true,
            },
          })
        );
      },
      saveInitialData: assign((ctx, e) => {
        ctx.albums = e.data.albums;
      }),
      startOAuthFlow: () => {
        window.location.href = "http://localhost:8888/api/login";
      },
      saveQueue: assign((ctx, e) => {
        ctx.currentlyPlaying = e.data.currently_playing;
        ctx.queue = e.data.queue;
      }),
      saveLastTrack: assign((ctx, e) => {
        ctx.lastAddedTrack = e.data;
      }),
    },
    guards: {
      currentlyPlayingIsLastAddedTrack: ({
        currentlyPlaying,
        lastAddedTrack,
      }) => {
        assertIsDefined(currentlyPlaying, "currentlyPlaying");
        assertIsDefined(lastAddedTrack, "lastAddedTrack");

        return currentlyPlaying.id === lastAddedTrack.id;
      },
    },
    delays: {
      queueCheckDelay: 60 * 1000,
    },
  }
);

function Loading() {
  return (
    <Col>
      <p>Loading</p>
    </Col>
  );
}

function CurrentlyPlaying({
  currentPlaying,
  queue,
}: {
  currentPlaying: Track;
  queue: Track[];
}) {
  return (
    <Row>
      <Col>
        <p>
          Currently playing: {currentPlaying.name} by{" "}
          {currentPlaying.artists.map((artist) => artist.name).join(", ")}
        </p>
      </Col>
      <Col>
        {queue.map((track) => (
          <Row key={track.id}>
            <Col>
              {track.name} by{" "}
              {track.artists.map((artist) => artist.name).join(", ")}
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );
}

const AppMachine = createXStateTreeMachine(machine, {
  selectors({ ctx, inState }) {
    return {
      loading:
        !inState("authenticated.onRoot.monitoringQueue") ||
        !ctx.currentlyPlaying,
      queue: ctx.queue!,
      currentlyPlaying: ctx.currentlyPlaying!,
    };
  },
  View: function App({ selectors }) {
    return (
      <Container>
        <Row>
          {selectors.loading ? (
            <Loading />
          ) : (
            <CurrentlyPlaying
              currentPlaying={selectors.currentlyPlaying}
              queue={selectors.queue}
            />
          )}
        </Row>
      </Container>
    );
  },
});

export const App = buildRootComponent(AppMachine, {
  basePath: "/",
  history,
  routes: [authorize, root],
});
