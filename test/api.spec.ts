import { test, expect } from '@playwright/test';

let token: string;
let orderId: string;
const clientName = 'IsaacClient';
const clientEmail = `isaac${Date.now()}@example.com`;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
  const res = await request.post('/api-clients', {
    data: {
      clientName: clientName,
      clientEmail: clientEmail
    }
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  token = body.accessToken;
});

// 1. Check API Health
test('GET /status', async ({ request }) => {
  const res = await request.get('/status');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe('OK');
});

// 2. List Books with Query Params
test('GET /books', async ({ request }) => {
  const res = await request.get('/books', {
    params: { type: 'fiction', limit: 3 }
  });
  expect(res.ok()).toBeTruthy();
  const books = await res.json();
  expect(Array.isArray(books)).toBeTruthy();
});

// 3. Get Single Book by ID
test('GET /books/:bookId', async ({ request }) => {
  const res = await request.get('/books/1');
  expect(res.ok()).toBeTruthy();
  const book = await res.json();
  expect(book.id).toBe(1);
});

// 4. Create First Order
test('POST /orders', async ({ request }) => {
  const res = await request.post('/orders', {
    headers: { Authorization: `Bearer ${token}` },
    data: { bookId: 1, customerName: clientName }
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  orderId = body.orderId;
  expect(orderId).toBeTruthy();
});

// 5. Verify Created Order Details
test('GET /orders/:orderId', async ({ request }) => {
  test.skip(!orderId, 'Skipped: orderId was not captured in test #4');
  const res = await request.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  expect(res.status()).toBe(200);
  const order = await res.json();
  expect(order.id).toBe(orderId);
  expect(order.customerName).toBe(clientName);
});

// 6. Create Second Order for Modification
test('POST /orders (secondary)', async ({ request }) => {
  const res = await request.post('/orders', {
    headers: { Authorization: `Bearer ${token}` },
    data: { bookId: 3, customerName: clientName }
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  orderId = body.orderId; 
});

// 7. Update Order Data
test('PATCH /orders/:orderId', async ({ request }) => {
  test.skip(!orderId, 'Skipped: No orderId available to update');
  const res = await request.patch(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { customerName: 'Updated Isaac' }
  });
  expect(res.status()).toBe(204);
});

// 8. Delete Order and Verify
test('DELETE /orders/:orderId', async ({ request }) => {
  test.skip(!orderId, 'Skipped: No orderId available to delete');
  const res = await request.delete(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  expect(res.status()).toBe(204);

  // Final verification check
  const verifyRes = await request.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  expect(verifyRes.status()).toBe(404);
});
