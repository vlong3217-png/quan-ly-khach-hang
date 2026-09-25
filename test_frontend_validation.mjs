import assert from 'node:assert';

// Validation helpers copied from LoginPage.tsx for isolated testing
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data) {
  const errors = {};

  if (!data.email.trim()) {
    errors.email = 'Vui lòng nhập email hoặc tên đăng nhập.';
  } else if (data.email.includes('@') && !EMAIL_REGEX.test(data.email)) {
    errors.email = 'Email không đúng định dạng.';
  }

  if (!data.password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  }

  return errors;
}

console.log('--- BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG FRONTEND VALIDATION ---');

// Test 1: Empty email and password
{
  const errors = validateForm({ email: '', password: '', rememberMe: false });
  assert.strictEqual(errors.email, 'Vui lòng nhập email hoặc tên đăng nhập.');
  assert.strictEqual(errors.password, 'Vui lòng nhập mật khẩu.');
  console.log('✔ Test 1 PASS: Form rỗng hiển thị đủ 2 lỗi email và mật khẩu');
}

// Test 2: Whitespace email
{
  const errors = validateForm({ email: '   ', password: '123' });
  assert.strictEqual(errors.email, 'Vui lòng nhập email hoặc tên đăng nhập.');
  assert.strictEqual(errors.password, undefined);
  console.log('✔ Test 2 PASS: Email toàn dấu cách bị từ chối');
}

// Test 3: Invalid email format with @
{
  const invalidEmails = ['user@', 'user@domain', '@domain.com', 'user@.com'];
  for (const email of invalidEmails) {
    const errors = validateForm({ email, password: 'password123' });
    assert.strictEqual(errors.email, 'Email không đúng định dạng.', `Failed for: ${email}`);
  }
  console.log('✔ Test 3 PASS: Email sai định dạng (có @ nhưng thiếu domain/tld) bị từ chối');
}

// Test 4: Valid email
{
  const validEmails = ['admin@gmail.com', 'test.user@company.vn', 'user123@sub.domain.org'];
  for (const email of validEmails) {
    const errors = validateForm({ email, password: 'password123' });
    assert.strictEqual(Object.keys(errors).length, 0, `Failed for valid email: ${email}`);
  }
  console.log('✔ Test 4 PASS: Email hợp lệ vượt qua validate');
}

// Test 5: Username without @ (e.g. login with username)
{
  const errors = validateForm({ email: 'administrator', password: 'password123' });
  assert.strictEqual(Object.keys(errors).length, 0);
  console.log('✔ Test 5 PASS: Đăng nhập bằng username không chứa @ hợp lệ');
}

console.log('===> TOÀN BỘ 5 TEST CASES FRONTEND VALIDATION ĐÃ VƯỢT QUA! (PASSED)\n');
