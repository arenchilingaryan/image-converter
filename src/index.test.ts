import * as request from 'supertest';
import { app } from '.';

describe('correct requests to api', () => {
  it('responds home url', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) throw err.message;
        else done();
      });
  });
  it('responds status url', done => {
    request(app)
      .get('/status')
      .set('token', '123')
      .expect(200)
      .end(err => {
        if (err) throw err.message;
        else done();
      });
  });
  it('responds upload url', done => {
    request(app)
      .get('/upload')
      .set('token', '123')
      .expect(400)
      .end(err => {
        if (err) throw err.message;
        else done();
      });
  });
});
