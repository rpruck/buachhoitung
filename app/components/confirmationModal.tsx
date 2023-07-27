export default function ConfirmationModal({ actionCallback, closeCallback, text }:
    { actionCallback: () => void, closeCallback: () => void, text: string }) {
        function handleAccept(event) {
            actionCallback()
            closeCallback()
        }

        function handleAbort(event) {
            closeCallback()
        }

        return (
            <div className="fill-screen" onClick={handleAbort}>
                <div className="modal">
                    <span className="modal-text">{text}</span>
                    <span className="modal-actions">
                        <button className="primary" onClick={handleAccept}>Ja</button>
                        <button className="abort" onClick={handleAbort}>Nein</button>
                    </span>
                </div>
            </div>
        )
}