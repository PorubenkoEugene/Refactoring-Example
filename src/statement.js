const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {
  let totalAmount = 0;

  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = playFor(perf);
    let thisAmount = amountFor(perf, play);
    // Добавление бонусов
    volumeCredits += Math.max(perf.audience - 30, 0);
    // Дополнительный бонус за каждые 10 комедий
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
    // Вывод строки счета
    result += `${play.name}: ${format(thisAmount / 100)}`;
    result += ` (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return Promise.resolve(result);
}

function amountFor(aPerfomance, play) {
  let result = 0;
  switch (play.type) {
    case 'tragedy':
      result = 40000;
      if (aPerfomance.audience > 30) {
        result += 1000 * (aPerfomance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerfomance.audience > 20) {
        result += 10000 + 500 * (aPerfomance.audience - 20);
      }
      result += 300 * aPerfomance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

statement(invoices[1], plays).then((result) => console.log(result));

module.exports.statement = statement;
