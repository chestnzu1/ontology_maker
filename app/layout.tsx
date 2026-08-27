import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Financial Ontology Builder',
  description: 'Build financial domain ontologies in Turtle format',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
