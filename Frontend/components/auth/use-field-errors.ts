"use client";

import { useCallback, useState } from "react";

import {
  removeFieldError,
  type FieldErrors,
} from "@/components/auth/auth-validation";

export function useFieldErrors() {
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = useCallback((name: string) => {
    setErrors((current) => removeFieldError(current, name));
  }, []);

  return { clearError, errors, setErrors };
}
