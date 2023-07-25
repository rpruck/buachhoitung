import { useState, useEffect, useRef } from "react"
import { setupDB, getAllAccounts, account } from "../services/database"

function TransactionHeader() {

}

function Amount({ amount, setAmount, setStep }: { amount: number | undefined, setAmount: (e: any) => void, setStep: (e: any) => void }) {
    function handleAmountChange(e: any) {
        setAmount(e.target.value)
    }

    function handleStepChange(e: any) {
        setStep("from")
    }

    return (
        <>
            <input
                name="amount"
                type="numeric"
                placeholder="€"
                value={amount || ''}
                onChange={handleAmountChange}
            />
            <button className="primary" onClick={handleStepChange}>Weiter</button>
        </>
    )
}

function From() {

}

function To() {

}

function TransactionInfo() {

}

function StepDisplay() {

}

export default function NewTransaction() {
    const [step, setStep] = useState("amount")
    const [amount, setAmount] = useState<number | null>(null)
    const [from, setFrom] = useState(undefined)
    const [to, setTo] = useState(undefined)
    const [accounts, setAccounts] = useState<account[] | null>(null)

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
        "amount": <Amount amount={amount} setAmount={setAmount} setStep={setStep} />
    }

    return (
        <>
            <h1>Neue Transaktion</h1>

            {steps[step]}
            {accounts ? (
                accounts[0].name
            ) : (
                <h2>Data not loaded yet</h2>
            )}
        </>
    )
}