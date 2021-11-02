const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    // Вывод строки счета
    result += `${playFor(perf).name}: ${usd(amountFor(perf) / 100)}`;
    result += ` (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount(invoice) / 100)}\n`;
  result += `You earned ${totalVolumeCredits(invoice)} credits\n`;
  return Promise.resolve(result);
}

function totalAmount(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf);
  }
  return result;
}

function totalVolumeCredits(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber);
}

function volumeCreditsFor(aPerfomance) {
  let result = 0;
  // Добавление бонусов
  result += Math.max(aPerfomance.audience - 30, 0);
  // Дополнительный бонус за каждые 10 комедий
  if ('comedy' === playFor(aPerfomance).type) {
    result += Math.floor(aPerfomance.audience / 5);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerfomance) {
  let result = 0;
  switch (playFor(aPerfomance).type) {
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
      throw new Error(`unknown type: ${playFor(aPerfomance).type}`);
  }
  return result;
}

statement(invoices[1], plays).then((result) => console.log(result));

module.exports.statement = statement;
