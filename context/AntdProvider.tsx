'use client';

import { PropsWithChildren } from 'react';
import { App, ConfigProvider } from 'antd';
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import themeConfig from '@/theme/themeConfig';


export function AntdStyleProvider({ children }: PropsWithChildren) {
    return (
        <StyledComponentsRegistry>
            <ConfigProvider
                theme={themeConfig}
            >  
                <App>
                    {children}
                </App>
            </ConfigProvider>
        </StyledComponentsRegistry>
    );
}
