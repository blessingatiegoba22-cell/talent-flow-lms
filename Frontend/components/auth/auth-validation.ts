export type FieldErrors = Record<string, string>;

type FieldLabels = Record<string, string>;

export function getAuthFormErrors(
  form: HTMLFormElement,
  labels: FieldLabels,
): FieldErrors {
  return Object.entries(labels).reduce<FieldErrors>((errors, [name, label]) => {
    const field = form.elements.namedItem(name);

    if (!(field instanceof HTMLInputElement)) {
      return errors;
    }

    const error = getInputError(field, label);

    if (error) {
      errors[name] = error;
    }

    return errors;
  }, {});
}

export function hasErrors(errors: FieldErrors) {
  return Object.keys(errors).length > 0;
}

export function hasPasswordMismatch(
  form: HTMLFormElement,
  passwordName = "password",
  confirmPasswordName = "confirmPassword",
) {
  const password = form.elements.namedItem(passwordName);
  const confirmPassword = form.elements.namedItem(confirmPasswordName);

  if (
    !(password instanceof HTMLInputElement) ||
    !(confirmPassword instanceof HTMLInputElement)
  ) {
    return false;
  }

  return Boolean(
    password.value &&
      confirmPassword.value &&
      password.value !== confirmPassword.value,
  );
}

export function removeFieldError(errors: FieldErrors, name: string) {
  if (!(name in errors)) {
    return errors;
  }

  const nextErrors = { ...errors };
  delete nextErrors[name];
  return nextErrors;
}

function getInputError(input: HTMLInputElement, label: string) {
  const { validity } = input;

  if (validity.valueMissing) {
    return `${label} is required.`;
  }

  if (validity.typeMismatch) {
    if (input.type === "email") {
      return "Enter a valid email address.";
    }

    if (input.type === "url") {
      return "Enter a valid link.";
    }

    return `${label} is not valid.`;
  }

  if (validity.tooShort) {
    return `${label} must be at least ${input.minLength} characters.`;
  }

  if (validity.patternMismatch) {
    return input.name === "code"
      ? "Enter the code from your email."
      : `${label} is not in the right format.`;
  }

  return "";
}
