const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, email, password} = req.body;

  if (!firstName || !lastName)
    throw new Error("Firstname and lastname is required");
  if (!email) throw new Error("Email is required");
  else if (!validator.isEmail(email)) throw new Error("Email is not valid");

  if (!password) throw new Error("Password is required");
  else if (!validator.isStrongPassword(password))
    throw new Error(
      "Password must contain letters, numbers and special characters"
    );
};

module.exports = { validateSignup };
