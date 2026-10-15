# TrustedMeds platform

## GitHub Pages deployment

This repository is **ozylixcare/demotrustmed-github.io**. Only this repository is used by the deployment workflow.

- Store: https://ozylixcare.github.io/demotrustmed-github.io/
- Admin: https://ozylixcare.github.io/demotrustmed-github.io/admin.html
- Demo ID: `demo@trustedmeds.local`
- Demo password: `TrustedMeds@2026`

Enable **Settings → Pages → Build and deployment → Source → GitHub Actions** once. The included **Publish TrustedMeds demo** workflow verifies the full source and deploys only `dist/`. If the first run happened before Pages was enabled, rerun that workflow from Actions.

GitHub Pages serves the browser-local demonstration. Admin edits appear in store tabs in the same browser. Data is isolated under `demotrustmed-` storage keys. This public demo login does not protect private business data. Node server code is included under `backend/`, but GitHub Pages does not execute it. No database or Render service is connected by this deployment.

The repo name is a project repository, so its default Pages URL is under `ozylixcare.github.io/demotrustmed-github.io/`; it does not create a `demotrustmed.github.io` hostname.


A calm, light-blue pharmacy storefront with a connected admin workspace and a Node backend for demo commerce. This repository is the full source; `dist/` is the static preview.

## Open the demo

- Storefront: `/`
- Admin: `/admin.html` (Node also supports `/admin`)
- Demo ID: `demo@trustedmeds.local`
- Demo password: `TrustedMeds@2026`

The hosted static preview stores workspace changes in the same browser. Open the admin and storefront in tabs of the same browser to see changes. This static login is a demonstration, not a security boundary. The Node runtime replaces it with server authentication.

## Run the actual Node demo backend

Requires Node 22 or newer. No external dependencies are required.

```bash
npm start
```

Open `http://localhost:3000` and `http://localhost:3000/admin`. The app detects the same-origin API automatically. Run checks with `npm test`.

Local defaults are the demo credentials above. Environment variables:

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port; defaults to 3000; binds to `0.0.0.0` |
| `NODE_ENV` | Set to `production` on Render |
| `ADMIN_EMAIL` | Server admin ID |
| `ADMIN_PASSWORD` | Use a unique secret of at least 16 characters in production |
| `DEMO_MODE` | Keep `true`; live commerce is deliberately disabled |
| `DATA_DIR` | Writable directory for the demo JSON state and image uploads |

Production startup refuses missing admin credentials or a password shorter than 16 characters. Default demo credentials do not bypass a configured server password. Cookies are HttpOnly and SameSite Strict; production cookies also require HTTPS. Sessions expire after eight hours and are cleared by server restart. State-changing admin requests need a session and CSRF token. Cross-origin writes are rejected. Sign-in, order, event, and upload requests are rate-limited.

## Render handoff, later

The Node backend is prepared for a Render Node web service. Select this source repository, use Node 22+, an empty build command (there are no packages to build), and `npm start` as the start command. Set production admin credentials and `DEMO_MODE=true`. Health endpoint: `/api/health`.

**Render has not been provisioned or deployed in this task. No external database is connected.** Current persistence is a JSON demo store with atomic file replacement. Render's default filesystem is not durable across deploys: use a persistent disk only for a temporary hosted demo, or replace the demo persistence adapter with the planned database before real use. Do not treat the current file store as a production commerce database or run multiple replicas against separate files.

Do not enable real orders until verified catalogue and pharmacy details, customer authentication, the database, payments, fulfilment, consent, and pharmacist review are implemented and tested. A Google client ID field alone does not establish authentication. WhatsApp is a handoff link: users attach prescriptions themselves, and upload never means pharmacist approval.

## Workspace controls

