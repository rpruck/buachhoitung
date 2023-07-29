import { useState } from "react";
import { account, updateAccount } from "../services/database";

export default function EditAccount({ account, closeCallback }: { account: account, closeCallback: () => void }) {
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

    function handleOutsideTap(event) {
        if (!event.target.closest(".modal")) closeCallback()
    }

    return (
        <div className="fill-screen" onClick={handleOutsideTap}>
            <div className="modal">
                <h1>Konto bearbeiten</h1>
                <form onSubmit={handleUpdateAccount}>
                    <label htmlFor="name">
                        Name
                    </label>
                    <input type="text" name="name" value={name} onChange={handleNameChange} />
                    <label>
                        Beschreibung
                    </label>
                    <input type="text" value={description} onChange={handleDescriptionChange} />
                    <span className="buttons">
                        <button className="primary" type="submit">Speichern</button>
                        <button className="abort" onClick={closeCallback}>Abbrechen</button>
                    </span>
                </form>
            </div>
        </div>
    )
}