import users from "./users.json";

export default async (req, res) => {
  return res.status(200).json(users);
};
