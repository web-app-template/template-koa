import type Koa from "koa";
import * as fs from "node:fs";
import * as path from "node:path";
import Router from "@koa/router";
import { fileURLToPath } from "url";

/**
 * Dynamic loading of all route-related files in the 'routes' folder.
 * @param app
 */
export default function importRoute(app: Koa<Koa.DefaultState, Koa.DefaultContext>): void {
  // Get the names of all files that define routes.
  const files = fs.readdirSync(path.dirname(fileURLToPath(import.meta.url)));
  const regex = /.*\.js$/;
  const routeFileNames = files.filter((file) => regex.test(file) && file !== "index.js");

  // Dynamic loading of routes defined in files based on their filenames.
  routeFileNames.forEach(async (fileName) => {
    const route = (await import(`./${fileName}`)).default as Router;
    app.use(route.routes()).use(route.allowedMethods());
  });
}
