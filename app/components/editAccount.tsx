import { useState } from "react";
import { account, updateAccount } from "../services/database";

export default function EditAccount({ account, closeCallback }: {account: account, closeCallback: () => void}) {
    const [name, setName] = useState(account.id)
    const [description, setDescription] = useState(account.name)

    function handleNameChange(event) {
        setName(event.target.value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    function handleUpdateAccount(event) {
        event.preventDefault()
        const account: account = {
            id: name,
            name: description
        }
        updateAccount(account)
        closeCallback()
    }

    return (
        <>
            <h1>Konto bearbeiten</h1>
            <form onSubmit={handleUpdateAccount}>
                <label>
                    Name
                    <input type="text" value={name} onChange={handleNameChange}></input>
                </label>
                <label>
                    Beschreibung
                    <input type="text" value={description} onChange={handleDescriptionChange}></input>
                </label>
                <button type="submit">Speichern</button>
                <button className="abort" onClick={closeCallback}>Abbrechen</button>
            </form>
        </>
    )
}