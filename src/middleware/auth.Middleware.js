const adminAuth = (req, res, next) => {
  const token = "kishan";
  if (token !== "kishan") {
    res.status(401).send("You are not authrized")
  } else {
    res.send("Welcome to Admin Dashboard");
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  if (token !== "abc") {
    return res.status(401).send("You are not authrized")
  } else {
    res.send("Welcome to user dashboard");
  }
};

module.exports = { userAuth, adminAuth };
