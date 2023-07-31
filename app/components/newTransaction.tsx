import { useState, useEffect } from "react"
import { setupDB, getAllAccounts, account, addTransaction, transaction } from "../services/database"
import Image from "next/image"
import accountsSvg from "../../public/accounts.svg"
import arrow from "../../public/arrow.svg"
import arrowDark from "../../public/arrow-dark.svg"
import search from "../../public/search.svg"
import accountsActive from "../../public/accounts-active.svg"
import refresh from "../../public/refresh.svg"

function TransactionHeader({ amount, from, to }: { amount: number | null, from: string | null, to: string | null }) {
    function formatAmount(amount: number) {
        if (!amount) return 0
        return Number.parseFloat(amount.toString()).toFixed(2).toString().replace(".", ",")
    }

    return (
        <div className="new-transaction-header">
            <span className={`new-transaction-amount ${amount ? "active" : ""}`}>€{formatAmount(amount!)}</span>
            <span className="new-transaction-from-to">
                <span className={`new-transaction-from ${from ? "active" : ""}`}>{from ? from : "Konto 1"}</span>
                <Image src={arrowDark} alt="to" />
                <span className={`new-transaction-to ${to ? "active" : ""}`}>{to ? to : "Konto 2"}</span>
            </span>
        </div>
    )
}

function Amount({ amount, setAmount, setStep }: { amount: number | undefined, setAmount: (e: any) => void, setStep: (e: any) => void }) {
    function handleAmountChange(event: any) {
        setAmount(event.target.value)
    }

    function handleStepChange(event: any) {
        setStep("from")
    }

    return (
        <div className="amount-wrapper">
            <input
                name="amount"
                type="number"
                inputMode="decimal"
                placeholder="€"
                value={amount || ''}
                onChange={handleAmountChange}
                autoFocus
            />
            <button className="primary" onClick={handleStepChange}>Weiter <Image src={arrow} alt="weiter" /></button>
        </div>
    )
}

function From({ accounts, setFrom, setStep, query, setQuery }:
    { accounts: account[], setFrom: (e: any) => void, setStep: (e: any) => void, query: string, setQuery: (e: any) => void }) {

    function containsQuery(account: account) {
        return account.id.includes(query) || account.name.toLowerCase().includes(query.toLowerCase())
    }

    const accountsList = [...accounts]

    function handleFromChange(id: string) {
        setQuery("")
        setFrom(id)
        setStep("to")
    }

    function handleQueryChange(event: any) {
        setQuery(event.target.value)
    }

    function AccountWidgetLite({ account }: { account: account }) {
        function handleFromInput() {
            handleFromChange(account.id)
        }

        return (
            <>
                <div className="account-widget" onClick={handleFromInput}>
                    <span className="top-line">
                        <Image src={accountsSvg} alt="account" />
                        <span>{account.id}</span>
                    </span>
                    <span className="bottom-line">{account.name}</span>
                </div>
            </>
        )
    }

    return (
        <div className="step-wrapper">
            <div className="query-wrapper">
                <Image src={search} alt="search" />
                <input
                    name="query"
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                />
            </div>
            <div className="accounts-list">
                {accounts ? accountsList
                    .filter(containsQuery)
                    .map(account => (<AccountWidgetLite account={account} key={account.id} />))
                    : (<></>)}
            </div>
        </div>
    )
}

function To({ accounts, from, setTo, setStep, query, setQuery }:
    { accounts: account[], from: string, setTo: (e: any) => void, setStep: (e: any) => void, query: string, setQuery: (e: any) => void }) {

    function containsQuery(account: account) {
        return account.id.includes(query) || account.name.toLowerCase().includes(query.toLowerCase())
    }

    const accountsList = [...accounts]

    function handleToChange(id: string) {
        setTo(id)
        setStep("info")
    }

    function handleQueryChange(event: any) {
        setQuery(event.target.value)
    }

    function AccountWidgetLite({ account, isActive }: { account: account, isActive: boolean }) {
        function handleToInput() {
            handleToChange(account.id)
        }

        const svg = isActive ? accountsActive : accountsSvg

        return (
            <>
                <div className={`account-widget ${isActive ? "active" : ""}`} onClick={handleToInput}>
                    <span className="top-line">
                        <Image src={svg} alt="account" />
                        <span>{account.id}</span>
                    </span>
                    <span className="bottom-line">{account.name}</span>
                </div>
            </>
        )
    }

    return (
        <div className="step-wrapper">
            <div className="query-wrapper">
                <Image src={search} alt="search" />
                <input
                    name="query"
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                />
            </div>
            <div className="accounts-list">
                {accounts ? accountsList
                    .filter(containsQuery)
                    .map(account => (<AccountWidgetLite account={account} isActive={account.id === from} key={account.id} />))
                    : (<></>)}
            </div>
        </div>
    )
}

function TransactionInfo({ amount, from, to }: { amount: number | null, from: string | null, to: string | null }) {
    const now = new Date(Date.now())
    const [note, setNote] = useState("")
    const [date, setDate] = useState(now.toISOString().split('T')[0])

    function handleNoteChange(event: any) {
        setNote(event.target.value)
    }

    function handleDateChange(event: any) {
        setDate(event.target.value)
    }

    function handleAddTransaction(event: any) {
        event.preventDefault()
        const transaction: transaction = {
            amount: amount!,
            from: from!,
            to: to!,
            date: date,
            note: note,
            synced: false
        }
        addTransaction(transaction).then(() => {
            location.reload()
        })
    }

    return (
        <form className="transaction-info" onSubmit={handleAddTransaction}>
            <label htmlFor="note">
                Notiz hinzufügen
            </label>
            <input type="text" value={note} name="note" onChange={handleNoteChange} />
            <label htmlFor="date">
                Datum wählen
            </label>
            <input type="date" name="date" value={date} onChange={handleDateChange} />
            <button type="submit" className="primary">Buchen</button>
        </form>
    )
}

function StepDisplay() {

}

export default function NewTransaction() {
    const [step, setStep] = useState("amount")
    const [amount, setAmount] = useState<number | null>(null)
    const [from, setFrom] = useState<string | null>(null)
    const [to, setTo] = useState<string | null>(null)
    const [accounts, setAccounts] = useState<account[] | null>(null)
    const [query, setQuery] = useState<string>("")

    function reset() {
        location.reload()
    }

    //useEffect prevents the DOM from rerendering after updating the state
    useEffect(() => {
        setupDB().then((res) => {
            if (res === false) throw new Error("Could not set up database")
            console.log("Database: ", res)
            getAllAccounts().then((res) => {
                setAccounts(res)
            })
        })
    }, [])


    let steps: { [key: string]: JSX.Element } = {
        "amount": <Amount amount={amount!} setAmount={setAmount} setStep={setStep} />,
        "from": <From accounts={accounts!} setFrom={setFrom} setStep={setStep} query={query} setQuery={setQuery} />,
        "to": <To accounts={accounts!} from={from!} setTo={setTo} setStep={setStep} query={query} setQuery={setQuery} />,
        "info": <TransactionInfo amount={amount} from={from} to={to} />
    }

    return (
        <div className="content-wrapper">
            <div className="header">
                <h1>Neue Transaktion</h1>
                <Image src={refresh} alt="add account" onClick={reset} />
            </div>

            {step !== "amount" ?
                (<TransactionHeader amount={amount} from={from} to={to} />)
                :
                <></>
            }

            {steps[step]}

        </div>
    )
}