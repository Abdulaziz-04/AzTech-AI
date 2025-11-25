import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abdulaziz AI Assistant',
  description: 'Ask questions about Abdulaziz Suria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
