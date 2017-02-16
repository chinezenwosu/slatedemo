import jasmine from 'jasmine';

beforeEach((done) => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  setTimeout(function() {
    console.log('Setting timeout...');
    done();
  }, 500);
});
