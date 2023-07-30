import { transaction } from "./database";

//turns dates from YYYY-MM-DD into DD.MM.YYYY
function formatDate(date: string) {
    const splitDate = date.split('-')
    return `${splitDate[2]}.${splitDate[1]}.${splitDate[0]}`
}

function formatAmount(amount: number) {
    if (!amount) return 0
    return Number.parseFloat(amount.toString()).toFixed(2).toString().replace(".", ",")
}

function formatTransaction(transaction: transaction) {
    return `${formatDate(transaction.date)}	${transaction.note!}		${formatAmount(transaction.amount)}		${transaction.from}	${transaction.to}
`
}

function formatTransactionHtml(transaction: transaction) {
    return `${formatDate(transaction.date)}&#9;${transaction.note!}&#9;&#9;${formatAmount(transaction.amount)}&#9;&#9;${transaction.from}&#9;${transaction.to}
` 
}

function formatTransactionCsv(transaction: transaction) {
    return `${formatDate(transaction.date)};${transaction.note!};;${formatAmount(transaction.amount)};;${transaction.from};${transaction.to}
` 
}

function makeTransactionList(transactions: transaction[], type?: string) {
    let list = type === "email" ? "<pre>" : ""
    for (let transaction of transactions) {
        let line = ""
        if (type === "email") {
            line = formatTransactionHtml(transaction)
        } else if (type === "csv") {
            line = formatTransactionCsv(transaction)
        } else line = formatTransaction(transaction)
        list = list + line
    }
    if (type === "email") list = list + "</pre>"
    return list
}

export function createCopyContent(transactions: transaction[]) {
    return makeTransactionList(transactions)
}

export function createEmail(transactions: transaction[]) {
    const now = new Date(Date.now())
    const today = now.toISOString().split('T')[0]

    const content = `To: Buachhoitung User <${localStorage.getItem("userEmail")}>
Subject: Export vom ${formatDate(today)}
X-Unsent: 1
Content-Type: text/html

<html>
<body>
${makeTransactionList(transactions, "email")}
</body>
</html>
`

    const data = new Blob([content], {type: "text/plain"}) 
    const textFile = window.URL.createObjectURL(data)

    return textFile
}