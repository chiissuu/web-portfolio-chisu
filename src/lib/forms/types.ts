export type FormStatus = "idle" | "loading" | "error" | "success";

// Both form-data shapes carry an explicit string index signature so they
// satisfy `submitFormPlaceholder<T extends Record<string, string>>` in
// `./submit.ts` — every field on both interfaces is already a `string`, so
// the index signature doesn't widen anything a caller could observe, it
// just makes the "this is a flat string-keyed object" fact part of the
// type instead of leaving it implicit (no `any`/`@ts-ignore`/cast needed
// at either the form component or the submit function).
export interface ContactFormData {
  [key: string]: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  preferredResponse: string;
}

export interface ServicesFormData {
  [key: string]: string;
  name: string;
  email: string;
  company: string;
  serviceType: string;
  budget: string;
  timeline: string;
  problem: string;
  message: string;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface SubmitResult {
  ok: boolean;
}
