import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import Header from '@/components/header/Header'
import NextAuthProvider from '@/context/next-auth-session'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { AntdStyleProvider } from '@/context/AntdProvider'
import TodoContextProvider from '@/context/TodoContext'
import { Suspense } from 'react'
import UserContextProvider from '@/context/UserContext'

const nunitoSans = Nunito_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Folder Based Todo App',
  icons: { icon: "/favicon-96x96.png", apple: "/apple-icon-180x180.png" },
  manifest: "/manifest.json"
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
        <Suspense fallback="Initiating DB">
          <NextAuthProvider session={session}>
            <AntdStyleProvider>
              <UserContextProvider>
                <TodoContextProvider>
                  <Header />
                  <div className='px-4 py-2'>
                    <div className='bg-secondary min-h-[calc(100vh-80px)] w-full rounded-md border border-light'>
                      {children}
                    </div>
                  </div>
                </TodoContextProvider>
              </UserContextProvider>
            </AntdStyleProvider>
          </NextAuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
