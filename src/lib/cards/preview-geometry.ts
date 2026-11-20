/** Size the preview display without changing its real iframe viewport.
 * The 4px border is outside the iframe's CSS viewport on both sides. */
export const PREVIEW_BORDER_PX = 4;

export function fitPreviewToPanel(
  viewport: Readonly<{ width: number; height: number }>,
  availableWidth: number | null,
): { scale: number; width: number; height: number } {
  const width = viewport.width + PREVIEW_BORDER_PX * 2;
  const height = viewport.height + PREVIEW_BORDER_PX * 2;
  const scale = availableWidth !== null && Number.isFinite(availableWidth) && availableWidth > 0
    ? Math.min(1, availableWidth / width)
    : 1;
  return { scale, width: width * scale, height: height * scale };
}
