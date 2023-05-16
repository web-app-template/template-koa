import "module-alias/register.js";
import Koa from "koa";
import * as dotenv from "dotenv";

dotenv.config();

import middleware from "./middlewares/index.js";
import route from "./routes/index.js";

const app = new Koa();
middleware(app);
route(app);

app.listen(8000, () => {
  console.log("server on 8000");
});
