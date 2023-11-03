
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]": { type: "done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]": { type: "done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.app.authenticated.onRoot.queuingUpAlbums.addingAlbumsToQueue.addingAlbum:invocation[0]": { type: "done.invoke.app.authenticated.onRoot.queuingUpAlbums.addingAlbumsToQueue.addingAlbum:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.auth-slot": { type: "done.invoke.auth-slot"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.auth-slot": { type: "error.platform.auth-slot"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "appendNewAlbum": "done.invoke.app.authenticated.onRoot.queuingUpAlbums.addingAlbumsToQueue.addingAlbum:invocation[0]";
"auth": "done.invoke.auth-slot";
"getInitialData": "done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]";
"playRandomAlbum": "done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "redirectToRoot": "AUTHENTICATED";
"resetState": "RESET";
"saveAlbumToQueue": "done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]" | "done.invoke.app.authenticated.onRoot.queuingUpAlbums.addingAlbumsToQueue.addingAlbum:invocation[0]";
"saveInitialData": "done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]";
"startOAuthFlow": "GO_TO_ROOT";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "minimumQueueDurationReached": "";
        };
        eventsCausingServices: {
          "appendNewAlbum": "";
"auth": "xstate.init";
"getInitialData": "GO_TO_ROOT";
"playRandomAlbum": "RESET" | "done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]";
        };
        matchesStates: "authenticated" | "authenticated.onRoot" | "authenticated.onRoot.gettingInitialData" | "authenticated.onRoot.playRandomAlbum" | "authenticated.onRoot.queuingUpAlbums" | "authenticated.onRoot.queuingUpAlbums.addedEnoughAlbums" | "authenticated.onRoot.queuingUpAlbums.addingAlbumsToQueue" | "authenticated.onRoot.queuingUpAlbums.addingAlbumsToQueue.addingAlbum" | "authenticated.onRoot.queuingUpAlbums.addingAlbumsToQueue.idle" | "authenticated.redirecting" | "unAuthed" | { "authenticated"?: "onRoot" | "redirecting" | { "onRoot"?: "gettingInitialData" | "playRandomAlbum" | "queuingUpAlbums" | { "queuingUpAlbums"?: "addedEnoughAlbums" | "addingAlbumsToQueue" | { "addingAlbumsToQueue"?: "addingAlbum" | "idle"; }; }; }; };
        tags: never;
      }
  