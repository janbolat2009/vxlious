import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function createMinimalPdfBuffer(title, subject, quarter, academicYear) {
  const content = `BT
/F1 20 Tf
50 720 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(Subject: ${subject} | Quarter: ${quarter} | Academic Year: ${academicYear}) Tj
0 -20 Td
(vxlious - Authorized Educational Archive - Official Previous-Year Study Material) Tj
0 -35 Td
(LEGAL NOTICE: This document contains authorized previous-year practice material) Tj
0 -15 Td
(for academic preparation. Unauthorized distribution or copying is strictly prohibited.) Tj
0 -40 Td
(Section 1: Conceptual Understanding & Theoretical Foundations) Tj
0 -25 Td
(1. Analyze the primary fundamental principles governing the core mechanisms studied.) Tj
0 -20 Td
(2. Evaluate standard case conditions and calculate the expected empirical metrics.) Tj
0 -20 Td
(3. Formulate the comprehensive synthesis of model parameters according to criteria.) Tj
0 -40 Td
(Section 2: Practical Application & Assessment Simulation) Tj
0 -25 Td
(4. Solve multi-variable equations with full analytical proof and intermediate steps.) Tj
0 -20 Td
(5. Review structured problem sets and reference historical assessment trends.) Tj
0 -30 Td
(Prepared for verified vxlious academic members.) Tj
ET`;

  const streamLength = Buffer.byteLength(content, "utf8");

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${content}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000226 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
380
%%EOF`;

  return Buffer.from(pdf, "utf8");
}

async function main() {
  console.log("🌱 Starting vxlious database seeding...");

  // Ensure storage folders
  const storageBase = path.resolve(process.cwd(), "data", "storage", "private");
  const resourceDir = path.join(storageBase, "resources");
  const receiptsDir = path.join(storageBase, "receipts");
  const verificationsDir = path.join(storageBase, "verifications");

  fs.mkdirSync(resourceDir, { recursive: true });
  fs.mkdirSync(receiptsDir, { recursive: true });
  fs.mkdirSync(verificationsDir, { recursive: true });

  // 1. Academic Years
  const yearsData = [
    { name: "2025–2026", code: "2025-2026", isCurrent: true },
    { name: "2024–2025", code: "2024-2025", isCurrent: false },
    { name: "2023–2024", code: "2023-2024", isCurrent: false },
  ];

  const academicYears = {};
  for (const y of yearsData) {
    academicYears[y.code] = await prisma.academicYear.upsert({
      where: { code: y.code },
      update: y,
      create: y,
    });
  }

  // 2. Quarters
  const quarters = {};
  for (let q = 1; q <= 4; q++) {
    quarters[q] = await prisma.quarter.upsert({
      where: { quarterNumber: q },
      update: { name: `Quarter ${q}`, quarterNumber: q },
      create: { name: `Quarter ${q}`, quarterNumber: q },
    });
  }

  // 3. Subjects
  const subjectsData = [
    { name: "Mathematics", slug: "mathematics", code: "MATH", icon: "Calculator", sortOrder: 1, description: "Advanced calculus, algebra, geometry, and trigonometry problem archives." },
    { name: "Physics", slug: "physics", code: "PHYS", icon: "Atom", sortOrder: 2, description: "Mechanics, thermodynamics, electrodynamics, and wave optics materials." },
    { name: "Chemistry", slug: "chemistry", code: "CHEM", icon: "FlaskConical", sortOrder: 3, description: "Organic, inorganic, and physical chemistry authorized revision guides." },
    { name: "Biology", slug: "biology", code: "BIO", icon: "Dna", sortOrder: 4, description: "Cellular biology, genetics, physiology, and ecology practice papers." },
    { name: "Informatics", slug: "informatics", code: "CS", icon: "Code", sortOrder: 5, description: "Algorithms, data structures, Python, and computer architecture." },
    { name: "World History", slug: "world-history", code: "WHIST", icon: "Globe", sortOrder: 6, description: "Chronological analysis, primary sources, and comparative historical essays." },
    { name: "Kazakhstan History", slug: "kazakhstan-history", code: "KZHIST", icon: "Landmark", sortOrder: 7, description: "Ancient to modern statehood development and cultural heritage." },
    { name: "English Language", slug: "english-language", code: "ENG", icon: "BookOpen", sortOrder: 8, description: "Academic reading comprehension, grammar structures, and formal writing." },
    { name: "Kazakh Language", slug: "kazakh-language", code: "KAZ", icon: "Languages", sortOrder: 9, description: "Syntax, literary analysis, and formal stylistics archive." },
    { name: "Russian Language", slug: "russian-language", code: "RUS", icon: "Scroll", sortOrder: 10, description: "Orthography, literary textual analysis, and essay structures." },
  ];

  const subjects = {};
  for (const s of subjectsData) {
    subjects[s.slug] = await prisma.subject.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 4. Create Default Users
  const passwordHash = await bcrypt.hash("Password123!", 12);

  // Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@vxlious.kz" },
    update: {
      role: "super_admin",
      studentStatus: "verified",
    },
    create: {
      email: "admin@vxlious.kz",
      passwordHash,
      firstName: "Alikhan",
      lastName: "Bokeikhanov",
      phoneNumber: "+7 777 000 0001",
      school: "Academic Archive Administration",
      grade: "Staff",
      role: "super_admin",
      studentStatus: "verified",
      isActive: true,
    },
  });

  // Verified Demo Student
  const studentUser = await prisma.user.upsert({
    where: { email: "student@vxlious.kz" },
    update: {
      role: "student",
      studentStatus: "verified",
    },
    create: {
      email: "student@vxlious.kz",
      passwordHash,
      firstName: "Dias",
      lastName: "Nurmukhametov",
      phoneNumber: "+7 701 555 1234",
      school: "Nazarbayev Intellectual School",
      grade: "11",
      role: "student",
      studentStatus: "verified",
      isActive: true,
    },
  });

  // Pending Applicant
  const applicantUser = await prisma.user.upsert({
    where: { email: "applicant@vxlious.kz" },
    update: {
      role: "student",
      studentStatus: "pending",
    },
    create: {
      email: "applicant@vxlious.kz",
      passwordHash,
      firstName: "Amina",
      lastName: "Kassymova",
      phoneNumber: "+7 705 333 4455",
      school: "Haileybury Almaty",
      grade: "10",
      role: "student",
      studentStatus: "pending",
      isActive: true,
    },
  });

  // Create verification document record for applicant
  const sampleVerificationDocName = "applicant_student_id.pdf";
  const sampleVerificationPath = path.join(verificationsDir, sampleVerificationDocName);
  fs.writeFileSync(sampleVerificationPath, createMinimalPdfBuffer("Student ID Verification", "Verification", "1", "2025"));

  await prisma.studentVerification.create({
    data: {
      userId: applicantUser.id,
      studentIdNumber: "STU-2025-0894",
      documentPath: `verifications/${sampleVerificationDocName}`,
      documentName: "Amina_Student_ID_2025.pdf",
      mimeType: "application/pdf",
      fileSize: 1024,
      status: "pending",
    },
  });

  // 5. Create System Settings
  const settings = [
    {
      key: "PAYMENT_INSTRUCTIONS",
      value: `Please transfer the exact amount via Kaspi QR or Kaspi Gold to:
Phone: +7 (777) 000-0001
Recipient: Alikhan B. (vxlious Academic Archive)
Comment: Enter your Order ID (e.g. ORD-XXXXXX).
After payment, attach your payment receipt screenshot or PDF below. Verification is completed within 15–30 minutes during archive working hours.`,
      description: "Instructions shown to students on the purchase checkout screen",
    },
    {
      key: "SUPPORT_CONTACT",
      value: "support@vxlious.kz | Telegram: @vxlious_archive",
      description: "Official support channels",
    },
  ];

  for (const st of settings) {
    await prisma.systemSetting.upsert({
      where: { key: st.key },
      update: st,
      create: st,
    });
  }

  // 6. Resources Creation
  const resourcesToCreate = [
    {
      title: "Mathematics Grade 10 - Summative Practice Archive",
      subjectSlug: "mathematics",
      yearCode: "2025-2026",
      quarterNum: 1,
      documentType: "Practice Paper",
      price: 2000,
      description: "Authorized previous-year summative assessment archive for Grade 10 Mathematics. Includes functions, trigonometry, and coordinate geometry practice questions.",
      pageCount: 14,
    },
    {
      title: "Mathematics Grade 10 - Analytical Geometry & Vectors",
      subjectSlug: "mathematics",
      yearCode: "2025-2026",
      quarterNum: 2,
      documentType: "Sample Assessment",
      price: 2000,
      description: "Comprehensive previous-year revision set covering analytic geometry in space, vector dot products, and line-plane equations.",
      pageCount: 18,
    },
    {
      title: "Physics Grade 11 - Mechanics & Kinematics Revision Pack",
      subjectSlug: "physics",
      yearCode: "2025-2026",
      quarterNum: 1,
      documentType: "Revision PDF",
      price: 2500,
      description: "Authorized archived practice problems covering rotational dynamics, momentum conservation, and harmonic oscillations.",
      pageCount: 22,
    },
    {
      title: "Chemistry Grade 11 - Chemical Thermodynamics & Kinetics",
      subjectSlug: "chemistry",
      yearCode: "2025-2026",
      quarterNum: 2,
      documentType: "Practice Paper",
      price: 2200,
      description: "Previous-year structured assessment preparation for Gibbs free energy, enthalpy diagrams, and rate laws.",
      pageCount: 16,
    },
    {
      title: "Biology Grade 10 - Molecular Genetics & DNA Replication",
      subjectSlug: "biology",
      yearCode: "2025-2026",
      quarterNum: 1,
      documentType: "Sample Assessment",
      price: 1800,
      description: "Authorized archive on nucleic acid synthesis, transcription regulation, and recombinant DNA technology.",
      pageCount: 12,
    },
    {
      title: "Informatics Grade 10 - Data Structures & Complexity",
      subjectSlug: "informatics",
      yearCode: "2025-2026",
      quarterNum: 2,
      documentType: "Authorized Archive",
      price: 2400,
      description: "Past assessment questions on graph traversals, binary search trees, and asymptotic time complexity.",
      pageCount: 20,
    },
    {
      title: "World History Grade 11 - Modern Geopolitical Epochs",
      subjectSlug: "world-history",
      yearCode: "2024-2025",
      quarterNum: 3,
      documentType: "Revision PDF",
      price: 1500,
      description: "Archived historical document synthesis and structured essay questions on 20th century international treaties.",
      pageCount: 15,
    },
    {
      title: "Kazakhstan History Grade 10 - Constitutional Development",
      subjectSlug: "kazakhstan-history",
      yearCode: "2025-2026",
      quarterNum: 1,
      documentType: "Sample Assessment",
      price: 1800,
      description: "Authorized historical assessment archive analyzing socio-economic transformations and state milestones.",
      pageCount: 16,
    },
    {
      title: "English Academic Writing - C1 Assessment Preparation",
      subjectSlug: "english-language",
      yearCode: "2025-2026",
      quarterNum: 2,
      documentType: "Practice Paper",
      price: 2000,
      description: "Formal discursive essays, text analysis, synthesis matrices, and academic register practice.",
      pageCount: 18,
    },
  ];

  let firstCreatedResource = null;

  for (const r of resourcesToCreate) {
    const filename = `${r.subjectSlug}-q${r.quarterNum}-${r.yearCode}.pdf`;
    const storageKey = `resources/${filename}`;
    const filePath = path.join(resourceDir, filename);

    // Write real sample PDF buffer
    const pdfBuf = createMinimalPdfBuffer(r.title, r.subjectSlug, `Quarter ${r.quarterNum}`, r.yearCode);
    fs.writeFileSync(filePath, pdfBuf);

    const created = await prisma.resource.create({
      data: {
        title: r.title,
        description: r.description,
        subjectId: subjects[r.subjectSlug].id,
        academicYearId: academicYears[r.yearCode].id,
        quarterId: quarters[r.quarterNum].id,
        documentType: r.documentType,
        filePath: storageKey,
        fileName: filename,
        fileSize: pdfBuf.length,
        pageCount: r.pageCount,
        price: r.price,
        isPublished: true,
        authorizationStatus: "Authorized",
      },
    });

    if (!firstCreatedResource) {
      firstCreatedResource = created;
    }
  }

  // 7. Grant the first resource access to the demo verified student
  if (firstCreatedResource) {
    const demoOrder = await prisma.order.create({
      data: {
        userId: studentUser.id,
        resourceId: firstCreatedResource.id,
        amount: firstCreatedResource.price,
        currency: "KZT",
        status: "approved",
        adminNotes: "Auto-approved demo access for testing",
      },
    });

    await prisma.resourceAccess.create({
      data: {
        userId: studentUser.id,
        resourceId: firstCreatedResource.id,
        orderId: demoOrder.id,
        status: "active",
      },
    });

    await prisma.notification.create({
      data: {
        userId: studentUser.id,
        title: "Welcome to vxlious",
        message: `Your student status is verified. You have full access to ${firstCreatedResource.title} in your Library.`,
        type: "success",
        link: `/library`,
      },
    });
  }

  // 8. Add an initial audit log
  await prisma.auditLog.create({
    data: {
      adminId: adminUser.id,
      action: "SYSTEM_INITIALIZED",
      targetType: "Setting",
      targetId: "SYSTEM",
      details: JSON.stringify({ message: "vxlious academic archive platform initialized with default subjects and resources." }),
    },
  });

  console.log("✅ vxlious database seeded successfully!");
  console.log("Credentials:");
  console.log("  Super Admin: admin@vxlious.kz / Password123!");
  console.log("  Verified Student: student@vxlious.kz / Password123!");
  console.log("  Applicant Student: applicant@vxlious.kz / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
