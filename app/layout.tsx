import { ConfigProvider } from 'antd'
import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import theme from '@/theme/themeConfig'
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import Header from '@/components/Header'

const nunitoSans = Nunito_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Folder Based Todo App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={`bg-primary text-light ${nunitoSans.className}`}>
          <StyledComponentsRegistry>
            <ConfigProvider theme={theme}>
                <Header />
                <div className='px-4 py-2'>
                  <div className='bg-secondary h-[calc(100vh-80px)] w-full rounded-md border border-light '>
                    {children}
                  </div>
                </div>
            </ConfigProvider>
          </StyledComponentsRegistry>
        </body>
    </html>
  )
}
