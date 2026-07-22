const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export function validateEmail(email: string | null | undefined): string | null {
  if (!email || email.trim() === "") return null;
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Enter a valid email address";
  }
  return null;
}

export function validatePhone(phone: string | null | undefined): string | null {
  if (!phone || phone.trim() === "") return null;
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (!PHONE_REGEX.test(cleaned)) {
    return "Enter a valid phone number (digits only, 7–15 characters)";
  }
  return null;
}

export function validateLeadForm(data: {
  name: string;
  email?: string | null;
  phone?: string | null;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  }

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
}
