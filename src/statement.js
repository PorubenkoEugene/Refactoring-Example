const plays = require('./plays.json');
const invoices = require('./invoices.json');
const { createStatementData } = require('./createStatementData');

async function statement(invoice) {
  return await renderPlainText(createStatementData(invoice));
}

async function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    // Вывод строки счета
    result += `${perf.play.name}: ${usd(perf.amount / 100)}`;
    result += ` (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;

  return Promise.resolve(result);
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber);
}

async function htmlStatement(invoice) {
  return await renderHtml(createStatementData(invoice));
}

async function renderHtml(data) {}

statement(invoices[1]).then((result) => console.log(result));

module.exports.statement = statement;
