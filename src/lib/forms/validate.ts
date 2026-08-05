import type { ContactFormData, FormFieldError, ServicesFormData } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireField(value: string, field: string): FormFieldError | null {
  return value.trim().length === 0 ? { field, message: "required" } : null;
}

export function validateEmail(value: string, field = "email"): FormFieldError | null {
  if (value.trim().length === 0) return { field, message: "required" };
  return EMAIL_PATTERN.test(value.trim()) ? null : { field, message: "invalid" };
}

export function validateContactForm(data: ContactFormData): FormFieldError[] {
  const errors: FormFieldError[] = [];
  const required: Array<[keyof ContactFormData, string]> = [
    ["name", "name"],
    ["reason", "reason"],
    ["subject", "subject"],
    ["message", "message"],
    ["preferredResponse", "preferredResponse"],
  ];

  required.forEach(([key, field]) => {
    const error = requireField(data[key] ?? "", field);
    if (error) errors.push(error);
  });

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  return errors;
}

export function validateServicesForm(data: ServicesFormData): FormFieldError[] {
  const errors: FormFieldError[] = [];
  const required: Array<[keyof ServicesFormData, string]> = [
    ["name", "name"],
    ["serviceType", "serviceType"],
    ["problem", "problem"],
  ];

  required.forEach(([key, field]) => {
    const error = requireField(data[key] ?? "", field);
    if (error) errors.push(error);
  });

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  return errors;
}
