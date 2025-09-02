import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "hame-ji",
  EMAIL: "contact@ram4.addy.io",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Accueil",
  DESCRIPTION: "Blog et portfolio de hame-ji.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Des articles sur ce qui m'intéresse autour du dev et du web.",
};

export const WORK: Metadata = {
  TITLE: "Expériences",
  DESCRIPTION: "Où j'ai travaillé et ce que j'y ai fait.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projets",
  DESCRIPTION: "Mes expérimentations et mes projets en cours.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/hame-ji",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/jonashamard/",
  },
];
