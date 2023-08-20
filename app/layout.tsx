import { ConfigProvider } from 'antd'
import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import themeConfig from '@/theme/themeConfig'
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import Header from '@/components/header/Header'
import NextAuthProvider from '@/context/next-auth-session'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { AntdStyleProvider } from '@/context/AntdProvider'

const nunitoSans = Nunito_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Folder Based Todo App',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`bg-primary text-light ${nunitoSans.className}`}>
        <NextAuthProvider session={session}>
          <AntdStyleProvider>
            <Header />
            <div className='px-4 py-2'>
              <div className='bg-secondary h-[calc(100vh-80px)] w-full rounded-md border border-light '>
                {children}
              </div>
            </div>
          </AntdStyleProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
