'use client';

import { ThemeProvider } from "@/components/theme-provider"
import { PrivyProvider } from '@privy-io/react-auth';
import { useTheme } from 'next-themes';
import { config } from "@/lib/config";

function PrivyProviderWithTheme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <PrivyProvider
      appId={config.auth.privyAppId}
      config={{
        appearance: {
          theme: theme as 'light' | 'dark',
          accentColor: '#676FFF',
          logo: '',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PrivyProviderWithTheme>
        {children}
      </PrivyProviderWithTheme>
    </ThemeProvider>
  );
} 