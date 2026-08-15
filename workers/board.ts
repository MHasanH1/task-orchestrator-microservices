import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { taskQueue } from "../lib/queue";

const app = express();
const port = process.env.BOARD_PORT || 3001;

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(taskQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.get("/", (_, res) => {
  res.redirect("/admin/queues");
});

app.listen(port, () => {
  console.log(
    `[Bull-Board] Queue Monitoring UI running at http://localhost:${port}/admin/queues`,
  );
});
