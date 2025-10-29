import { POST as registerHandler } from "@/app/api/auth/register/route";
import { POST as loginHandler } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";

describe("Auth API", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // clean test users
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "SuperSecure123!"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const res = await registerHandler(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.ok).toBe(true);
    expect(data.user.email).toBe("test@example.com");
  });

  it("should not allow duplicate registration", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "AnotherPass123!"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const res = await registerHandler(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toContain("Email already registered");
  });

  it("should login successfully", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "SuperSecure123!"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const res = await loginHandler(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
  });

  it("should fail login with invalid password", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "WrongPassword"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const res = await loginHandler(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toContain("Invalid credentials");
  });

  it("should fail login for non-existent user", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "notfound@example.com",
        password: "SomePassword"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const res = await loginHandler(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toContain("Invalid credentials");
  });
});
