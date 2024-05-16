const fs = require("fs");
const path = require("path");

// Path to the JSON file
const DATA_FILE = path.resolve(process.cwd(), "./users.json");

const data = require("./users.json");

const users = {
  john_doe: {
    password: "securepassword",
    devices: ["device123", "device124"],
  },
};

// Load data from JSON file
function loadData() {
  try {
    return data;
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    return {};
  }
}

module.exports = async (req, res) => {
  const data = loadData();
  return res.status(200).json(data);
};
