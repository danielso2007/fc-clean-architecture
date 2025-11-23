import "../../startup";
import { app } from "./express";
import dotenv from "dotenv";
import { appEvents } from "../../events";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server is listening on port ${port}`);
  appEvents.emit("app:started");
});
