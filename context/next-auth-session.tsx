"use client";

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

type NextAuthProviderPropsType = {
    children: React.ReactNode
    session: Session
}

const NextAuthProvider = ({ children , session}: NextAuthProviderPropsType) => {

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}

export default NextAuthProvider;
