const jwt = require("jsonwebtoken");
const JTW_SECRET = "mukeshpancholi@isgoodboy";

const fetchuser = (req, resp, Next) => {
  //Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    resp.status(401).send({ error: "Please authanticat with valid token" });
  }
  try {
    const data = jwt.verify(token, JTW_SECRET);
    req.user = data.user;
    Next();
  } catch (error) {
    resp.status(401).send({ error: "Please authanticat with valid token" });
  }
};

module.exports = fetchuser;
