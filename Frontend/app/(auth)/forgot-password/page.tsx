"use client"

import { useState } from "react"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import CodeSentConfirmation from "@/components/auth/code-sent-confirmation"

export default function ForgotPasswordPage() {

  const [isSent, setIsSent] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07142F]">
      {/* If isSent is true, it shows the Success screen. Otherwise, it shows the Form. */}
      {!isSent ? (
        <ForgotPasswordForm onSuccess={() => setIsSent(true)} />
      ) : (
        <CodeSentConfirmation />
      )}
    </main>
  )
}