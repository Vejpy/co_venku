import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://co-venku.vercel.app/",
      lastModified: new Date(),
    },
    {
      url: "https://co-venku.vercel.app/Login_Register",
      lastModified: new Date(),
    },
    {
      url: "https://co-venku.vercel.app/Contact",
      lastModified: new Date(),
    },
    {
      url: "https://co-venku.vercel.app/Analytics",
      lastModified: new Date(),
    },
  ];
}
