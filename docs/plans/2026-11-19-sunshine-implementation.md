# A Little Sunshine — implementation and polish plan

**Updated:** 2026-11-19  
**Scope:** PR #2 recipient-first prototype only; no backend, orders, database, mock shop, or sender form.

1. **Personalization contract:** Keep typed card props, safe name/message normalization, line breaks and unit tests; the backend can supply content to these props later.
2. **Full-screen card:** Make the envelope itself a native click/tap/keyboard button. Stage a gentle hover affordance, flap motion, rising note and calm reading state. Use an accessible, unobtrusive replay control. Support long content and reduced motion.
3. **Minimal launcher:** Replace the marketing/mock-shop homepage with a lightweight route index. Keep other two card concepts separate. Redirect the obsolete sender studio link.
4. **Verification:** Run `npm run check` and `npm run build` in GitHub Actions, verify Vercel preview routes, then inspect actual closed/open/replay visuals at narrow phone widths, desktop, keyboard-only and reduced motion. Do not auto-merge.

**Future PR:** Verified API request → persisted personalization → unguessable expiring link → serve the same recipient component. Email and WooCommerce are later integrations.
