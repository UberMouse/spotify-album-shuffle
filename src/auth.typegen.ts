
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.auth.authenticated.refreshing:invocation[0]": { type: "done.invoke.auth.authenticated.refreshing:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.after(refreshDelay)#auth.authenticated.idle": { type: "xstate.after(refreshDelay)#auth.authenticated.idle" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "refreshToken": "done.invoke.auth.authenticated.refreshing:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "notifyAuthenticated": "GO_TO_AUTHORIZE";
"setToken": "GO_TO_AUTHORIZE" | "done.invoke.auth.authenticated.refreshing:invocation[0]";
        };
        eventsCausingDelays: {
          "refreshDelay": "GO_TO_AUTHORIZE" | "done.invoke.auth.authenticated.refreshing:invocation[0]";
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "refreshToken": "xstate.after(refreshDelay)#auth.authenticated.idle";
        };
        matchesStates: "authenticated" | "authenticated.idle" | "authenticated.refreshing" | "authorizing" | { "authenticated"?: "idle" | "refreshing"; };
        tags: never;
      }
  