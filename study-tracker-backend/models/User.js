// models/User.js
const { v4: uuidv4 } = require("uuid");

class User {
  constructor(email, password, faceData) {
    this.userId = uuidv4(); // Generate unique user ID
    this.email = email;
    this.password = password;
    this.faceData = faceData;
  }
}

module.exports = User;
