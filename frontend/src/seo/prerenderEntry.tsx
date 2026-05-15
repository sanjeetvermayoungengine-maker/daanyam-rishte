/**
 * Entry point used by scripts/prerender.mjs to server-render content routes.
 *
 * IMPORTANT: this file must only import standalone content components.
 * It must NOT pull in App.tsx, AuthProvider, the Redux store, or any module
 * that touches `window`, `document`, or `import.meta.env.VITE_API_URL` at
 * import time — those will throw in a Node environment.
 */

import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { ContentRoutes } from "./ContentRoutes";

export function renderContentRoute(pathname: string): string {
  return renderToString(
    React.createElement(
      StaticRouter,
      { location: pathname },
      React.createElement(ContentRoutes, null)
    )
  );
}
