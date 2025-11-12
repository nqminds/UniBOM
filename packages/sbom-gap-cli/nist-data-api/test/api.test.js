/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable prettier/prettier */
const request = require('supertest');
const app = require('../index.js');

let server;

beforeAll(() => {
  server = app.listen(3003); // Start the server on a test port
});

afterAll((done) => {
    server.close(() => {
      done();
    });
  });
  

afterAll(async () => {
    await new Promise((resolve) => {server.close(resolve)})
  });
  

describe('API Endpoints Security Measures', () => {
  /**
   * /api/cve endpoint tests
   */
  describe('/api/cve', () => {
    it('should return 400 if CPE is missing', async () => {
      const res = await request(app).post('/api/cve').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'CPE is required',
            path: 'cpe',
          }),
        ])
      );
    });

    it('should return 200 for valid CPE input', async () => {
      const res = await request(app)
        .post('/api/cve')
        .send({ cpe: 'cpe:2.3:a:solarwinds:serv-u:*:*:*:*:*:*:*:*' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'CVE data fetched successfully');
    });

  });

  /**
   * /api/cpe-versions endpoint tests
   */
  describe('/api/cpe-versions', () => {
    it('should return 400 if CPE is missing', async () => {
      const res = await request(app).post('/api/cpe-versions').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'CPE is required',
            path: 'cpe',
          }),
        ])
      );
    });

    it('should return 200 for valid CPE input', async () => {
      const res = await request(app)
        .post('/api/cpe-versions')
        .send({ cpe: 'cpe:2.3:a:solarwinds:serv-u:*:*:*:*:*:*:*:*' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'CPE versions fetched successfully');
    });

  });

  /**
   * /api/cve-id endpoint tests
   */
  describe('/api/cve-id', () => {
    it('should return 400 if CVE ID is missing', async () => {
      const res = await request(app).post('/api/cve-id').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'CVE ID is required',
            path: 'cveId',
          }),
        ])
      );
    });

    it('should return 200 for valid CVE ID input', async () => {
      const res = await request(app).post('/api/cve-id').send({ cveId: 'CVE-2022-48174' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'CVE CVE-2022-48174 fetched successfully');
    });


  });
});
