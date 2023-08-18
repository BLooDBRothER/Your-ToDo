import { ConfigProvider } from 'antd'
import './globals.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import theme from '@/theme/themeConfig'
import StyledComponentsRegistry from '@/lib/AntdRegistry'

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
                <header className='p-2'>
                  <h1>Your ToDo</h1>
                </header>
                {children}
            </ConfigProvider>
          </StyledComponentsRegistry>
        </body>
    </html>
  )
}
