import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import Header from '@/components/header/Header'
import NextAuthProvider from '@/context/next-auth-session'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { AntdStyleProvider } from '@/context/AntdProvider'
import TodoContextProvider from '@/context/TodoContext'
import UserContextProvider from '@/context/UserContext'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react';

const nunitoSans = Nunito_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://your-to-do.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: 'Todo App',
  description: 'Folder Based Todo App',
  icons: [{ rel: "icon", url: "android-icon-192x192/icon.png" }, { rel: "apple-touch-icon", url: "apple-icon-180x180.png" }],
  openGraph: {
    type: "website",
    url: "https://your-to-do.vercel.app",
    title: "Your Todo - Folder Based Todo App",
    siteName: "Your Todo - Folder Based Todo App",
    description: "Your Todo is a folder based todo app where user can create folder and related todo inside the respective folder.",
    images: [{url: "/logo/logo-only-text.png"}]
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`bg-primary text-light ${nunitoSans.className}`}>
        <NextAuthProvider session={session}>
          <AntdStyleProvider>
            <UserContextProvider>
              <TodoContextProvider>
                <Header />
                <div className='px-4 py-2'>
                  <div className='bg-secondary min-h-[calc(100vh-100px)] w-full rounded-md border border-light'>
                    {children}
                  </div>
                </div>
              </TodoContextProvider>
            </UserContextProvider>
          </AntdStyleProvider>
        </NextAuthProvider>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
