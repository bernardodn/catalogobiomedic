import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (supabaseUrl) {
  const parsed = new URL(supabaseUrl);
  remotePatterns.push({ protocol: parsed.protocol.replace(":", "") as "http" | "https", hostname: parsed.hostname, pathname: "/storage/v1/object/public/**" });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns },
};

export default nextConfig;
