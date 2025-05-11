import express from "express";
// import session from "express-session";
// import bodyParser from "body-parser";
import pg from "pg";
const { Pool } = pg;

import products from "./routes/products.js";

const pool = new Pool({
  user: "postgres",
  password: "p4ssw0rd",
  database: "pmboard",
  host: "localhost",
  port: 5432,
  // max: 50, // 10 is default
  // idleTimeoutMillis: 10000, // 10000 is default
  // connectionTimeoutMillis: 2000, // 0 (no timeout!) is default
});
pool.on("error", (err) => {
  console.error("pg pool error: ", err);
  process.exit();
});

const app = express();

app.use(async (req, res, next) => {
  try {
    req.pool = pool;
    next();
  } catch (err) {
    console.error(err);
    console.error("TotalCount", pool.totalCount);
    console.error("IdleCount", pool.idleCount);
    console.error("WaitingCount", pool.waitingCount);
    console.error("So, restarting server...");
    process.exit();
  }
});

app.use("/", express.static("public/dist"));
app.use("/node_modules", express.static("public/node_modules"));
app.use(express.json());

app.use("/products", products);

/* Error Handlers */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
app.use(function (err, req, res, next) {
  return res.status(err.status || 500).json({
    message: err.message,
    error: err,
  });
});
// }

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Listening on ", port);
});

// production error handler
// no stacktraces leaked to user
/*
app.use(function(err, req, res, next) {
  return res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});
*/

export default app;
