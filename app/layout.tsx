'use client'

import './globals.css'
import { NavBar } from './components/navbar'
import { useState } from 'react'

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: {
    state: any;
  }
}) {

  const [state, setState] = useState("home")

  function navigateToHome() {
    setState("home")
  }

  function navigateToTransactions() {
    setState("transactions")
  }

  function navigateToAccounts() {
    setState("accounts")
  }

  return (
    <>
      <head><title>Buachhoitung</title></head>
      <html lang="en">
        <body>
          {children}
          {state}
          <NavBar navHome={navigateToHome} navAccounts={navigateToAccounts} navTransactions={navigateToTransactions} />
        </body>
      </html>
    </>
  )
}
