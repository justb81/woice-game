// Client-only static PWA: prerender the shell to a static file, but never SSR.
// adapter-static emits a prerendered shell that hydrates and then runs entirely
// in the browser. Flip `ssr` on here if you later add server-rendered routes.
export const prerender = true;
export const ssr = false;
