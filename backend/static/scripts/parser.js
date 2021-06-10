//get json data, parse it, and set letiables
const jsonData = JSON.parse(document.getElementById('data').textContent);
const counts = jsonData.counts;
const add_order = jsonData.add_order;
const add_order_long = jsonData.add_order_long;
const auction_summary = jsonData.auction_summary;
const auction_update = jsonData.auction_update;
const order_cancel = jsonData.order_cancel;
const order_executed = jsonData.order_executed;
const trade = jsonData.trade;
const trade_long = jsonData.trade_long;
const trade_break = jsonData.trade_break;
const trading_status = jsonData.trading_status;
const symbol_clear = jsonData.symbol_clear;
const retail_price_improvement = jsonData.retail_price_improvement;
console.log(add_order[0])

  //get number of buy and sell orders
function getAddOrderBuySell() {
    let add_order_buy_sell = add_order.reduce(function (obj, v) {
        obj[v.site_indicator] = (obj[v.site_indicator] || 0) + 1;
        return obj;
    }, {})
    return add_order_buy_sell;
}

//add up all of the prices in a given array 
function getTotalBuySellPrices(items) {
    return items.reduce((total, item) => item.price + total, 0)
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//add up number of shares
function getTotalShares(items) {
    return items.reduce((total, item) => item.shares + total, 0)
}

  //get the 10 stocks with the most orders
function getTopTenStockSymbols() {
    let sortable = [];
    let sorted_stocks = [];
    let symbol_counts = add_order.reduce(function (obj, v) {
      obj[v.stock_symbol] = (obj[v.stock_symbol] || 0) + 1;
      return obj;
    }, {})
    for (let v in symbol_counts) {
      sortable.push([v, symbol_counts[v]]);
    }
    let add_order_symbol_counts = sortable.sort(function (a, b) {
      return b[1] - a[1];
    });
    for (let i = 0; i < 10; i++) {
      let stock = add_order_symbol_counts[i][0];
      let stock_count = add_order_symbol_counts[i][1];
      let data = { 'stock': stock, 'stock_count': stock_count }
      sorted_stocks.push(data);
    }
    return sorted_stocks;
}

  //Scroll to name details when clicked up top, and get a dictionary of message names

  let itemNames = document.querySelectorAll('.item-name');
  for (let x in itemNames) {
    if (itemNames[x].nodeName === 'SPAN') {
      itemNames[x].addEventListener('click', function () {
        let scrollId = document.getElementById(this.innerText);
        scrollId.scrollIntoView();
      })
    }
  }

  let add_order_buy = add_order.filter((a) => a.site_indicator === 'B');
  let add_order_sell = add_order.filter((a) => a.site_indicator === 'S');
  let totalBuyPrices = numberWithCommas(getTotalBuySellPrices(add_order_buy));
  let totalSellPrices = numberWithCommas(getTotalBuySellPrices(add_order_sell));
  let topTenStockSymbols = getTopTenStockSymbols();
  let add_order_buy_shares = numberWithCommas(getTotalShares(add_order_buy));
  let add_order_sell_shares = numberWithCommas(getTotalShares(add_order_sell));
  let add_order_div = document.getElementById(add_order[0].message_type_full_name)
  add_order_div.innerHTML += `<canvas id="Add Order bar graph"></canvas>`
  add_order_div.innerHTML += `<h5 class="text-center">${getAddOrderBuySell().S} were <b>SELL</b> orders for a total of ${add_order_sell_shares} shares and $${totalSellPrices}.</h5>`;
  add_order_div.innerHTML += `<h5 class="text-center">${getAddOrderBuySell().B} were <b>BUY</b> orders for a total of  ${add_order_buy_shares} shares and $${totalBuyPrices}.</h5>`;
  add_order_div.innerHTML += `</ul>`;
  add_order_div.innerHTML += `<canvas id="Add Order bar graph 2"></canvas>`
  add_order_div.innerHTML += `<br /><h5>The 10 stock symbols that showed up the most: </h5>`;
  add_order_div.innerHTML += `<ol id="add_order_ol" start="1">`;
  for (var stock in topTenStockSymbols) {
    console.log(topTenStockSymbols[stock]);
    document.getElementById('add_order_ol').innerHTML += `<li>${topTenStockSymbols[stock].stock} with ${topTenStockSymbols[stock].stock_count}</li>`
  }
  add_order_div.innerHTML += `</ol>`;

  //visualize pieGraph

  function visualizePieGraph(chartLabel, chartData, id, labels) {
    let myChart = new Chart(id, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          data: chartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Pie Chart'
          }
        }
      },
    });
  }

  function visualizeBarGraph(chartLabel, chartData, id, labels) {
    let myChart = new Chart(id, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          data: chartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  //format data to visualize
  let allMessageNames = [];
  let chartCounts = [];
  let maxCount = 0;
  let j = 0;
  for (i in counts) {
    if (counts[i].name !== 'Total Count') {
      allMessageNames.push(counts[i].name);
      chartCounts.push(counts[i].count);
      if (j === 0) {
        maxCount = counts[i].count;
      } else {
        if (counts[i].count > maxCount) {
          maxCount = counts[i].count;
        }
      }
      j++
    }
  }
  let barGraph = document.getElementById('myBarGraph');
  visualizeBarGraph('Message Count', chartCounts, barGraph, allMessageNames)

  let pieChart = document.getElementById('myPieChart');
  visualizePieGraph('File Breakdown', chartCounts, pieChart, allMessageNames)

  let add_orderPriceBarGraph = document.getElementById('Add Order bar graph');
  visualizeBarGraph('Sell vs Buy Counts', [getAddOrderBuySell().S, getAddOrderBuySell().B], add_orderPriceBarGraph, ['Sell', 'Buy'])

  let add_orderStockBarGraph = document.getElementById('Add Order bar graph 2');
  let stockNames = [];
  let stockCounts = [];
  for (var i in topTenStockSymbols) {
    stockNames.push(topTenStockSymbols[i].stock);
    stockCounts.push(topTenStockSymbols[i].stock_count);
  }
  visualizeBarGraph('Top 10 Stocks by Count', stockCounts, add_orderStockBarGraph, stockNames)

  //add button logic to change graphs
  document.getElementById('changeGraphButton').addEventListener('click', function () {
    console.log(this.value);
    if (this.value === 'bar') {
      barGraph.style.display = 'none';
      pieChart.style.display = 'block';
      this.value = 'pie';
      this.innerText = 'Show as Bar Graph';
    } else {
      pieChart.style.display = 'none';
      barGraph.style.display = 'block';
      this.value = 'bar';
      this.innerText = 'Show as Pie Chart'
    }
  })




