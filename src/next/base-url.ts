export function createLink(...pathSegments: string[]) {
  const path = pathSegments.join("/");

  if (typeof window !== "undefined") {
    // browser should use relative path
    return `${path}`;
  }

  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}/${path}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}/${path}`;
}