- **Dashboard / Analytics:** selected-range demo revenue, order states, category performance, low-stock views; chart points expose values on hover/focus.
- **Live Visitors / Customer Behaviour:** observed demo sessions and events. Static preview covers only this browser; Node mode collects server events. No generated visitor counts.
- **Calendar:** add, edit, delete dated operations and campaign entries.
- **Orders / Returns:** manage demo order states; customers can request a return for a delivered demo order. Cancellation/refund restores stock once. Terminal states cannot be reopened from the UI. Refunds do not move money.
- **Products / Inventory:** create/edit/hide products, price/MRP, descriptions, images, pack size, category, prescription flag, stock. Hiding removes a listing; records referenced by orders are archived on delete. Prescription items are enquiry-only and rejected by the order API.
- **Discounts:** percentage or fixed coupons, minimum spend, expiry and active state; quote/order APIs calculate values from server data.
- **Customers:** demo customer records and consent flags. Real identity verification is not connected.
- **Marketing:** draft/schedule/paused campaign planning and CSV export; no provider delivery or background schedule execution.
- **Banners:** create, edit, show/hide, reorder and assign landscape hero, shop and promotional images.
- **Photo Library / Site Images:** image uploads and assignments to logos, products and banners. PNG/JPEG/WebP under 2 MB; server checks file signatures. Assigned images cannot be removed from the library until unassigned. Deleting an unassigned uploaded library record also removes its file from the Node upload directory; bundled source assets remain part of the source repository. Orphan files from abandoned form uploads can be cleared during storage-adapter setup.
- **Store Editor:** hero text, buttons, brand logo/colours, top strip, homepage visibility, section headings, about/contact copy, navigation and categories.
- **Settings:** shipping thresholds, contact fields and WhatsApp number. Infrastructure credentials remain server-side.
- **Activity log:** an audit trail of admin changes.

## Data and API

The shared model is `dist/store-core.js`. `dist/store.js` adapts it to browser-local preview or same-origin API. Runtime JSON files and uploads are ignored by Git.

| Route | Access | Purpose |
| --- | --- | --- |
| `GET /api/health` | Public | Demo/backend/storage status |
| `GET /api/store` | Public | Active catalogue and public content; excludes customer/order/admin records |
| `POST /api/quote` | Public demo | Canonical prices, coupons and shipping |
| `POST /api/orders` | Public, rate-limited demo | Creates a zero-charge demo order; validates stock and rejects Rx products |
| `GET /api/orders/:id` | Order receipt token | Status of the holder's own demo order |
| `POST /api/returns` | Order receipt token | Delivered demo order return enquiry |
| `POST /api/events` | Public, rate limited | Anonymous demo interactions; query strings removed |
| `POST /api/admin/login` | Credentials | Server session |
| `GET /api/admin/session` | Session | CSRF token for signed-in admin |
| `POST /api/admin/logout` | Session + CSRF | Revoke session |
| `GET /api/admin/state` | Session | Full workspace |
| `PUT /api/admin/state` | Session + CSRF | Validated optimistic versioned save |
| `POST /api/admin/upload` | Session + CSRF | Validated image upload |

The UI refuses stale workspace writes rather than overwriting newer orders or events. Refresh and reapply when it reports a conflict.

## Verification

The test suite covers API access control, CSRF, public-data separation, canonical pricing, coupons, quantity limits, stock, Rx restrictions, catalogue edits, receipt access, demo returns, image validation, admin screen rendering, HTML escaping, and idempotent stock restoration. Node VM checks cover rendering and logic; they do not replace a real browser layout test. Browser/device visual QA was unavailable in this environment.

## Artwork

See `ASSETS.md` for the generated logo-background edit, landscape artwork paths, and prompts. Banners remain landscape on desktop, tablet and mobile; they are not changed to portrait. Sample product artwork is illustrative.

## Colour and depth update

The desktop mobile-overlay element now sits outside the two-column admin grid, fixing the squeezed workspace shown in the recording. Added a bright blue welcome panel, blue/teal/violet/coral metric cards, layered shadows and optional pointer tilt. Area and 3D bar charts switch between demo revenue and order counts. Chart points open day-filtered orders; status segments and legends open status-filtered orders in the selected date range. Values appear on pointer hover and keyboard focus. Reduced-motion preferences disable card tilt.

Storefront category cards, product cards, buttons and sections now use coordinated colour and depth. Hero banners retain landscape proportions. Existing commerce and admin data controls are preserved.

## Pharmacy shop and comparison portal

The current demo has 20 catalogue products, including eight medicine/sample packs. Open `/` then use:

