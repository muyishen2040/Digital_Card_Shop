# Card text-fit calibration and authoring acceptance

## Why character count is not enough

Every recipient card has a different reading area, typography and reserved artwork space. A 150-character note may fit in one card and scroll in another. The number of lines is influenced by actual word wrapping, recipient/sender names, explicit line breaks, Unicode characters, device dimensions, browser font choices and accessibility text scaling.

**Product target:** A newly authored note should be fully visible at ordinary mobile sizes without scrolling. If the browser displays a larger type size or an older/legacy card exceeds available space, reading-area scrolling remains available and the message must never be clipped or silently shortened.

## Preliminary layout measurement (not a production guarantee)

Exploratory measurements recreated the relevant reading-area CSS in headless Chromium with **fallback system fonts**. They did not exercise the complete deployed Next.js page, its optimized web fonts or animations, so the measured values are *approximate* capacities, not shipping limits. Samples used short names ("Jamie" and "Taylor") and a **320 × 568** viewport.

| Message pattern | A Little Sunshine | Under the Same Sky | Make a Wish |
|---|---:|---:|---:|
| Continuous English prose | ~370 | ~210 | ~140 |
| Multiple short paragraphs and blank lines | ~175 | ~130 | ~90 |
| Chinese text (full-width characters) | ~150 | ~95 | ~65 |

A second run with names of about twenty characters reduced the multiple-paragraph capacities to roughly **140 / 90 / 70**. Changing fonts, screen size or names changes these values. Exact production limits cannot be inferred solely from these simulations.

## Storage ceiling and editorial recommendations

All three templates share a **hard storage maximum** of 40 Unicode code points per name and 600 per message.

| Card | Suggested message length | Enforced message maximum |
|---|---:|---:|
| A Little Sunshine | ~240 | 600 |
| Under the Same Sky | ~140 | 600 |
| Make a Wish | ~100 | 600 |

Suggested lengths encourage an entire greeting to be visible at once, not a prohibition on longer heartfelt notes. Character count does not guarantee a geometric fit. The sender preview should warn when a message requires internal scrolling but **allow the sender to choose a longer message intentionally**. Never silently truncate or shrink type to meet the recommendations.

## Required sender-editor behavior

When validating the sender editor:

1. Display the selected real card template with the sender's actual names and message. Do not estimate based on character count alone.
2. Await `document.fonts.ready` and at least one browser layout frame. The message regions are marked with `data-card-text-region`.
3. Call `measureCardTextFit(cardRoot)`; `overflows` means the reading region's `scrollHeight` or `scrollWidth` exceeds the visible dimensions. `unmeasurable` is not a successful fit.
4. Re-measure after each content edit, viewport resize, font load, or relevant layout change (a `ResizeObserver` can help, with protection against observing the same element's own layout feedback).
5. Preview a narrow supported phone layout before creation. Warn clearly when the full note does not fit, and offer shortening it or explicitly keeping a scrollable note; never silently truncate. A desktop-only preview is insufficient.
6. Server-side validation independently enforces the shared 40/600 bounds; only the browser can perform exact font/layout checks.
7. Keep scrollable recipient regions as the final fallback for unusual browser zoom, enlarged text, or previously created messages.

## Visual QA matrix

Test the exact card renderer at 320 × 568, 375 × 667, 390 × 844, 768 × 1024, and 1440 × 900 with production fonts. Include long recipient/sender names, multiple paragraphs, Chinese text, emoji, unbroken strings, and high browser zoom. Confirm names and signature are visible alongside the entire message; verify that neither the border nor decorative art covers the text.

Use real browser screenshots and computed dimensions to validate text fitting; do not treat the exploratory measurements above as production limits. Avoid shrinking fonts or changing the card's visual design just to accommodate overly long input.
