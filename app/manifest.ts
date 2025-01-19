import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Talkify",
    short_name: "Talkify",
    description: "A PWA chat application",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "hsl(216 34% 17%)",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
