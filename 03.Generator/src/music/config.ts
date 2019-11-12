export let path: string;
// @ts-ignore
if (PRODUCTION) {
  path = "mcp.miguel-franken.com:8080";
} else {
  path = "localhost:8080";
}
