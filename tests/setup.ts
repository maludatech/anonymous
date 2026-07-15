import { afterAll, afterEach, beforeAll, vi } from "vitest";
import mongoose from "mongoose";

vi.mock("@/lib/email", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
  sendResetEmail: vi.fn().mockResolvedValue(undefined),
}));

beforeAll(() => {
  process.env.MONGODB_URI =
    process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017/anonymous_test";
  process.env.JWT_SECRET = "test-secret-do-not-use-in-production";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
