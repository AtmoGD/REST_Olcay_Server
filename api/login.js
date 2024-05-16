const fs = require("fs");
const path = require("path");

// Path to the JSON file
const DATA_FILE = path.resolve(process.cwd(), "./users.json");

// Load data from JSON file
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    return {};
  }
}

// Save data to JSON file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
  } catch (error) {
    console.error("Error writing data file:", error);
  }
}

module.exports = async (req, res) => {
  const { username, password, device_id } = req.query;

  if (!username || !password || !device_id) {
    return res.status(400).json({ success: false, description: "Invalid input" });
  }

  const data = loadData();
  const user = data[username];

  if (user && user.password === password) {
    const devices = user.devices;

    // Check if the device is already registered
    if (devices.includes(device_id)) {
      return res.status(200).json({ success: true });
    }

    // Check the number of devices registered
    if (devices.length >= 5) {
      return res
        .status(403)
        .json({ success: false, description: "License limit reached" });
    }

    // Register the new device
    devices.push(device_id);
    saveData(data);
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, description: "Invalid credentials" });
  }
};
