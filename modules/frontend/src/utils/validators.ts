export interface Form {
  email: string;
  password: string;
}

export interface RegForm extends Form {
  nickname: string;
  name: string;
  surname: string;
}

interface Errors {
  [key: string]: string;
}

// any email fits
const validateEmail = (email: string): string => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email"
}
// password should be at least 8 characters long
const validatePassword = (password: string): string => {
  // todo if (password.length < 8) {
  //   return "Password must be at least 8 characters long";
  // }
  return ""
}
// username should be at least 3 characters long, can contain letters, numbers, and underscores
const validateUsername = (username: string): string => {
  if (username.length < 3) {
    return "Username must be at least 3 characters long"
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can contain only letters, numbers, and underscores"
  }
  return ""
}
// name should be at least 3 characters long, can contain only letters
const validateName = (name: string): string => {
  if (name.length < 3) {
    return "Username must be at least 3 characters long"
  }
  if (!/^[a-zA-Z]+$/.test(name)) {
    return "Username can contain only letters, numbers, and underscores"
  }
  return ""
}

export const validateRegistration = (form: RegForm): Errors => {
  if (
    !form.email ||
    !form.password ||
    !form.nickname ||
    !form.name ||
    !form.surname
  ) {
    return {
      global: "Please fill in all fields"
    }
  }
  const errors: Errors = {}
  errors["email"] = validateEmail(form.email)
  errors["password"] = validatePassword(form.password)
  errors["nickname"] = validateUsername(form.nickname)
  errors["name"] = validateName(form.name)
  errors["surname"] = validateName(form.surname)

  return errors
}

export const validateLogin = (form: Form): Errors => {
  if (!form.email || !form.password) {
    return {
      global: "Please fill in all fields"
    }
  }
  const errors: Errors = {}
  errors["email"] = validateEmail(form.email)
  errors["password"] = validatePassword(form.password)

  return errors
}
