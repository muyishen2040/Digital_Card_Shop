/** The private token is a bearer credential. Never add it to analytics or auto-share. */
export function cardShareData(link: string): { title: string; text: string; url: string } {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    throw new Error("Invalid recipient link.");
  }
  if (!/^\/c\/[A-Za-z0-9_-]{43}$/.test(url.pathname)
      || !!url.search || !!url.hash || !!url.username || !!url.password
      || !(url.protocol === "https:" || (url.protocol === "http:" && url.hostname === "localhost"))) {
    throw new Error("Only private HTTPS card links may be shared.");
  }
  return {
    title: "A little moment for you",
    text: "Someone made a little moment just for you.",
    url: url.href,
  };
}
