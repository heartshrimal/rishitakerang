export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/order/"],
      },
    ],
    sitemap: "https://rishitakerang.in/sitemap.xml",
  };
}
