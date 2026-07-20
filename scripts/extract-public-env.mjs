const SITE = process.env.PUBLIC_SITE_URL || "https://www.juzlegal.com";

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

export async function extractPublicEnv(site = SITE) {
  const html = await fetchText(site);
  const scriptPaths = [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/[^"']+\.js/g)].map((m) => m[0])
    ),
  ];

  let supabaseUrl = "";
  let anonKey = "";
  let adminEmail = "";

  for (const path of scriptPaths.slice(0, 40)) {
    const js = await fetchText(new URL(path, site).toString());
    if (!supabaseUrl) {
      const urlMatch = js.match(/https:\/\/[a-z0-9]+\.supabase\.co/);
      if (urlMatch) supabaseUrl = urlMatch[0];
    }
    if (!anonKey) {
      const keyMatch = js.match(
        /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/
      );
      if (keyMatch) anonKey = keyMatch[0];
    }
    if (!adminEmail) {
      const adminMatch = js.match(
        /NEXT_PUBLIC_ADMIN_EMAIL["']?\s*[:=]\s*["']([^"']+@[^"']+)["']/
      );
      if (adminMatch) adminEmail = adminMatch[1];
    }
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_SITE_URL: site.replace(/\/$/, ""),
    NEXT_PUBLIC_ADMIN_EMAIL: adminEmail,
    ADMIN_EMAIL: adminEmail,
  };
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  const data = await extractPublicEnv();
  console.log(JSON.stringify(data, null, 2));
}
