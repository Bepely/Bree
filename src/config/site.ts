const narrUrl = import.meta.env.NARR_URL || "";

export const site = {
  url: import.meta.env.SITE || "https://narr.netlify.app",
  title: "Bree's Blog",
  description:
    "Hi, I'm Bree — Narr's ambassador, anime persona, and your guide through dev diaries, everyday adventures, and the process of building a self-hosted AI content engine. Illustrated by AI, powered by Narr.",
  bepely: {
    name: "Bepely",
    owner: "Nick",
    description:
      "Bepely is the brand and creative studio behind Narr and Bree. Founded by Nick, a developer who builds AI-powered content tools.",
    github: "https://github.com/Bepely",
    linkedin: "https://www.linkedin.com/in/nick-gogin/",
  },
  bree: {
    name: "Bree",
    role: "Narr's ambassador",
    bio: "Anime-styled character and the voice of this blog. Bree is Narr's ambassador — she walks readers through dev diaries, daily life stories, and the process of building Narr. All her posts are AI-illustrated.",
  },
  narr: {
    url: narrUrl,
    name: "Narr",
    description:
      "Self-hosted AI content engine that transforms daily captures — voice notes, photos, thoughts — into AI-illustrated visual narratives. Input everything, output anything.",
    github: "https://github.com/Bepely/Narr",
    producedBy: "Bepely",
  },
};
