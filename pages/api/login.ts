import { exampleUsers } from "@/utils/exampleUsers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { nickname, password } = req.body;
      const matchedUser = exampleUsers.find(
        (user) => user.username === nickname && user.password === password
      );

      // Simulate a delay to mimic an async operation (e.g., database insert)
      await new Promise((resolve) => setTimeout(resolve, 250));

      if (matchedUser) {
        // Simulate user login and return a user object with a unique ID
        const user = {
          id: matchedUser.id,
          username: matchedUser.username,
        };

        // If a match is found, respond with the user object
        res.status(200).json(user);
      } else {
        // If no match is found, respond with an error
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed" });
    }
  } else {
    res.status(405).end();
  }
}
