import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gridwatch.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/network", "/schedules", "/contact"],
        disallow: ["/admin/", "/provider/", "/dashboard/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
