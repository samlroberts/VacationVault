import { db } from "~/server/db";
import { saltAndHashPassword } from "./password";

export const getUserFromDb = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  console.log("user from db", user);

  if (!user) {
    return null;
  }

  return user;
};

export const createUser = async (email: string, password: string) => {
  const pwHash = await saltAndHashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      passwordHash: pwHash,
    },
  });

  return user;
};
