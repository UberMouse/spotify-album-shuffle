import { RoutingEvent, broadcast } from "@koordinates/xstate-tree";
import { assign } from "@xstate/immer";
import { createMachine } from "xstate";

import { authorize } from "./routes";
import { SpotifyToken } from "./types";
import { assertIsDefined } from "./utils";

declare global {
  interface XstateTreeEvents {
    AUTHENTICATED: string;
  }
}
type Events = RoutingEvent<typeof authorize>;
type Context = {
  token?: SpotifyToken;
};

let token: SpotifyToken | undefined;
export function getToken() {
  assertIsDefined(token);

  return token;
}

export const authMachine = createMachine(
  {
    predictableActionArguments: true,
    id: "auth",
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {
        refreshToken: {
          data: {} as SpotifyToken,
        },
      },
    },
    tsTypes: {} as import("./auth.typegen").Typegen0,
    context: {},
    initial: "authorizing",
    states: {
      authorizing: {
        on: {
          GO_TO_AUTHORIZE: {
            target: "authenticated",
            actions: ["setToken", "notifyAuthenticated"],
          },
        },
      },
      authenticated: {
        initial: "idle",
        states: {
          idle: {
            after: {
              refreshDelay: "refreshing",
            },
          },
          refreshing: {
            invoke: {
              src: "refreshToken",
              onDone: {
                target: "idle",
                actions: "setToken",
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      setToken: assign((ctx, e) => {
        const t = "query" in e ? e.query : e.data;

        ctx.token = t;
        token = t;
      }),
      notifyAuthenticated: () => broadcast({ type: "AUTHENTICATED" }),
    },
    services: {
      refreshToken: async (ctx) => {
        assertIsDefined(ctx.token);

        const response = await fetch(
          `http://localhost:8888/api/refresh?refresh_token=${ctx.token.refresh_token}`
        );

        return response.json();
      },
    },
    delays: {
      refreshDelay: (ctx) => {
        assertIsDefined(ctx.token);

        // Refresh 10 minutes before expiration
        return parseInt(ctx.token.expires_in, 10) * 1000 - 600 * 1000;
      },
    },
  }
);
