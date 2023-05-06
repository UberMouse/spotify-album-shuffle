
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]": { type: "done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.app.authenticated.onRoot.monitoringQueue.appendNewAlbum:invocation[0]": { type: "done.invoke.app.authenticated.onRoot.monitoringQueue.appendNewAlbum:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.app.authenticated.onRoot.monitoringQueue.fetchCurrentlyPlaying:invocation[0]": { type: "done.invoke.app.authenticated.onRoot.monitoringQueue.fetchCurrentlyPlaying:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]": { type: "done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.auth-slot": { type: "done.invoke.auth-slot"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.auth-slot": { type: "error.platform.auth-slot"; data: unknown };
"xstate.after(queueCheckDelay)#app.authenticated.onRoot.monitoringQueue.waiting": { type: "xstate.after(queueCheckDelay)#app.authenticated.onRoot.monitoringQueue.waiting" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "appendNewAlbum": "done.invoke.app.authenticated.onRoot.monitoringQueue.appendNewAlbum:invocation[0]";
"auth": "done.invoke.auth-slot";
"fetchCurrentlyPlaying": "done.invoke.app.authenticated.onRoot.monitoringQueue.fetchCurrentlyPlaying:invocation[0]";
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
"saveInitialData": "done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]";
"saveLastTrack": "done.invoke.app.authenticated.onRoot.monitoringQueue.appendNewAlbum:invocation[0]" | "done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]";
"saveQueue": "done.invoke.app.authenticated.onRoot.monitoringQueue.fetchCurrentlyPlaying:invocation[0]";
"startOAuthFlow": "GO_TO_ROOT";
        };
        eventsCausingDelays: {
          "queueCheckDelay": "";
        };
        eventsCausingGuards: {
          "currentlyPlayingIsLastAddedTrack": "";
        };
        eventsCausingServices: {
          "appendNewAlbum": "";
"auth": "xstate.init";
"fetchCurrentlyPlaying": "done.invoke.app.authenticated.onRoot.monitoringQueue.appendNewAlbum:invocation[0]" | "done.invoke.app.authenticated.onRoot.playRandomAlbum:invocation[0]" | "xstate.after(queueCheckDelay)#app.authenticated.onRoot.monitoringQueue.waiting";
"getInitialData": "GO_TO_ROOT";
"playRandomAlbum": "done.invoke.app.authenticated.onRoot.gettingInitialData:invocation[0]";
        };
        matchesStates: "authenticated" | "authenticated.onRoot" | "authenticated.onRoot.gettingInitialData" | "authenticated.onRoot.monitoringQueue" | "authenticated.onRoot.monitoringQueue.appendNewAlbum" | "authenticated.onRoot.monitoringQueue.determining" | "authenticated.onRoot.monitoringQueue.fetchCurrentlyPlaying" | "authenticated.onRoot.monitoringQueue.waiting" | "authenticated.onRoot.playRandomAlbum" | "authenticated.redirecting" | "unAuthed" | { "authenticated"?: "onRoot" | "redirecting" | { "onRoot"?: "gettingInitialData" | "monitoringQueue" | "playRandomAlbum" | { "monitoringQueue"?: "appendNewAlbum" | "determining" | "fetchCurrentlyPlaying" | "waiting"; }; }; };
        tags: never;
      }
  