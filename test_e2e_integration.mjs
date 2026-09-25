import assert from 'node:assert';

console.log('--- BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG TÍCH HỢP FRONTEND - BACKEND (E2E) ---');

async function runTests() {
  // Test 1: Frontend Server Health
  {
    console.log('\n[1] Kiểm tra máy chủ Frontend Vite (http://localhost:5173)...');
    const res = await fetch('http://localhost:5173/');
    assert.strictEqual(res.status, 200, 'Frontend server should respond with 200');
    const html = await res.text();
    assert.ok(html.includes('<div id="root"></div>'), 'HTML should contain root div');
    console.log('✔ Test 1 PASS: Frontend đang chạy bình thường tại http://localhost:5173/');
  }

  // Test 2: Backend Server Health
  {
    console.log('\n[2] Kiểm tra máy chủ Backend FastAPI (http://127.0.0.1:8000)...');
    const res = await fetch('http://127.0.0.1:8000/');
    assert.strictEqual(res.status, 200, 'Backend root should return 200');
    const body = await res.json();
    assert.deepStrictEqual(body, { message: 'Customer Management API is running' });
    console.log('✔ Test 2 PASS: Backend FastAPI phản hồi 200 OK: "Customer Management API is running"');
  }

  // Test 3: CORS Header Verification
  {
    console.log('\n[3] Kiểm tra CORS Header giữa Frontend và Backend...');
    const res = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert.ok(allowOrigin === '*' || allowOrigin === 'http://localhost:5173', 'CORS origin must allow frontend');
    console.log(`✔ Test 3 PASS: CORS Header hợp lệ: Access-Control-Allow-Origin = ${allowOrigin}`);
  }

  // Test 4: Đăng nhập thành công với tài khoản Admin
  {
    console.log('\n[4] Kiểm thử kịch bản: Đăng nhập THÀNH CÔNG (admin@gmail.com / 123456)...');
    const res = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: '123456',
      }),
    });
    assert.strictEqual(res.status, 200, 'HTTP status must be 200 OK');
    const data = await res.json();

    assert.strictEqual(data.success, true, 'Property success must be true');
    assert.strictEqual(data.token_type, 'bearer', 'token_type must be bearer');
    assert.ok(typeof data.access_token === 'string' && data.access_token.startsWith('eyJ'), 'Must contain valid JWT');
    assert.strictEqual(data.user.id, 1);
    assert.strictEqual(data.user.email, 'admin@gmail.com');
    assert.strictEqual(data.user.full_name, 'Admin');
    assert.strictEqual(data.user.role, 'ADMIN');

    console.log('✔ Test 4 PASS: Đăng nhập thành công! Nhận JWT token và thông tin User:');
    console.log(`   - Token prefix: ${data.access_token.substring(0, 30)}...`);
    console.log(`   - User: ${data.user.full_name} (${data.user.email}), Role: ${data.user.role}`);
  }

  // Test 5: Đăng nhập thất bại do sai mật khẩu (401 Unauthorized)
  {
    console.log('\n[5] Kiểm thử kịch bản: Sai mật khẩu (admin@gmail.com / sai-mat-khau)...');
    const res = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'sai-mat-khau',
      }),
    });
    assert.strictEqual(res.status, 401, 'Status must be 401 Unauthorized');
    const data = await res.json();
    assert.strictEqual(data.detail, 'Email hoặc mật khẩu không đúng');
    console.log('✔ Test 5 PASS: Backend trả về đúng mã lỗi 401 Unauthorized và thông báo lỗi:');
    console.log(`   - Detail: "${data.detail}"`);
  }

  // Test 6: Đăng nhập thất bại do email không tồn tại
  {
    console.log('\n[6] Kiểm thử kịch bản: Email không tồn tại (notfound@gmail.com / 123456)...');
    const res = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'notfound@gmail.com',
        password: '123456',
      }),
    });
    assert.strictEqual(res.status, 401, 'Status must be 401');
    const data = await res.json();
    assert.strictEqual(data.detail, 'Email hoặc mật khẩu không đúng');
    console.log('✔ Test 6 PASS: Backend trả về 401 Unauthorized bảo mật (không tiết lộ sự tồn tại của email)');
  }

  // Test 7: Kiểm thử định dạng email sai (Validation 422)
  {
    console.log('\n[7] Kiểm thử kịch bản: Email sai định dạng (dinh-dang-sai / 123456)...');
    const res = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'dinh-dang-sai',
        password: '123456',
      }),
    });
    assert.strictEqual(res.status, 422, 'Status must be 422 Unprocessable Entity');
    console.log('✔ Test 7 PASS: Backend từ chối với mã 422 Unprocessable Entity do Pydantic validate');
  }

  console.log('\n================================================================');
  console.log('🎉 TOÀN BỘ 7 KỊCH BẢN KIỂM THỬ TỰ ĐỘNG E2E ĐÃ VƯỢT QUA (100% PASSED)!');
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error('❌ Kiểm thử thất bại:', err);
  process.exit(1);
});
