interface Form {
  email: string;
  password: string;
}
interface RegForm extends Form {
  username: string;
  fullname: string;
}
interface Errors {
  [key: string]: string;
}
// any email fits
const validateEmail = (email: string): string => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email";
};
// password should be at least 8 characters long
const validatePassword = (password: string): string => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return "";
};
// username should be at least 3 characters long, can contain letters, numbers, and underscores
const validateUsername = (username: string): string => {
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can contain only letters, numbers, and underscores";
  }
  return "";
};
// name should be at least 3 characters long, have at least two words, can contain only letters
const validateName = (name: string): string => {
  const errors: string[] = [];

  // Check if the name contains at least two words
  const words = name.trim().split(/\s+/);
  if (words.length < 2) {
    errors.push("Full name must have at least two words");
  }

  // Check if all words contain only letters (no digits or special characters)
  const lettersOnly = /^[A-Za-z]+$/;
  for (const word of words) {
    if (!lettersOnly.test(word)) {
      errors.push("Full name can only contain letters");
    }
  }
  // Check if the name has at least 3 characters
  if (name.length < 3) {
    errors.push("Full name must be at least 3 characters long");
  }
  if (errors.length > 0) {
    return errors.join("\n");
  }
  return "";
};

export const validateRegistration = (form: RegForm): Errors => {
  if (!form.email || !form.password || !form.username || !form.fullname) {
    return {
      global: "Please fill in all fields",
    };
  }
  const errors: Errors = {};
  errors["email"] = validateEmail(form.email);
  errors["password"] = validatePassword(form.password);
  errors["username"] = validateUsername(form.username);
  errors["fullname"] = validateName(form.fullname);

  return errors;
};

export const validateLogin = (form: Form): Errors => {
  if (!form.email || !form.password) {
    return {
      global: "Please fill in all fields",
    };
  }
  const errors: Errors = {};
  errors["email"] = validateEmail(form.email);
  errors["password"] = validatePassword(form.password);

  return errors;
};
