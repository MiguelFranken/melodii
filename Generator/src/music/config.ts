export let path: string;
// @ts-ignore
if (MASTER) {
  path = "mcp.miguel-franken.com:8000";
  // @ts-ignore
} else if (DEV) {
  path = "mcp-dev.miguel-franken.com:8000";
} else {
  path = "localhost:8000";
}
