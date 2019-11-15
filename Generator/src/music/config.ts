export let path: string;
// @ts-ignore
if (PRODUCTION) {
  path = "mcp-osc.miguel-franken.com:8000";
} else {
  path = "localhost:8000";
}
