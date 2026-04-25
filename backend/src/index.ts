import { createApp } from "./app.js";
import { getShareStorageMode } from "./db/pool.js";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`Biodata backend listening on port ${port}`);
  console.log(`Share storage mode: ${getShareStorageMode()}`);
});
