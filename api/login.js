import data from "./users.json";

module.exports = async (req, res) => {
  let { username, password, device_id } = req.body;

  if (req.method === "GET") {
    // Handle GET requests
    username = req.query.username;
    password = req.query.password;
    device_id = req.query.device_id;
  }

  if (!username || !password || !device_id) {
    return res.status(400).json({ success: false, description: "Invalid input" });
  }

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

    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, description: "Invalid credentials" });
  }
};
