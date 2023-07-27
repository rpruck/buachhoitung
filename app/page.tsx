'use client'

import Image from 'next/image'
import styles from './page.module.css'
import Transaction from './components/newTransaction'
import { useState } from 'react'
import { NavBar } from './components/navbar'
import Accounts from './components/accounts'
import NewTransaction from './components/newTransaction'
import Transactions from './components/transactions'

export default function Home() {

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

  let content
  if (state == 'home') {
    content = <NewTransaction />
  }
  else if (state == 'transactions') {
    content = <Transactions />
  }
  else if (state == 'accounts') {
    content = <Accounts />
  }
  else throw new Error("State not implemented! State is: " + state)

  return (
    <>
      <h1>Hello, World!</h1>
      <span>{state}</span>
      {content}

      <NavBar navHome={navigateToHome} navAccounts={navigateToAccounts} navTransactions={navigateToTransactions} />
    </>
  )
}
