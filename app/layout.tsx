import './globals.css'

export const metadata = {
  title: "Vacation Living · Inspections",
  description: "Luxury Inspection Management Platform"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
