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
  icons: [{ rel: "icon", url: "android-icon-192x192/icon.png" }, { rel: "apple-touch-icon", url: "apple-icon-180x180.png" }]
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
                      <Suspense fallback="Loading">
                        {children}
                      </Suspense>
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
