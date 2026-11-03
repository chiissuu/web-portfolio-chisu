export type FormStatus = "idle" | "loading" | "error" | "success";

// The index signature makes "this is a flat string-keyed object" part of the
// type; every field is already a `string`.
export interface ContactFormData {
  [key: string]: string;
  name: string;
  email: string;
  reason: string;
  message: string;
}

export interface FormFieldError {
  field: string;
  message: string;
}
