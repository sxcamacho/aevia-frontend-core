if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is required')
}

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  },
  auth: {
    privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "",
  },
  server: {
    apiSecret: process.env.API_SECRET,
  },
} as const 