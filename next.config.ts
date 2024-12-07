import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['static.inaturalist.org',"inaturalist-open-data.s3.amazonaws.com"]
  },
};

export default nextConfig;