- `#/medicines`: search medicine, ingredient or brand; filter Rx/OTC and availability; sort by pack price or unit price.
- `#/compare`: exact listed-metadata comparisons, normalised by units per pack; related but different strengths/formulations are shown separately.
- `#/offers`: admin-managed promotions and demo coupon entry points.
- `#/prescription`: sample-document upload and team review request.
- `#/my-care`: customer receipt tracking, quotation review and acceptance, and consultation request tracking.
- `#/consult`: admin-managed consultation services and preferred-slot requests. No actual consultation is provided.

The header contains a departments dropdown and a mobile hamburger navigation. Banner artwork remains landscape on phones.

### Brand data vs demo prices

Crocin Advance 500 uses paracetamol 500 mg with OPTIZORB formulation (manufacturer source: https://www.crocin.com/crocin-products-for-adult/crocin-advance-tablets/). Pantop 40 contains pantoprazole 40 mg in a gastro-resistant tablet (https://www.aristopharma.co.in/product/pantop-40-40mg/). Telvas-H is listed with telmisartan 40 mg and hydrochlorothiazide 12.5 mg in an uncoated bi-layered tablet (https://www.aristopharma.co.in/product/740/).

These names and composition details ground sample catalogue records only. **Every price, discount, pack quote, stock level, consultation fee, fictional generic-demo supplier and comparison saving is illustrative.** Generic-demo records are not verified products. Generated pictures are demonstration packaging, not authentic brand packshots. This is a finite sample catalogue, not an exhaustive index of every medicine or brand.

Comparison matching requires ingredient, strength, dosage form, release type, route and formulation descriptor. Unit prices are pack price divided by pack units. Only matching records with available sample stock can receive the “lowest demo unit price” label. Crocin's OPTIZORB record and a conventional paracetamol record are separated. The matching label is not evidence of clinical interchangeability, bioequivalence or a recommendation to substitute a prescription.

### Prescription review and quotation workflow

1. Customer submits an authorised sample PNG/JPG/PDF, alias and notes. Maximum 2 MB. Use sample documents only.
2. Admin opens **Prescriptions & quotes** and records prescriber, date/validity, legibility, suitability, reviewer and manual authenticity-review outcome. This is a human workflow; software does not determine that a prescription is real or fake.
3. Team can request clarification or reject. Approval and quotation require a completed review record. A quotation includes product IDs, pack quantities, negotiated pack prices, customer note and expiry.
4. The customer opens **My Care**, refreshes status and accepts a quotation. The backend checks expiry, approval and current stock. Acceptance creates one zero-charge demo order and decrements stock once. Prescription products remain blocked from ordinary basket checkout.
5. Existing order cancellation/refund workflows apply to demo quote orders, with one-time stock restoration.

Node stores prescription files in the private `DATA_DIR/prescriptions` directory. The public store response never includes prescription or consultation requests. Access to a request/document requires an admin session or its customer receipt token. PDF responses download as attachments; images can be previewed by the reviewer. No malware scanning, OCR verification, prescriber-registry integration, real clinical review or production retention workflow is implemented. The browser-local preview persists authorised sample documents in this browser's demo workspace so they can be reviewed in the admin tab; this is not appropriate for patient records.

Additional Node routes:

| Route | Access | Result |
| --- | --- | --- |
| `POST /api/prescriptions` | Rate-limited demo submission | Validated sample file and private receipt |
| `GET /api/prescriptions/:id` | Admin or receipt token | Status and customer-facing quotation |
| `GET /api/prescriptions/:id/document` | Admin or receipt token | Private sample file |
| `POST /api/prescriptions/:id/accept` | Customer receipt token | Validate reviewed quote; create one demo order |
| `POST /api/appointments` | Rate-limited demo submission | Consultation request and receipt |
| `GET /api/appointments/:id` | Receipt token | Request status, assignment and team note |

### Consultation requests

The team manages service names, descriptions, fees, languages, duration, image and visibility in **Doctor services**. Customer requests include a preferred date/time in India time and a demo alias. **Consultation requests** lets the team assign a demo clinician, confirm or cancel the request and add meeting instructions. No real doctor profiles, credentials, payments, video calls, diagnoses or prescriptions are fabricated. Use of a generated clinician illustration does not identify or endorse a real practitioner.

The new screens, catalogue fields, matching metadata, offers, service content, sections and navigation are editable in admin. Infrastructure, production integrations and regulated clinical decisions still require the later deployment and operating setup; this demo does not claim 100% production readiness.
