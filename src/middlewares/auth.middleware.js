import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function authUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decoded contains {id: user._id}

    const user = await userModel.findById(decoded.id);

    req.user = user; // adding user to req object for future use in controllers 

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export { authUser };
