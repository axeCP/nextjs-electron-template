// `npm run electron:export` (and the other electron:* builds) set ELECTRON=1 to
// make a fully static copy of the site in ./out for the Electron app to load.
// Normal dev and the Docker/server build are unaffected.
const isElectron = process.env.ELECTRON === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isElectron && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
