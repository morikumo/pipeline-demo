const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBeDefined();
  });
});

describe('GET /health', () => {
  it('should return 200 healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});

describe('GET /greet/:name', () => {
  it('should return a greeting for a valid name', async () => {
    const res = await request(app).get('/greet/Alice');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello, Alice!');
  });
});
