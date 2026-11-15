/* eslint-disable */
/**
 * GridWatch Comprehensive Multi-Role E2E Verification Suite
 * Verifies public routes, demo authentication for 3 roles, session persistence,
 * protected dashboard access, and cross-role boundary enforcement.
 */

const http = require("http");

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      "http://localhost:3000" + path,
      {
        method: options.method || "GET",
        headers: {
          "Accept": "text/html,application/json",
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch {}
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json,
          });
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function extractCookieHeader(res) {
  const setCookies = res.headers["set-cookie"] || [];
  return setCookies.map((c) => c.split(";")[0]).join("; ");
}

async function runSuite() {
  console.log("=================================================================");
  console.log("GRIDWATCH COMPREHENSIVE E2E VERIFICATION SUITE");
  console.log("=================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Public Routes Check
  console.log("--- 1. Testing Public Routes ---");
  const publicRoutes = ["/", "/about", "/contact", "/schedules", "/network", "/login", "/register"];
  for (const route of publicRoutes) {
    const res = await request(route);
    assert(res.statusCode === 200, `Public route ${route} returned HTTP 200`);
  }

  // 2. Unauthenticated Protected Route Redirect Check
  console.log("\n--- 2. Testing Unauthenticated Route Guard Boundaries ---");
  const unauthAdmin = await request("/admin");
  assert(
    unauthAdmin.statusCode === 307 || unauthAdmin.statusCode === 308 || unauthAdmin.statusCode === 302,
    `Unauthenticated /admin redirects (Status: ${unauthAdmin.statusCode})`
  );
  assert(
    unauthAdmin.headers.location?.includes("/login"),
    `Unauthenticated /admin redirects to login: ${unauthAdmin.headers.location}`
  );

  // 3. Admin Demo Login Flow
  console.log("\n--- 3. Testing Admin Demo Login Flow & Protected Dashboards ---");
  const adminLogin = await request("/api/auth/demo-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { role: "ADMIN" },
  });
  assert(adminLogin.statusCode === 200, `Admin Demo Login returned HTTP 200`);
  assert(adminLogin.json?.success === true, `Admin Demo Login success is true`);
  assert(adminLogin.json?.data?.redirectTo === "/admin", `Admin Demo Login redirectTo is /admin`);
  assert(adminLogin.json?.data?.user?.role === "ADMIN", `Admin user role verified as ADMIN`);

  const adminCookies = extractCookieHeader(adminLogin);
  assert(adminCookies.includes("gw_access_token"), `gw_access_token set in response`);

  // Verify Admin pages with cookie
  const adminPages = ["/admin", "/admin/users", "/admin/grid", "/admin/audit-logs", "/admin/payments"];
  for (const page of adminPages) {
    const res = await request(page, { headers: { Cookie: adminCookies } });
    assert(res.statusCode === 200, `Admin page ${page} accessible with session (HTTP 200)`);
  }

  // 4. Operator Demo Login Flow
  console.log("\n--- 4. Testing Operator Demo Login Flow & Protected Dashboards ---");
  const opLogin = await request("/api/auth/demo-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { role: "POWER_OPERATOR" },
  });
  assert(opLogin.statusCode === 200, `Operator Demo Login returned HTTP 200`);
  assert(opLogin.json?.data?.redirectTo === "/provider", `Operator Demo Login redirectTo is /provider`);
  assert(opLogin.json?.data?.user?.role === "POWER_OPERATOR", `Operator role verified as POWER_OPERATOR`);

  const opCookies = extractCookieHeader(opLogin);
  const opPages = ["/provider", "/provider/reports", "/provider/schedules", "/provider/technicians"];
  for (const page of opPages) {
    const res = await request(page, { headers: { Cookie: opCookies } });
    assert(res.statusCode === 200, `Operator page ${page} accessible with session (HTTP 200)`);
  }

  // 5. Customer Demo Login Flow
  console.log("\n--- 5. Testing Customer Demo Login Flow & Protected Dashboards ---");
  const userLogin = await request("/api/auth/demo-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { role: "CUSTOMER" },
  });
  assert(userLogin.statusCode === 200, `Customer Demo Login returned HTTP 200`);
  assert(userLogin.json?.data?.redirectTo === "/dashboard", `Customer Demo Login redirectTo is /dashboard`);
  assert(userLogin.json?.data?.user?.role === "CUSTOMER", `Customer role verified as CUSTOMER`);

  const userCookies = extractCookieHeader(userLogin);
  const userPages = ["/dashboard", "/dashboard/reports", "/dashboard/profile", "/dashboard/analytics", "/dashboard/billing"];
  for (const page of userPages) {
    const res = await request(page, { headers: { Cookie: userCookies } });
    assert(res.statusCode === 200, `Customer page ${page} accessible with session (HTTP 200)`);
  }

  // 6. Role Cross-Boundary Isolation Check
  console.log("\n--- 6. Testing Role-Based Cross-Boundary Isolation ---");
  const customerAtAdmin = await request("/admin", { headers: { Cookie: userCookies } });
  assert(
    customerAtAdmin.statusCode === 307 || customerAtAdmin.statusCode === 308 || customerAtAdmin.headers.location?.includes("unauthorized"),
    `Customer accessing /admin blocked with redirect: ${customerAtAdmin.headers.location}`
  );

  const customerAtProvider = await request("/provider", { headers: { Cookie: userCookies } });
  assert(
    customerAtProvider.statusCode === 307 || customerAtProvider.statusCode === 308 || customerAtProvider.headers.location?.includes("unauthorized"),
    `Customer accessing /provider blocked with redirect: ${customerAtProvider.headers.location}`
  );

  // 7. Session Validation & Logout
  console.log("\n--- 7. Testing Session Validation Endpoint & Logout ---");
  const sessionCheck = await request("/api/auth/session", { headers: { Cookie: adminCookies } });
  assert(sessionCheck.statusCode === 200, `/api/auth/session returned HTTP 200`);
  assert(sessionCheck.json?.authenticated === true, `/api/auth/session reports authenticated: true`);
  assert(sessionCheck.json?.user?.email === "admin@gridwatch.com", `/api/auth/session returns admin profile`);

  const logoutRes = await request("/api/auth/logout", {
    method: "POST",
    headers: { Cookie: adminCookies },
  });
  assert(logoutRes.statusCode === 200, `/api/auth/logout returned HTTP 200`);

  console.log("\n=================================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error("Test suite runtime error:", err);
  process.exit(1);
});
