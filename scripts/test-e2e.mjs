// vxlious End-to-End Automated Verification Script
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("🧪 Starting vxlious End-to-End Test Suite...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Landing Page
    console.log("1. Testing Public Landing Page (/)");
    const homeRes = await fetch(`${BASE_URL}/`);
    assert(homeRes.status === 200, "Landing page returns 200 OK");
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes("vxlious"), "HTML includes brand name 'vxlious'");
    assert(homeHtml.includes("Your academic archive"), "HTML includes headline 'Your academic archive.'");

    // Test 2: Archive Directory Page
    console.log("\n2. Testing Subject Archive Directory (/archive)");
    const archiveRes = await fetch(`${BASE_URL}/archive`);
    assert(archiveRes.status === 200, "Archive page returns 200 OK");
    const archiveHtml = await archiveRes.text();
    assert(archiveHtml.includes("Mathematics"), "Contains Mathematics subject");
    assert(archiveHtml.includes("Physics"), "Contains Physics subject");

    // Test 3: Unauthenticated Access Guard on Admin Route
    console.log("\n3. Testing Security Protection on Admin API");
    const unauthAdminRes = await fetch(`${BASE_URL}/api/admin/resources`);
    assert(
      unauthAdminRes.status === 401 || unauthAdminRes.status === 403,
      `Unauthenticated access to /api/admin/resources is blocked (${unauthAdminRes.status})`
    );

    // Test 4: Student Authentication
    console.log("\n4. Testing Student Login (/api/auth/login)");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "student@vxlious.kz",
        password: "Password123!",
      }),
    });
    assert(loginRes.status === 200, "Student authentication successful (200 OK)");
    const studentCookie = loginRes.headers.get("set-cookie");
    assert(!!studentCookie, "Received HTTP-only session cookie");
    const studentData = await loginRes.json();
    assert(studentData.user.studentStatus === "verified", "Student status is 'verified'");

    // Test 5: Student Accessing Admin Route (Forbidden Check)
    console.log("\n5. Testing Role-Based Access Control (Student calling Admin API)");
    const studentAdminRes = await fetch(`${BASE_URL}/api/admin/resources`, {
      headers: { Cookie: studentCookie || "" },
    });
    assert(
      studentAdminRes.status === 401 || studentAdminRes.status === 403,
      `Student is strictly blocked from /api/admin/resources (${studentAdminRes.status})`
    );

    // Test 6: Secure File Access - Unlocked Document
    console.log("\n6. Testing Secure PDF Viewer Token Generation & Streaming");
    // Find unlocked resource
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: studentCookie || "" },
    });
    const meData = await meRes.json();

    // Call token generation for the pre-granted demo resource
    // Fetch resources to get the first resource ID
    const sampleTokenRes = await fetch(`${BASE_URL}/api/secure-file/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie || "",
      },
      body: JSON.stringify({ resourceId: "dummy-non-existent" }),
    });
    assert(sampleTokenRes.status === 403, "Access to non-unlocked resource returns 403 Forbidden");

    // Test 7: Direct file stream without token (Security Check)
    console.log("\n7. Testing Direct File Streaming URL Protection");
    const directStreamRes = await fetch(`${BASE_URL}/api/secure-file/stream?resourceId=dummy`);
    assert(
      directStreamRes.status === 401 || directStreamRes.status === 403,
      `Direct stream request without token is rejected (${directStreamRes.status})`
    );

    // Test 8: Admin Authentication & Management
    console.log("\n8. Testing Super Admin Authentication & Dashboard APIs");
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@vxlious.kz",
        password: "Password123!",
      }),
    });
    assert(adminLoginRes.status === 200, "Admin login successful (200 OK)");
    const adminCookie = adminLoginRes.headers.get("set-cookie");
    const adminData = await adminLoginRes.json();
    assert(adminData.user.role === "super_admin", "Admin role confirmed as 'super_admin'");

    // Admin calling /api/admin/resources
    const adminResourcesRes = await fetch(`${BASE_URL}/api/admin/resources`, {
      headers: { Cookie: adminCookie || "" },
    });
    assert(adminResourcesRes.status === 200, "Admin successfully accessed /api/admin/resources (200 OK)");
    const resourcesData = await adminResourcesRes.json();
    assert(Array.isArray(resourcesData.resources) && resourcesData.resources.length > 0, `Retrieved ${resourcesData.resources?.length} authorized archives`);

    const firstResource = resourcesData.resources[0];
    console.log(`   Inspecting resource: ${firstResource.title} (${firstResource.id})`);

    // Admin requesting signed token for the resource
    const adminTokenRes = await fetch(`${BASE_URL}/api/secure-file/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie || "",
      },
      body: JSON.stringify({ resourceId: firstResource.id, scope: "pdf_view" }),
    });
    assert(adminTokenRes.status === 200, "Admin generated signed token for PDF streaming");
    const tokenData = await adminTokenRes.json();
    assert(!!tokenData.token, "Ephemeral signed token received");

    // Stream the actual PDF with the signed token
    const streamRes = await fetch(
      `${BASE_URL}/api/secure-file/stream?token=${encodeURIComponent(tokenData.token)}&resourceId=${encodeURIComponent(firstResource.id)}`
    );
    assert(streamRes.status === 200, "PDF stream responded with 200 OK");
    assert(
      streamRes.headers.get("content-type") === "application/pdf",
      `Stream Content-Type is application/pdf (${streamRes.headers.get("content-type")})`
    );
    assert(
      streamRes.headers.get("cache-control")?.includes("private"),
      `Cache-Control header contains 'private' (${streamRes.headers.get("cache-control")})`
    );
    const pdfBuffer = await streamRes.arrayBuffer();
    const pdfText = Buffer.from(pdfBuffer).toString("utf8", 0, 8);
    assert(pdfText.startsWith("%PDF-1.4"), `Stream payload is valid PDF binary (${pdfText})`);

    // Test 9: Student Registration
    console.log("\n9. Testing Student Registration API");
    const uniqueEmail = `test_student_${Date.now()}@nis.edu.kz`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Bauyrzhan",
        lastName: "Momyshuly",
        email: uniqueEmail,
        phoneNumber: "+7 777 999 8877",
        password: "Password123!",
        school: "NIS Taraz",
        grade: "10",
      }),
    });
    assert(regRes.status === 201, `New student registered with status 201 (${regRes.status})`);
    const regData = await regRes.json();
    assert(regData.user.studentStatus === "unverified", "New student default status is 'unverified'");

    // Test 10: Support Ticket Submission
    console.log("\n10. Testing Support Ticket API");
    const ticketRes = await fetch(`${BASE_URL}/api/support/ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie || "",
      },
      body: JSON.stringify({
        category: "Resource issue",
        subject: "Question about Mathematics Q2 problem 4",
        message: "Can you confirm if vector dot product criteria is included in 2025 assessment?",
      }),
    });
    assert(ticketRes.status === 200, "Support ticket submitted successfully (200 OK)");

    console.log("\n========================================================");
    console.log(`🏁 Test Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log("========================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  }
}

runTests();
