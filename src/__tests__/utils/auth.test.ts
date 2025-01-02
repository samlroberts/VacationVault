import { saltAndHashPassword, verifyPassword } from "~/utils/password";
import { createUser, getUserFromDb } from "~/utils/users";
import { db } from "~/server/db";

// Mock Prisma client
jest.mock("~/server/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Auth Utils", () => {
  describe("verifyPassword", () => {
    it("should verify a valid password", async () => {
      const password = "testPassword123";
      const hashedPassword = await saltAndHashPassword(password);

      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it("should reject an invalid password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword123";
      const hashedPassword = await saltAndHashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe("getUserFromDb", () => {
    it("should return user when found", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        passwordHash: "hashedPassword",
      };

      (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await getUserFromDb("test@example.com");
      expect(user).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);

      const user = await getUserFromDb("nonexistent@example.com");
      expect(user).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const mockCreatedUser = {
        id: "1",
        email: "test@example.com",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        passwordHash: expect.any(String),
      };

      (db.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const user = await createUser("test@example.com", "testPassword123");
      expect(user).toEqual(mockCreatedUser);
    });
  });
});
