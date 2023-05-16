import type Koa from "koa";
import * as fs from "node:fs";
import * as path from "node:path";
import Router from "@koa/router";
import { fileURLToPath } from "url";

/**
 * 动态加载 routes 文件夹下的所有路由相关文件
 * @param app
 */
export default function importRoute(app: Koa<Koa.DefaultState, Koa.DefaultContext>): void {
  // 获取所有定义路由的文件名
  const files = fs.readdirSync(path.dirname(fileURLToPath(import.meta.url)));
  const regex = /.*\.js$/;
  const routeFileNames = files.filter((file) => regex.test(file) && file !== "index.js");

  // 通过文件名动态加载文件中定义的路由
  routeFileNames.forEach(async (fileName) => {
    const route = (await import(`./${fileName}`)).default as Router;
    app.use(route.routes()).use(route.allowedMethods());
  });
}
