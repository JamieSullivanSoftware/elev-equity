import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import vercel from "@astrojs/vercel/serverless";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), compress()],
  output: "server",
  adapter: vercel()
});
