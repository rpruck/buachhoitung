import { useState, useEffect } from "react"
import { getAllAccounts, account, deleteAccount } from "../services/database"
import Image from "next/image"
import accounts from "../../public/accounts.svg"
import edit from "../../public/edit.svg"
import trash from "../../public/trash.svg"
import plus from "../../public/plus.svg"
import NewAccount from "./newAccount"

function TODO() {
    return
}

function AccountWidget({ account }: { account: account }) {
    function deleteSelf() {
        deleteAccount(account)
    }

    return (
        <div className="account-widget">
            <div className="account-widget-id">
                <span className="top-line">
                    <Image src={accounts} alt={account.id} />
                    <span>{account.id}</span>
                </span>
                <span className="bottom-line">{account.name}</span>
            </div>
            <div className="account-widget-actions">
                <Image src={edit} alt="edit" onClick={TODO} />
                <Image src={trash} alt="delete" onClick={deleteSelf} />
            </div>
        </div>
    )
}

export default function Accounts() {
    const [accounts, setAccounts] = useState<account[] | null>(null)
    const [newAccountModal, setNewAccountModal] = useState<boolean>(false)

    function openModal() {
        setNewAccountModal(true)
    }

    function closeModal() {
        setNewAccountModal(false)
    }

    useEffect(() => {
        getAllAccounts().then((res) => {
            setAccounts(res)
        })
    }, [accounts])

    return (
        <>
            <div className="header">
                <h1>Konten</h1>
                <Image src={plus} alt="add account" onClick={openModal} />
            </div>

            <div className="accounts">
                {accounts ?
                    (accounts.map(account => <AccountWidget account={account} key={account.id} />))
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