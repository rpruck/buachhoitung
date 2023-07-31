import { useState, useEffect } from "react"
import { getAllAccounts, account } from "../services/database"
import Image from "next/image"
import plus from "../../public/plus.svg"
import NewAccount from "./newAccount"
import AccountWidget from "./accountWidget"

export default function Accounts() {
    const [accounts, setAccounts] = useState<account[] | null>(null)
    const [newAccountModal, setNewAccountModal] = useState<boolean>(false)

    function openModal() {
        setNewAccountModal(true)
    }

    function closeModal() {
        setNewAccountModal(false)
        updateAccounts()
    }

    useEffect(() => {
        getAllAccounts().then((res) => {
            setAccounts(res)
        })
    }, [])

    function updateAccounts() {
        getAllAccounts().then((res) => {
            setAccounts(res)
        })
    }

    return (
        <>
            <div className="header">
                <h1>Konten</h1>
                <Image src={plus} alt="add account" onClick={openModal} />
            </div>

            <div className="accounts">
                {accounts ?
                    (accounts.map(account => <AccountWidget account={account} key={account.id} updateAccountList={updateAccounts} />))
                    :
                    (<span>Loading</span>)
                }
            </div>
        
            {newAccountModal ?
                (<NewAccount closeCallback={closeModal} />)
                :
                (<></>)
            }
        </>
    )

}