const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/maths.js')

test('Should calculate total with tip', () => {
  const total = calculateTip(10, .3)
  expect(total).toBe(13)
  console.log(total.message)

  // if (total !== 13) {
  //   throw new Error('Total tip shoul be 13, Got ' + total)
  // }
})

test('Should calculate total with default tip', () => {
  const total = calculateTip(10)
  expect(total).toBe(12.5)
})

test('should convert fahrenheit to celsius', () => {
  expect(fahrenheitToCelsius(32)).toBe(0)
})

test('should convert celsius into fahrenheit', () => {
  expect(celsiusToFahrenheit(0)).toBe(32)
})

// test('Async test demo', (done) => {
//   setTimeout(() => {
//     expect(1).toBe(2)
//     done()
//   }, 2000);
// })

test('Should add two numbers', (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5)
    done()
  })
})

test('shoul add two number async await', async () => {
  const sum = await add(10, 22)
  expect(sum).toBe(32)
})