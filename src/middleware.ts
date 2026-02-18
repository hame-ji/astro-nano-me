import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;
  const lang =
    pathname.includes("/fr/") || pathname.endsWith("/fr") ? "fr" : "en";
  context.locals.lang = lang;

  if (pathname.length > 1 && pathname.endsWith("/")) {
    const target = new URL(context.url);
    target.pathname = pathname.slice(0, -1);
    target.search = search;
    return context.redirect(target.toString(), 308);
  }

  return next();
});
