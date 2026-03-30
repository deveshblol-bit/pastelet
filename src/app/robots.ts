import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/p/", "/raw/"] },
    sitemap: "https://pastelet.vercel.app/sitemap.xml",
  };
}
