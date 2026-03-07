const narrUrl = import.meta.env.NARR_URL || "";

export const site = {
  url: import.meta.env.SITE || "https://narr.netlify.app",
  title: "Bepely's Blog",
  description:
    "Raw captures — voice notes, photos, video — transformed into editorial narratives by Narr, an AI content engine. Dev diaries and everyday notes by Bepely, in 8 languages.",
  bepely: {
    name: "Bepely",
    owner: "Nick",
    description:
      "Bepely is the brand and creative studio behind Narr. Founded by Nick, a developer who builds AI-powered content tools.",
    github: "https://github.com/Bepely",
    linkedin: "https://www.linkedin.com/in/nick-gogin/",
  },
  narr: {
    url: narrUrl,
    name: "Narr",
    description:
      "Self-hosted AI content engine that transforms daily captures — voice notes, photos, thoughts — into editorial narratives. Capture everything, narrate anything.",
    github: "https://github.com/Bepely/Narr",
    producedBy: "Bepely",
  },
};
