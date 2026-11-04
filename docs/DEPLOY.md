# Deploying dctshirtfactory.co.in

The live site is served by **Apache on the Amazon server at 43.205.212.75**, not by Vercel.
Vercel (dctshirtfactory.vercel.app) is only a preview copy. Apache ignores `vercel.json`, so
the same rules live in `public/.htaccess`, which `npm run build` copies into `dist/`.

The first upload (4 Nov 2026) went without `.htaccess`: all 7 `/clothing/<slug>` pages answered 404,
`/clothing` answered 403, old links (`/products/…`, `/quote`, `/clients`) answered 404, and nothing was compressed.

## 1. Build

Build only from branch `redesign/cinematic`. `main` is the old site.

- [ ] `git checkout redesign/cinematic && git pull`
- [ ] Node 18 or newer. No `npm install` needed
- [ ] `site.indexable` in `src/data.mjs` is `true` (`false` puts noindex on every page)
- [ ] `npm run build` ends with "✔ Content check passed". Don't upload a failed build
- [ ] `npm run lint` and `npm test` pass
- [ ] `dist/.htaccess` exists (hidden file: `ls -a dist`)
- [ ] Upload the contents of `dist/` only

## 2. Upload to the server

**One-time server setup**

- [ ] In `/etc/httpd/conf/httpd.conf`, inside `<Directory "/var/www/html">`, set `AllowOverride All`
- [ ] `httpd -M | grep -E "rewrite|headers|deflate"` shows all three modules
- [ ] Remove hand-written rewrite rules for this site from the virtual-host config (the first setup sent `/fabrics.html` to `/fabrics/`; that fights `.htaccess`)
- [ ] `sudo apachectl configtest` says "Syntax OK", then `sudo systemctl reload httpd`

**Every release**

1. Back up: `sudo cp -a /var/www/html /var/www/html.bak-$(date +%F)`
2. Upload, removing old files: `rsync -av --delete dist/ user@43.205.212.75:/var/www/html/` (by FTP or a file manager instead: empty the web root, upload everything inside `dist/`, show hidden files so `.htaccess` goes up)
3. `sudo chown -R apache:apache /var/www/html`
4. Run the checks in section 4

Preview first if you like: `npx vercel deploy --prod --yes` updates dctshirtfactory.vercel.app only (sent `X-Robots-Tag: noindex`).

## 3. Domain and HTTPS

| Item | Should be |
| --- | --- |
| `dctshirtfactory.co.in` A record | 43.205.212.75 (attach an Elastic IP so it never changes) |
| `www.dctshirtfactory.co.in` | Same server; `.htaccess` redirects it to the non-www address |
| Certificate | Let's Encrypt for both names, valid to 7 Jan 2027; `sudo certbot renew --dry-run` must succeed |
| Old site links | `/products/…` → `/clothing/…`, `/quote` → `/contact`, `/clients` → `/work` (in `.htaccess`) |

## 4. After deploying

A release is done only when `npm run check:live` ends with "✔ All checks passed". It checks every page at
its clean URL (canonical, no noindex), the redirects, the site's own 404 page, assets, compression and caching.
`npm run check:live -- https://dctshirtfactory.vercel.app` checks the preview copy.

Then by hand, on a phone and a laptop: the home animation and garment ring, every category page, the fabric filters,
the WhatsApp buttons and quote form, the Ask assistant, and the WhatsApp link preview.

Once, after the first good release: add the domain to Google Search Console, submit
`https://dctshirtfactory.co.in/sitemap.xml`, request indexing for the category pages, and set the website in Google Business Profile.

## 5. Roll back

1. `sudo mv /var/www/html /var/www/html.broken && sudo mv /var/www/html.bak-YYYY-MM-DD /var/www/html`
2. If you changed the Apache config, put it back, then `sudo apachectl configtest && sudo systemctl reload httpd`
3. `npm run check:live` to confirm
4. Send the failing check output to Vedora Labs before trying again
