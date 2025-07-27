export function validateEmail(email: string): boolean {
  // Simple email regex
  const re = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
  return re.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 chars, one number, one special char
  const re = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return re.test(password);
}

export function validateUsername(username: string): boolean {
  // Alphanumeric and underscores, 3-20 chars
  const re = /^\w{3,20}$/;
  return re.test(username);
}

export function validateVideoTitle(title: string): boolean {
  return (
    typeof title === "string" && title.trim().length > 0 && title.length <= 100
  );
}

export function validatePhoneNumber(phone: string): boolean {
  // Indian mobile: starts with 6-9, 10 digits
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
}
