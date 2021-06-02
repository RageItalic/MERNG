module.exports.registerValidator = (username, email, pass, confirmPass) => {
  const errors = {}
  if (username.trim() === "") {
    errors.username = "username must not be empty"
  }
  if (email.trim() === "") {
    errors.email = "email must not be empty"
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "email must be valid"
    }
  }
  if (pass === "") {
    errors.password = "password must not be empty"
  } else if (pass !== confirmPass) {
    errors.password = "passwords must match!"
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
}

module.exports.loginValidator = (username, password) => {
  const errors = {}
  if (username.trim() === "") {
    errors.username = "username must not be empty"
  }
  if (password === "") {
    errors.password = "password must not be empty"
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
}