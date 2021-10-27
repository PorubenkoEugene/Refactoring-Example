const { statement } = require('../statement');
const plays = require('../plays.json');
const invoices = require('../invoices.json');

test('Statement for BigCo', async () => {
  expect(await statement(invoices[0], plays)).toMatch(
    'Statement for BigCo\n' +
      'Hamlet: $650.00 (55 seats)\n' +
      'As You Like It: $580.00 (35 seats)\n' +
      'Othello: $500.00 (40 seats)\n' +
      'Amount owed is $1,730.00\n' +
      'You earned 47 credits\n'
  );
});
