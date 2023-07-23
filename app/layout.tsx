import './globals.css'
import Head from 'next/head'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  return (
    <>
      <Head><title>Buachhoitung</title></Head>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </>
  )
}
