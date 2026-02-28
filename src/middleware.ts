import { defineMiddleware } from "astro:middleware";
import { getLangFromUrl } from "@i18n/utils";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;
  const lang = getLangFromUrl(context.url);
  context.locals.lang = lang;

  if (pathname.length > 1 && pathname.endsWith("/")) {
    const target = new URL(context.url);
    target.pathname = pathname.slice(0, -1);
    target.search = search;
    return context.redirect(target.toString(), 308);
  }

  return next();
});
