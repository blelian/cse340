const { validateEmail } = require('../utilities/account-validation');

describe('validateEmail', () => {
  test('valid email passes', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('invalid email fails', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  test('empty string fails', () => {
    expect(validateEmail('')).toBe(false);
  });
});
