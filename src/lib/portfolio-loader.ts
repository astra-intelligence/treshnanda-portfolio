/* Long enough for the full intro choreography: ring draw (0.9s), portrait
   materialize, letter stagger (ends ~1.25s), one shimmer sweep. */
export const LOADER_MIN_MS = 1_600;
export const LOADER_MAX_MS = 2_500;

export function getLoaderReleaseTime(startedAt: number, readyAt: number | null) {
  const earliestRelease = startedAt + LOADER_MIN_MS;
  const latestRelease = startedAt + LOADER_MAX_MS;

  if (readyAt === null) return latestRelease;

  return Math.min(Math.max(readyAt, earliestRelease), latestRelease);
}
