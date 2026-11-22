# Native sharing — sender completion experience

## Goal
After a verified sender creates a private card, provide one clear path to send it through the mobile OS share sheet, plus a browser-independent manual copy path. This is a presentation improvement on top of the public creation work in PR #11; no email, account, order, scheduling, or new server endpoint is required.

## Behavior
- Only show the **Share card** action when the browser supports the Web Share API (and canShare for URL data when available).
- Invoke navigator.share only from an explicit button click. Never auto-share or call messaging/marketing endpoints.
- Share only minimal generic metadata and the private URL; do not expose the message or names in share text.
- If the user dismisses the system sheet (AbortError), do not show an error. On other failures suggest copying the link.
- Keep **Copy link** available on all devices. If clipboard permission is unavailable, focus and select the readonly input for manual copying, with screen-reader feedback.
- Explain that possession of the URL grants access until the stated expiration time. Avoid extra URLs, analytics, screenshots, or referral redirects that leak the token.
- Keep **Open card** as a separate manual test of the existing recipient experience.

## Validation
Test browsers with and without navigator.share, refused clipboard permission, cancelled share sheet, desktop/mobile layout and screen-reader status announcements. The pure share-data helper rejects malformed or query-bearing URLs.

## Dependency
This is stacked on the branch for PR #11. Once #11 is merged, retarget this PR to main and verify CI again.
