import '@testing-library/jest-dom';

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input: any, init?: any) {
      Object.assign(this, init);
    }
  } as any;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {} as any;
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {} as any;
}