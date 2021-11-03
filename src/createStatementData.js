const plays = require('./plays.json');

function createStatementData(invoice) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return statementData;
}

function totalAmount(data) {
  return data.performances.reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

function enrichPerformance(aPerfomance) {
  const result = Object.assign({}, aPerfomance);
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);

  return result;
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

module.exports.createStatementData = createStatementData;
