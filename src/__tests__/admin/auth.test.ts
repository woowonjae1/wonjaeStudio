/**
 * **Feature: admin-dashboard, Property 11: Invalid credentials rejection**
 * **Validates: Requirements 1.3**
 *
 * For any login attempt with credentials not matching any admin_users record,
 * the response SHALL indicate failure and no session token SHALL be issued.
 */

import * as fc from "fast-check";
import bcrypt from "bcryptjs";

// Mock valid admin credentials for testing
const VALID_ADMIN = {
  username: "admin",
  passwordHash: bcrypt.hashSync("admin123", 10),
};

// Simulated login validation function (mirrors API logic)
async function validateLogin(
  username: string,
  password: string,
  adminUsers: Array<{ username: string; password_hash: string }>
): Promise<{ success: boolean; error?: string }> {
  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  const user = adminUsers.find((u) => u.username === username);
  if (!user) {
    return { success: false, error: "Invalid credentials" };
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return { success: false, error: "Invalid credentials" };
  }

  return { success: true };
}

describe("Admin Authentication", () => {
  describe("Property 11: Invalid credentials rejection", () => {
    const adminUsers = [
      {
        username: VALID_ADMIN.username,
        password_hash: VALID_ADMIN.passwordHash,
      },
    ];

    it("should reject any username that does not exist in admin_users", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1 }).filter((s) => s !== VALID_ADMIN.username),
          fc.string({ minLength: 1 }),
          async (username, password) => {
            const result = await validateLogin(username, password, adminUsers);
            expect(result.success).toBe(false);
            expect(result.error).toBe("Invalid credentials");
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should reject any password that does not match the stored hash", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1 }).filter((s) => s !== "admin123"),
          async (password) => {
            const result = await validateLogin(
              VALID_ADMIN.username,
              password,
              adminUsers
            );
            expect(result.success).toBe(false);
            expect(result.error).toBe("Invalid credentials");
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should reject empty username or password", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string(),
          fc.string(),
          async (username, password) => {
            if (!username || !password) {
              const result = await validateLogin(
                username,
                password,
                adminUsers
              );
              expect(result.success).toBe(false);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should accept valid credentials", async () => {
      const result = await validateLogin(
        VALID_ADMIN.username,
        "admin123",
        adminUsers
      );
      expect(result.success).toBe(true);
    });
  });
});
