import { Database } from "@/types_db";

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const extractProgress = (
  log: string
): { progress: number | null; cycle: number | null } => {
  if (typeof log === "string" && log) {
    const lines = log.split("\n");

    // Find lines that indicate the start of an upscale cycle
    const upscaleLines = lines.filter((line) =>
      line.includes("IterativeLatentUpscale")
    );
    const cycle = upscaleLines.length; // The number of upscale cycles found

    // Reverse the array and find the first line that contains a percentage
    const lastProgressLine = lines.reverse().find((line) => line.includes("%"));

    if (lastProgressLine) {
      // Extract the percentage from the line
      const percentageMatch = lastProgressLine.match(/(\d+)%/);
      if (percentageMatch) {
        return { progress: parseInt(percentageMatch[1], 10), cycle };
      }
    }
  }

  // Return null if no percentage was found
  return { progress: null, cycle: null };
};
