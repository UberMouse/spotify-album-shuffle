import {
  RoutingEvent,
  createXStateTreeMachine,
  buildRootComponent,
  PickEvent,
} from "@koordinates/xstate-tree";
import { assign } from "@xstate/immer";
import humanizer from "humanize-duration";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Album } from "spotify-types";
import { createMachine } from "xstate";

import { appendAlbumToQueue, getSavedAlbums, startQueueFromAlbum } from "./api";
import { authMachine } from "./auth";
import { authorize, root, history } from "./routes";
import { getAlbumLengthMs, getRandomAlbum } from "./utils";

type Events =
  | RoutingEvent<typeof root>
  | PickEvent<"AUTHENTICATED">
  | { type: "RESET" };
type Context = {
  libraryAlbums: Album[];
  queuedAlbums: Album[];
  targetQueueDurationMs: number;
};
const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BXAdgQSwBcALSAYjwFUAVACQFEA5agSQGE9r6ARAbQAYAuolCoA9rACWhSWJwiQAD0QBmFQE4MARnUBWAEwAOQ7pWH+KrQHYANCACeiI-ozqrK3eoAs+rfy0AbBYAvsF2aJi4BCTkAOIA8gD61EkASvHx1ALCSCDiUjJyCsoIXlZWGEZqXj78Vua6AXaOCFr6KhgqVvq6ht1l-Ia+oeHoGMhEpDgyAMbIhJAYAE6QkiszMjhQZAnJaRlZQgr50rLyuSUqAboY-F5tJoZ6+vpWTQ6IXuouPV3qQQEVC8tIYRiAIuNJmBppI5gsIBg5KkxGJCBgYIRNlAWDhTsgADbcebIMgQORgDCSHAANzEAGsKRCJjEYXDFkiUWiMVicXjCcSEFTaXCztlsscJKcihdPv4MLp+IqvHUTFddFpmohrlpbgEeup1FoQVplaCwuCxsyprN5uycMjURhUPjkPZUsgcGSALZ4fEAIywXtJ5MpNPpjMtUNZtoRHMdztd7s9Yh9-sDgrDIrkYqOuROhXOoBKfi8hk6-2uAWuhmVlk1CACem0LwMg26Rqs6jBTKjNvhiPtnIwAEcsGAsFSoJRUL6A17YOMIBBJ7PA7BqGIAIpjseUiD4sBkcV5yUF4qIY0YGr1Nz6AJ9Kv1et+LquXS9HxDFT8RtebuRlk+ztB00VHcdJ2nVd50XZctig9ctx3ClJH3Q9eC0HJRFPM5z1aVwDQNLx73qQxAhLZ8fwqIxDTePQTS0Dx-0wK1oSA2NB0dMCJy2SC02g5AlxXPiEO3cdGUEuC+ODHBkLDBlxgA61YRjAcQJHHcIJnYSYKEucRKQnTJLnDNhXmUUhGPLCChwmVSiBTpS3+QY9UNDwvGfDs3w-K51AsXQ-3NHtAOU-s41AjSeK0vTDKgeCN1E3cBNg2KpLAJYljEJYnRdQgADNMq9BTmN7ELgKHLjNPgmK4sQsTqr4kyxCzHAc0wvJsOlItPkCByniCHxvisNp63+Ms9R6OoAj8KbviYyFgrZdi1IqyKqqSyB6BwMQsCgYh4LIVJ6AAZXoQ42vzGyuoQN4XDUapG30OpBufHovGbCa3BI78zXNLaIDgBQIglazOqURAAFp2jLRUYdMNojRretwaNZsrHuBVbwrLtArGKIoQgYGpULMGEE8SpfH8DRnjojUPgQdodXVJ59ANd8MfUM1RmKhaY0Js9bOR3zbhh-g4d8EF3LpnyMCGoIWbRnwvEsOaWOjfsVmXdYsT5y6SabdxDG1FnGjqO56y8XQqMCCxBhNTsrFMFWSsW1TOR10GSmRnxhdhyxxcRunGh1ajrCI4wVB8XQnZ50KOK5MBMUnXkZAJIlCGQd3iZKTsZc7Uj-iG-4NHeFoAlLGWnmsS3ej67GufmpSXbC7LEw9b0oMz3CrH4FwyK0E2q18vp6wCbv3ox0e7n0aPG5U5uVqnKK107gXvB9xUxYRjR607DpxoVfzG3VEIce52fY+WiLF7WiSUr0+KkJXq7waI9fRb9rf1HrYwdTaCbrmVD+UsM9WKlSWuVK+vFopJV0muB+dUUIHifiTN6ItFR+BrH4auI0awVxot3TwX464WjPqApucd1LgVWtpGBRk4G1USrfDuJ4QZZ0QDcO6d0ygkRVLoDyFsvI1hqF8F4nMSENzIXPChC8oFrhghtLaO09rCWQSUWotxCHeHKBzIYd5nzfgqBbD8d4fz6DKNjUIQA */
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
          data: {} as Album,
        },
        appendNewAlbum: {
          data: {} as Album,
        },
      },
    },
    tsTypes: {} as import("./app.typegen").Typegen0,
    context: {
      libraryAlbums: [],
      queuedAlbums: [],
      targetQueueDurationMs: 1000 * 60 * 60 * 8,
    },
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
            id: "root",
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
                    target: "queuingUpAlbums",
                    actions: "saveAlbumToQueue",
                  },
                },
              },

              queuingUpAlbums: {
                initial: "addingAlbumsToQueue",
                id: "queuing",
                states: {
                  addingAlbumsToQueue: {
                    initial: "idle",
                    states: {
                      idle: {
                        always: [
                          {
                            cond: "minimumQueueDurationReached",
                            target: "#queuing.addedEnoughAlbums",
                          },
                          { target: "addingAlbum" },
                        ],
                      },
                      addingAlbum: {
                        invoke: {
                          src: "appendNewAlbum",
                          onDone: {
                            target: "idle",
                            actions: "saveAlbumToQueue",
                          },
                          onError: "idle",
                        },
                      },
                    },
                  },
                  addedEnoughAlbums: {
                    on: {
                      RESET: {
                        target: "#root.playRandomAlbum",
                        actions: "resetState",
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
      playRandomAlbum: async ({ libraryAlbums, queuedAlbums }) => {
        const randomAlbum = getRandomAlbum(libraryAlbums, queuedAlbums);

        await startQueueFromAlbum(randomAlbum);

        return randomAlbum;
      },
      appendNewAlbum: async ({ libraryAlbums, queuedAlbums }) => {
        const randomAlbum = getRandomAlbum(libraryAlbums, queuedAlbums);

        await appendAlbumToQueue(randomAlbum);

        return randomAlbum;
      },
    },
    actions: {
      resetState: assign((ctx) => {
        ctx.queuedAlbums = [];
      }),
      saveAlbumToQueue: assign((ctx, e) => {
        ctx.queuedAlbums.push(e.data);
      }),
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
        ctx.libraryAlbums = e.data.albums;
      }),
      startOAuthFlow: () => {
        window.location.href = "http://localhost:8888/api/login";
      },
    },
    guards: {
      minimumQueueDurationReached: (ctx) => {
        const queueDuration = ctx.queuedAlbums.reduce(
          (acc, album) => acc + getAlbumLengthMs(album),
          0
        );

        return queueDuration >= ctx.targetQueueDurationMs;
      },
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

const AppMachine = createXStateTreeMachine(machine, {
  selectors({ ctx, inState }) {
    return {
      loading:
        inState("authenticated.onRoot.gettingInitialData") ||
        !inState("authenticated.onRoot"),
      completed: inState(
        "authenticated.onRoot.queuingUpAlbums.addedEnoughAlbums"
      ),
      queue: ctx.queuedAlbums,
      queueTarget: ctx.targetQueueDurationMs,
    };
  },
  actions({ send }) {
    return {
      startNewQueue() {
        send({ type: "RESET" });
      },
    };
  },
  View: function App({ selectors, actions }) {
    return (
      <Container>
        <Row>
          {selectors.loading ? (
            <Loading />
          ) : (
            <Container>
              <Row>
                Queue target duration: {humanizer(selectors.queueTarget)}
              </Row>
              <Row>Queue length: {selectors.queue.length} albums</Row>
              <Row>
                Queue duration:{" "}
                {humanizer(
                  selectors.queue.reduce(
                    (acc, album) => acc + getAlbumLengthMs(album),
                    0
                  )
                )}
              </Row>
              {selectors.completed && (
                <Row>
                  <button onClick={actions.startNewQueue}>
                    Start new queue
                  </button>
                </Row>
              )}
            </Container>
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
