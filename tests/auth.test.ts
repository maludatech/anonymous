import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST as signUp } from "@/app/api/auth/sign-up/route";
import { POST as signIn } from "@/app/api/auth/sign-in/route";
import { POST as verifyEmail } from "@/app/api/auth/verify-email/route";
import { GET as getMessages } from "@/app/api/messages/[username]/route";
import EmailVerificationToken from "@/models/EmailVerificationTokens";
import User from "@/models/Users";
import crypto from "crypto";

function jsonRequest(url: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

async function createVerifiedUser(username: string, email: string, password: string) {
  await signUp(
    jsonRequest("http://localhost/api/auth/sign-up", { username, email, password })
  );
  const user = await User.findOne({ email: email.toLowerCase() });
  const verificationToken = await EmailVerificationToken.findOne({ userId: user!._id });
  // Re-derive the raw token isn't possible from the hash, so verify directly via the model.
  user!.emailVerified = true;
  await user!.save();
  await EmailVerificationToken.deleteMany({ userId: user!._id });
  return user!;
}

describe("POST /api/auth/sign-up", () => {
  it("creates an unverified user and returns 201", async () => {
    const res = await signUp(
      jsonRequest("http://localhost/api/auth/sign-up", {
        username: "alice",
        email: "alice@example.com",
        password: "password123",
      })
    );
    expect(res.status).toBe(201);

    const user = await User.findOne({ email: "alice@example.com" });
    expect(user).not.toBeNull();
    expect(user!.emailVerified).toBe(false);

    const token = await EmailVerificationToken.findOne({ userId: user!._id });
    expect(token).not.toBeNull();
  });

  it("rejects a duplicate username", async () => {
    await signUp(
      jsonRequest("http://localhost/api/auth/sign-up", {
        username: "bob",
        email: "bob@example.com",
        password: "password123",
      })
    );
    const res = await signUp(
      jsonRequest("http://localhost/api/auth/sign-up", {
        username: "bob",
        email: "different@example.com",
        password: "password123",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects an invalid password (too short)", async () => {
    const res = await signUp(
      jsonRequest("http://localhost/api/auth/sign-up", {
        username: "carol",
        email: "carol@example.com",
        password: "short",
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/sign-in", () => {
  it("blocks sign-in for an unverified account", async () => {
    await signUp(
      jsonRequest("http://localhost/api/auth/sign-up", {
        username: "dave",
        email: "dave@example.com",
        password: "password123",
      })
    );
    const res = await signIn(
      jsonRequest("http://localhost/api/auth/sign-in", {
        email: "dave@example.com",
        password: "password123",
      })
    );
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.code).toBe("EMAIL_NOT_VERIFIED");
  });

  it("rejects the wrong password", async () => {
    await createVerifiedUser("erin", "erin@example.com", "password123");
    const res = await signIn(
      jsonRequest("http://localhost/api/auth/sign-in", {
        email: "erin@example.com",
        password: "wrongpassword",
      })
    );
    expect(res.status).toBe(401);
  });

  it("issues a token for a verified user with correct credentials", async () => {
    await createVerifiedUser("frank", "frank@example.com", "password123");
    const res = await signIn(
      jsonRequest("http://localhost/api/auth/sign-in", {
        email: "frank@example.com",
        password: "password123",
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.token).toBeTruthy();
    expect(data.user.username).toBe("frank");
  });
});

describe("POST /api/auth/verify-email", () => {
  it("verifies a valid token and allows sign-in afterward", async () => {
    await signUp(
      jsonRequest("http://localhost/api/auth/sign-up", {
        username: "grace",
        email: "grace@example.com",
        password: "password123",
      })
    );
    const user = await User.findOne({ email: "grace@example.com" });

    // Simulate the token the way sign-up does: generate + store + verify with the raw value.
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    await EmailVerificationToken.deleteMany({ userId: user!._id });
    await EmailVerificationToken.create({
      userId: user!._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const res = await verifyEmail(
      jsonRequest("http://localhost/api/auth/verify-email", {
        email: "grace@example.com",
        token: rawToken,
      })
    );
    expect(res.status).toBe(200);

    const updated = await User.findOne({ email: "grace@example.com" });
    expect(updated!.emailVerified).toBe(true);
  });

  it("rejects an invalid token", async () => {
    await signUp(
      jsonRequest("http://localhost/api/auth/sign-up", {
        username: "heidi",
        email: "heidi@example.com",
        password: "password123",
      })
    );
    const res = await verifyEmail(
      jsonRequest("http://localhost/api/auth/verify-email", {
        email: "heidi@example.com",
        token: "not-a-real-token",
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("GET /api/messages/[username] (auth check)", () => {
  it("rejects requests with no token", async () => {
    const req = new NextRequest("http://localhost/api/messages/ivan");
    const res = await getMessages(req, {
      params: Promise.resolve({ username: "ivan" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects a valid token for a different user's inbox", async () => {
    await createVerifiedUser("judy", "judy@example.com", "password123");
    await createVerifiedUser("mallory", "mallory@example.com", "password123");

    const signInRes = await signIn(
      jsonRequest("http://localhost/api/auth/sign-in", {
        email: "judy@example.com",
        password: "password123",
      })
    );
    const { token } = await signInRes.json();

    const req = new NextRequest("http://localhost/api/messages/mallory", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await getMessages(req, {
      params: Promise.resolve({ username: "mallory" }),
    });
    expect(res.status).toBe(403);
  });

  it("returns the owner's own messages with a valid token", async () => {
    await createVerifiedUser("oscar", "oscar@example.com", "password123");
    const signInRes = await signIn(
      jsonRequest("http://localhost/api/auth/sign-in", {
        email: "oscar@example.com",
        password: "password123",
      })
    );
    const { token } = await signInRes.json();

    const req = new NextRequest("http://localhost/api/messages/oscar", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await getMessages(req, {
      params: Promise.resolve({ username: "oscar" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.messages).toEqual([]);
    expect(data.total).toBe(0);
  });
});
