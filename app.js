const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(bodyParser.json());

// Path to the JSON file
const DATA_FILE = "users.json";

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

// Function to handle device registration/login
function handleDeviceRegistration(username, password, device_id) {
  const data = loadData();
  const user = data[username];

  if (user && user.password === password) {
    const devices = user.devices;

    // Check if the device is already registered
    if (devices.includes(device_id)) {
      return { success: true };
    }

    // Check the number of devices registered
    if (devices.length >= 5) {
      return { success: false, description: "License limit reached" };
    }

    // Register the new device
    devices.push(device_id);
    saveData(data);
    return { success: true };
  } else {
    return { success: false, description: "Invalid credentials" };
  }
}

// Endpoint to register/login a device via POST
app.post("/login", (req, res) => {
  const { username, password, device_id } = req.body;

  if (!username || !password || !device_id) {
    return res.status(400).json({ success: false, description: "Invalid input" });
  }

  const result = handleDeviceRegistration(username, password, device_id);
  return res.status(result.success ? 200 : 401).json(result);
});

// Endpoint to register/login a device via GET
app.get("/login", (req, res) => {
  const { username, password, device_id } = req.query;

  if (!username || !password || !device_id) {
    return res.status(400).json({ success: false, description: "Invalid input" });
  }

  const result = handleDeviceRegistration(username, password, device_id);
  return res.status(result.success ? 200 : 401).json(result);
});

// Endpoint to get all user data
app.get("/users", (req, res) => {
  const data = loadData();
  return res.status(200).json(data);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
