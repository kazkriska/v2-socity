import { getSocietiesAction } from "./src/app/actions.ts";

async function test() {
  const s = await getSocietiesAction();
  console.log("Societies:", s);
}
test();
