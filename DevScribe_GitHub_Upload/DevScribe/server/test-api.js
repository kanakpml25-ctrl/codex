const app = require('./server');

const PORT = 5001; // Test on port 5001 to avoid conflicting with active servers

async function runTests() {
  const server = app.listen(PORT, async () => {
    console.log(`\n=================================================`);
    console.log(`🧪 Running Comprehensive DevScribe API Test Suite`);
    console.log(`=================================================\n`);

    const BASE_URL = `http://localhost:${PORT}/api`;
    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
      try {
        await fn();
        console.log(`✅ PASS: ${name}`);
        passed++;
      } catch (err) {
        console.error(`❌ FAIL: ${name} ->`, err.message);
        failed++;
      }
    }

    try {
      // 1. Health Check
      await test('GET /api/health returns status ok', async () => {
        const res = await fetch(`${BASE_URL}/health`);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error('Health check status was not ok');
      });

      // 2. Strict Email Validation Test
      await test('POST /api/auth/send-otp rejects invalid email format', async () => {
        const res = await fetch(`${BASE_URL}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Priya Sharma',
            email: 'notanemail',
            password: 'StrongPassword123!'
          })
        });
        if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
      });

      // 3. Strict Password Validation Test
      await test('POST /api/auth/send-otp rejects weak password', async () => {
        const res = await fetch(`${BASE_URL}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Priya Sharma',
            email: 'valid@example.com',
            password: 'weak'
          })
        });
        if (res.status !== 400) throw new Error(`Expected 400 Bad Request for weak password, got ${res.status}`);
      });

      // 4. Send OTP Verification Code
      const testEmail = `priya_${Date.now()}@devscribe.io`;
      let generatedOtp = null;

      await test('POST /api/auth/send-otp generates 6-digit OTP', async () => {
        const res = await fetch(`${BASE_URL}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Priya Sharma',
            email: testEmail,
            password: 'StrongPassword123!'
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Send OTP failed');
        if (!data.otp || data.otp.length !== 6) throw new Error('Did not return valid 6-digit OTP');
        generatedOtp = data.otp;
      });

      // 5. Verify OTP and Register Account
      let userToken = null;
      await test('POST /api/auth/verify-otp creates user with custom DP and returns JWT', async () => {
        const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Priya Sharma',
            email: testEmail,
            password: 'StrongPassword123!',
            otp: generatedOtp,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Verify OTP failed');
        if (!data.token) throw new Error('No JWT token returned');
        if (data.user.email !== testEmail.toLowerCase()) throw new Error('User email does not match');
        userToken = data.token;
      });

      // 6. Duplicate Registration Prevention
      await test('POST /api/auth/send-otp prevents duplicate email registration', async () => {
        const res = await fetch(`${BASE_URL}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Priya Sharma',
            email: testEmail,
            password: 'StrongPassword123!'
          })
        });
        if (res.status !== 409) throw new Error(`Expected 409 Conflict, got ${res.status}`);
      });

      // 7. User Login with Verified Account
      await test('POST /api/auth/login authenticates newly verified user', async () => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: 'StrongPassword123!'
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Login failed');
        if (!data.token) throw new Error('Login did not return token');
      });

      // 8. Kanak Demo Account Login
      await test('POST /api/auth/login authenticates Kanak demo credentials', async () => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'kanak@devscribe.io',
            password: 'password123'
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Kanak demo login failed');
      });

      // 9. Create Blog API
      let createdPostId = null;
      await test('POST /api/posts creates new blog post', async () => {
        const res = await fetch(`${BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
          body: JSON.stringify({
            title: 'Testing Scalable Microservices with Node.js',
            category: 'Architecture',
            tags: ['NodeJS', 'Microservices', 'Testing'],
            excerpt: 'How to reliably verify distributed backend services in automated CI/CD pipelines.',
            content: 'Detailed breakdown of integration testing strategies and mocking message queues.',
            status: 'published'
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Create post failed');
        if (!data.post || !data.post.id) throw new Error('No post returned');
        createdPostId = data.post.id;
      });

      // 10. Get All Posts
      await test('GET /api/posts retrieves blog posts', async () => {
        const res = await fetch(`${BASE_URL}/posts`);
        const data = await res.json();
        if (!data.success) throw new Error('Failed to retrieve posts');
        if (!Array.isArray(data.posts) || data.posts.length === 0) throw new Error('No posts returned in array');
      });

      // 11. Add Reaction
      await test('POST /api/posts/:id/react adds a fire reaction', async () => {
        const res = await fetch(`${BASE_URL}/posts/${createdPostId}/react`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reaction: 'fire' })
        });
        const data = await res.json();
        if (!data.success) throw new Error('Reaction failed');
        if (data.reactions.fire < 1) throw new Error('Reaction count did not increment');
      });

      // 12. Add Comment
      await test('POST /api/posts/:id/comments adds discussion comment', async () => {
        const res = await fetch(`${BASE_URL}/posts/${createdPostId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: 'Priya Sharma',
            text: 'Great breakdown of distributed testing patterns!'
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error('Comment failed');
        if (!data.comments || data.comments.length === 0) throw new Error('Comment was not recorded');
      });

      // 13. Delete Post
      await test('DELETE /api/posts/:id removes post', async () => {
        const res = await fetch(`${BASE_URL}/posts/${createdPostId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error('Delete post failed');
      });

    } finally {
      server.close(() => {
        console.log(`\n=================================================`);
        console.log(`🎯 Test Results: ${passed} Passed, ${failed} Failed`);
        console.log(`=================================================\n`);
        process.exit(failed > 0 ? 1 : 0);
      });
    }
  });
}

runTests();
