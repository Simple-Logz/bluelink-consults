# BlueLink Consult Activated Website

This version makes the site functional and less static.

## Included
- React Router multi-page routing
- Working dropdown menus and submenus
- Service detail pages
- Insights/resource pages
- Solutions page
- About page
- Contact page with success state
- Client login placeholder page
- Page transitions using Framer Motion
- Mobile dropdown navigation

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Bluehost deployment
Upload everything inside `dist` to `public_html`.

## React Router fix for Bluehost
Create `.htaccess` inside `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Make the form real
Connect the contact form to Formspree, Netlify Forms, HubSpot, FastAPI, or Node/Express.
