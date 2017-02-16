import request from 'request';
import app from '../../server';
const baseUrl = 'http://localhost:8080/helloworld';

describe('Hello World Test', () => {
  describe('GET *', () => {
    afterAll(() => {
      app.stopServer();
    });

    it('returns a 200 status code', (done) => {
      request.get(baseUrl, (error, response, body) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('returns Hello World', function(done) {
      request.get(baseUrl, (error, response, body) => {
        expect(body).toBe('Hello World');
        done();
      });
    });
  });
});
