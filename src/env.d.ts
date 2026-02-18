/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Locals = {
  lang: "en" | "fr";
};

declare namespace App {
  interface Locals extends Locals {}
}
