'use client';

import { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import themeConfig from '@/theme/themeConfig';


export function AntdStyleProvider({ children }: PropsWithChildren) {
    return (
        <ConfigProvider
            theme={themeConfig}
        >  
            <StyledComponentsRegistry>
                {children}
            </StyledComponentsRegistry>
        </ConfigProvider>
    );
}
