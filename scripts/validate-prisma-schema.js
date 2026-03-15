const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schema = fs.readFileSync(schemaPath, 'utf8');

function assertContains(regex, message) {
  if (!regex.test(schema)) {
    console.error(`❌ ${message}`);
    process.exit(1);
  }
}

const requiredEnums = [
  'enum UserRole',
  'enum CourseType',
  'enum CompletionStatus',
  'enum JobPostingStatus',
  'enum JobApplicationStatus',
  'enum LeaveRequestStatus',
];

for (const enumDecl of requiredEnums) {
  assertContains(new RegExp(`\\b${enumDecl}\\b`), `Missing required enum: ${enumDecl}`);
}

const requiredModels = [
  'model User',
  'model Course',
  'model Module',
  'model Topic',
  'model Enrollment',
  'model TopicProgress',
  'model JobPosting',
  'model JobApplication',
  'model LeaveRequest',
];

for (const modelDecl of requiredModels) {
  assertContains(new RegExp(`\\b${modelDecl}\\b`), `Missing required model: ${modelDecl}`);
}

assertContains(/user\s+User\s+@relation\(fields:\s*\[userId\],\s*references:\s*\[id\]/, 'Missing user relation by userId');
assertContains(/course\s+Course\s+@relation\(fields:\s*\[courseId\],\s*references:\s*\[id\]/, 'Missing course relation by courseId');
assertContains(/module\s+Module\s+@relation\(fields:\s*\[moduleId\],\s*references:\s*\[id\]/, 'Missing module relation by moduleId');
assertContains(/topic\s+Topic\s+@relation\(fields:\s*\[topicId\],\s*references:\s*\[id\]/, 'Missing topic relation by topicId');
assertContains(/jobPosting\s+JobPosting\s+@relation\(fields:\s*\[jobPostingId\],\s*references:\s*\[id\]/, 'Missing jobPosting relation by jobPostingId');

assertContains(/@@unique\(\[userId,\s*courseId\]\)/, 'Missing Enrollment composite unique constraint');
assertContains(/@@unique\(\[userId,\s*topicId\]\)/, 'Missing TopicProgress composite unique constraint');
assertContains(/@@unique\(\[userId,\s*jobPostingId\]\)/, 'Missing JobApplication composite unique constraint');

console.log('✅ Prisma schema structure check passed');
