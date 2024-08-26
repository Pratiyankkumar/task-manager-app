// tests/__mocks__/maths.js
const calculateTip = jest.fn().mockReturnValue({
  message: 'Hello'
});

// Keeping the original implementations for other functions
const originalModule = jest.requireActual('../src/maths');

module.exports = {
  ...originalModule, // spread the other functions
  calculateTip, // override calculateTip with the mock
};
