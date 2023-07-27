import { useState, useEffect } from "react"
import { setupDB, getAllAccounts, account } from "../services/database"
import Image from "next/image"
import accountssvg from "../../public/accounts.svg"
import arrow from "../../public/arrow.svg"

function TransactionHeader({ amount, from, to }: { amount: number | null, from: string | null, to: string | null }) {
    return (
        <div className="new-transaction-header">
            <span className="new-transaction-amount">{amount}</span>
            <span className="new-transaction-from-to">
                <span className="new-transaction-from">{from}</span>
                <Image src={arrow} alt="to" />
                <span className="new-transaction-to">{to}</span>
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
        <>
            <input
                name="amount"
                type="number"
                inputMode="decimal"
                placeholder="€"
                value={amount || ''}
                onChange={handleAmountChange}
            />
            <button className="primary" onClick={handleStepChange}>Weiter</button>
        </>
    )
}

function From({ accounts, setFrom, setStep, query, setQuery }:
    { accounts: account[], setFrom: (e: any) => void, setStep: (e: any) => void, query: string, setQuery: (e: any) => void }) {

    function containsQuery(account: account) {
        return account.id.includes(query) || account.name.toLowerCase().includes(query.toLowerCase())
    }

    const accountsList = [...accounts]

    function handleFromChange(id: string) {
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
                    <div className="account-widget-id">
                        <span className="top-line">
                            <Image src={accountssvg} alt="account" />
                            <span>{account.id}</span>
                        </span>
                        <span className="bottom-line">{account.name}</span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <input
                name="query"
                type="text"
                value={query}
                onChange={handleQueryChange}
            />
            {accounts ? accountsList
                .filter(containsQuery)
                .map(account => (<AccountWidgetLite account={account} key={account.id} />))
                : (<></>)}
        </>
    )
}

function To({ accounts, setTo, setStep, query, setQuery }:
    { accounts: account[], setTo: (e: any) => void, setStep: (e: any) => void, query: string, setQuery: (e: any) => void }) {

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

    function AccountWidgetLite({ account }: { account: account }) {
        function handleToInput() {
            handleToChange(account.id)
        }

        return (
            <>
                <div className="account-widget" onClick={handleToInput}>
                    <div className="account-widget-id">
                        <span className="top-line">
                            <Image src={accountssvg} alt="account" />
                            <span>{account.id}</span>
                        </span>
                        <span className="bottom-line">{account.name}</span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <input
                name="query"
                type="text"
                value={query}
                onChange={handleQueryChange}
            />
            {accounts ? accountsList
                .filter(containsQuery)
                .map(account => (<AccountWidgetLite account={account} key={account.id} />))
                : (<></>)}
        </>
    )
}

function TransactionInfo() {

}

function StepDisplay() {

}

export default function NewTransaction() {
    const [step, setStep] = useState("amount")
    const [amount, setAmount] = useState<number | null>(null)
    const [from, setFrom] = useState<string | null>("Konto 1")
    const [to, setTo] = useState<string | null>("Konto 2")
    const [accounts, setAccounts] = useState<account[] | null>(null)
    const [query, setQuery] = useState<string>("")

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
        "amount": <Amount amount={amount} setAmount={setAmount} setStep={setStep} />,
        "from": <From accounts={accounts} setFrom={setFrom} setStep={setStep} query={query} setQuery={setQuery} />,
        "to": <To accounts={accounts} setTo={setTo} setStep={setStep} query={query} setQuery={setQuery} />
    }

    return (
        <>
            <h1>Neue Transaktion</h1>

            {step !== "amount" ?
                (<TransactionHeader amount={amount} from={from} to={to} />)
                :
                <></>
            }

            {steps[step]}
            {accounts ? (
                accounts[0].name
            ) : (
                <h2>Data not loaded yet</h2>
            )}
        </>
    )
}