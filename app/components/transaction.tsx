'use client'
import { AnyRecord } from "dns"
import { useState } from "react"
import { DatabaseAccess } from "../services/DatabaseAccess"

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

export default function Transaction() {
    const [step, setStep] = useState("amount")
    const [amount, setAmount] = useState(undefined)
    const [from, setFrom] = useState(undefined)
    const [to, setTo] = useState(undefined)
    let db = new DatabaseAccess()

    let steps = {
        "amount": <Amount amount={amount} setAmount={setAmount} setStep={setStep} />
    }

    return (
        <>
            <h1>Neue Transaktion</h1>

            {steps[step]}
            {db.getAllAccounts()}
        </>
    )
}