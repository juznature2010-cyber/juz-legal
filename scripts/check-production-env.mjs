const html = await fetch("https://www.juzlegal.com/dang-nhap").then((r) => r.text());
const urls = [...html.matchAll(/\/_next\/static\/[^"']+\.js/g)].map((m) => m[0]);
let found = false;
for (const u of urls) {
  const js = await fetch(`https://www.juzlegal.com${u}`).then((r) => r.text());
  if (js.includes(".supabase.co") || js.includes("sb_publishable")) {
    console.log("[OK] Supabase config found in:", u);
    found = true;
  }
}
console.log(found ? "[OK] Production build has Supabase env" : "[LOI] Supabase env NOT in client bundle");
