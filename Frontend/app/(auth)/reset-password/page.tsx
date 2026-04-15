"use client"

import { useState } from "react"
import ResetPasswordForm from "@/components/auth/reset-password-form"
import PasswordResetSuccess from "@/components/auth/password-reset-success"

export default function ResetPasswordPage() {
  const [isReset, setIsReset] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07142F] p-4">
      {!isReset ? (
        <ResetPasswordForm onSuccess={() => setIsReset(true)} />
      ) : (
        <PasswordResetSuccess />
      )}
    </main>
  )
}