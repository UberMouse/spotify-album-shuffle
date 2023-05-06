import { XstateTreeHistory, buildCreateRoute } from "@koordinates/xstate-tree";
import { createBrowserHistory } from "history";

import { SpotifyTokenSchema } from "./types";

export const history: XstateTreeHistory = createBrowserHistory();

const createRoute = buildCreateRoute(() => history, "/");

export const root = createRoute.simpleRoute()({
  event: "GO_TO_ROOT",
  url: "/",
});
export const authorize = createRoute.simpleRoute()({
  event: "GO_TO_AUTHORIZE",
  url: "/authorize",
  querySchema: SpotifyTokenSchema,
});

export const routes = [root, authorize];
