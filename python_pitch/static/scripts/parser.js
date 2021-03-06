
  //Here, we can obviously do all of the rendering in JS or Django. I chose to do a little bit of both. 
  //get json data, parse it, and set variables
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
  console.log(auction_update[0])
  console.log(auction_summary[0])
  console.log(retail_price_improvement[0])


  //get number of buy and sell orders
  function getAddOrderBuySell() {
    let add_order_buy_sell = add_order.reduce(function (obj, v) {
      obj[v.site_indicator] = (obj[v.site_indicator] || 0) + 1;
      return obj;
    }, {})
    return add_order_buy_sell;
  }
  function getAddOrderLongBuySell() {
    let add_order_long_buy_sell = add_order_long.reduce(function (obj, v) {
      obj[v.site_indicator] = (obj[v.site_indicator] || 0) + 1;
      return obj;
    }, {})
    return add_order_long_buy_sell;
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
  //get buy shares
  function getBuyShares(items) {
    return items.reduce((total, item) => item.buy_shares + total, 0)
  }
  //get sell shares
  function getSellShares(items) {
    return items.reduce((total, item) => item.sell_shares + total, 0)
  }

  //get number of canceled shares
  function getCanceledShares(items) {
    return items.reduce((total, item) => item.canceled_shares + total, 0)
  }

  function getExecutedShares(items) {
    return items.reduce((total, item) => item.executed_shares + total, 0)
  }

  //get the 10 stocks with the most orders
  function getTopTenStockSymbols(item) {
    let sortable = [];
    let sorted_stocks = [];
    let symbol_counts = item.reduce(function (obj, v) {
      obj[v.stock_symbol] = (obj[v.stock_symbol] || 0) + 1;
      return obj;
    }, {})
    for (let v in symbol_counts) {
      sortable.push([v, symbol_counts[v]]);
    }
    let item_symbol_counts = sortable.sort(function (a, b) {
      return b[1] - a[1];
    });
    if (sortable.length < 10) {
      for (let i = 0; i < sortable.length; i++) {
        let stock = item_symbol_counts[i][0];
        let stock_count = item_symbol_counts[i][1];
        let data = { 'stock': stock, 'stock_count': stock_count }
        sorted_stocks.push(data);
      }
    } else {
      for (let i = 0; i < 10; i++) {
        let stock = item_symbol_counts[i][0];
        let stock_count = item_symbol_counts[i][1];
        let data = { 'stock': stock, 'stock_count': stock_count }
        sorted_stocks.push(data);
      }
    }
    return sorted_stocks;
  }

  //get a count of all auction types 
  function getAuctionTypeCounts(item) {
    let sortable = [];
    let sorted_types = [];
    let auction_counts = item.reduce(function (obj, v) {
      obj[v.auction_type] = (obj[v.auction_type] || 0) + 1;
      return obj;
    }, {})
    for (let v in auction_counts) {
      sortable.push([v, auction_counts[v]]);
    }
    let item_auction_counts = sortable.sort(function (a, b) {
      return b[1] - a[1];
    });
    if (sortable.length < 10) {
      for (let i = 0; i < sortable.length; i++) {
        let auction = item_auction_counts[i][0];
        let auction_count = item_auction_counts[i][1];
        let data = { 'auction': auction, 'auction_count': auction_count }
        sorted_types.push(data);
      }
    } else {
      for (let i = 0; i < 10; i++) {
        let auction = item_auction_counts[i][0];
        let auction_count = item_auction_counts[i][1];
        let data = { 'auction': auction, 'auction_count': auction_count }
        sorted_types.push(data);
      }
    }
    return sorted_types;
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

  // add order
  if (add_order.length > 0) {
    let add_order_div = document.getElementById(add_order[0].message_type_full_name)
    let add_order_buy = add_order.filter((a) => a.site_indicator === 'B');
    let add_order_sell = add_order.filter((a) => a.site_indicator === 'S');
    let totalBuyPrices = numberWithCommas(getTotalBuySellPrices(add_order_buy));
    let totalSellPrices = numberWithCommas(getTotalBuySellPrices(add_order_sell));
    let add_orderTopTenStockSymbols = getTopTenStockSymbols(add_order);
    let add_order_buy_shares = numberWithCommas(getTotalShares(add_order_buy));
    let add_order_sell_shares = numberWithCommas(getTotalShares(add_order_sell));
    add_order_div.innerHTML += `<canvas id="Add Order bar graph"></canvas>`
    add_order_div.innerHTML += `<ul>`
    add_order_div.innerHTML += `<li>${getAddOrderBuySell().S} <b>SELL</b> orders for a total of ${add_order_sell_shares} shares and $${totalSellPrices}.</li>`;
    add_order_div.innerHTML += `<li>${getAddOrderBuySell().B} <b>BUY</b> orders for a total of  ${add_order_buy_shares} shares and $${totalBuyPrices}.</li>`;
    add_order_div.innerHTML += `</ul>`;
    add_order_div.innerHTML += `<hr />`;
    add_order_div.innerHTML += `<canvas id="Add Order bar graph 2"></canvas>`
    add_order_div.innerHTML += `<br /><h5>The 10 stock symbols that showed up the most: </h5>`;
    add_order_div.innerHTML += `<ol id="add_order_ol" start="1">`;
    for (var stock in add_orderTopTenStockSymbols) {
      document.getElementById('add_order_ol').innerHTML += `<li>${add_orderTopTenStockSymbols[stock].stock} with ${add_orderTopTenStockSymbols[stock].stock_count}</li>`
    }
    add_order_div.innerHTML += `</ol>`;
  }


  // add order long
  if (add_order_long.length > 0) {
    let add_order_long_div = document.getElementById(add_order_long[0].message_type_full_name)
    let add_order_long_buy = add_order_long.filter((a) => a.site_indicator === 'B');
    let add_order_long_sell = add_order_long.filter((a) => a.site_indicator === 'S');
    let totalLongBuyPrices = numberWithCommas(getTotalBuySellPrices(add_order_long_buy));
    let totalLongSellPrices = numberWithCommas(getTotalBuySellPrices(add_order_long_sell));
    let add_order_longTopTenStockSymbols = getTopTenStockSymbols(add_order_long);
    let add_order_long_buy_shares = numberWithCommas(getTotalShares(add_order_long_buy));
    let add_order_long_sell_shares = numberWithCommas(getTotalShares(add_order_long_sell));
    add_order_long_div.innerHTML += `<canvas id="Add Order (Long) bar graph"></canvas>`
    add_order_long_div.innerHTML += `<ul>`
    add_order_long_div.innerHTML += `<li>${getAddOrderLongBuySell().S} <b>SELL</b> orders for a total of ${add_order_long_sell_shares} shares and $${totalLongSellPrices}.</li>`;
    add_order_long_div.innerHTML += `<li>${getAddOrderLongBuySell().B} <b>BUY</b> orders for a total of  ${add_order_long_buy_shares} shares and $${totalLongBuyPrices}.</li>`;
    add_order_long_div.innerHTML += `</ul>`;
    add_order_long_div.innerHTML += `<hr />`;
    add_order_long_div.innerHTML += `<canvas id="Add Order (Long) bar graph 2"></canvas>`
    add_order_long_div.innerHTML += `<br /><h5>The stock symbols that showed up the most: </h5>`;
    add_order_long_div.innerHTML += `<ol id="add_order_long_ol" start="1">`;
    for (var stock in add_order_longTopTenStockSymbols) {
      document.getElementById('add_order_long_ol').innerHTML += `<li>${add_order_longTopTenStockSymbols[stock].stock} with ${add_order_longTopTenStockSymbols[stock].stock_count}</li>`
    }
    add_order_long_div.innerHTML += `</ol>`;
  }
  //order canceled
  if (order_cancel.length > 0) {
    let order_cancel_div = document.getElementById(order_cancel[0].message_type_full_name);
    order_cancel.sort((a, b) => a.canceled_shares < b.canceled_shares);
    let order_cancelMaxShares = order_cancel[0]
    let order_cancelMinShares = order_cancel[order_cancel.length - 1];
    let order_cancelCanceledShares = numberWithCommas(getCanceledShares(order_cancel));
    order_cancel_div.innerHTML += `<ul>`
    order_cancel_div.innerHTML += `<li>In ${order_cancel.length} messages, ${order_cancelCanceledShares} shares were cancelled.</li>`;
    order_cancel_div.innerHTML += `<li>The largest cancellation was ${numberWithCommas(order_cancelMaxShares.canceled_shares)} shares in one message.</li>`;
    order_cancel_div.innerHTML += `<li>The smallest was ${numberWithCommas(order_cancelMinShares.canceled_shares)} cancelled shares.</li>`;
    order_cancel_div.innerHTML += `<hr />`;
  }
  //trade
  if (trade.length > 0) {
    let trade_div = document.getElementById(trade[0].message_type_full_name);
    let tradeTopTenStockSymbols = getTopTenStockSymbols(trade);
    let tradeTotalPrice = numberWithCommas(getTotalBuySellPrices(trade));
    let tradeTotalShares = numberWithCommas(getTotalShares(trade));
    trade_div.innerHTML += `<ul>`
    trade_div.innerHTML += `<li>${trade.length} orders for a total of ${tradeTotalShares} shares and $${tradeTotalPrice}.</li>`;
    trade_div.innerHTML += `</ul>`;
    trade_div.innerHTML += `<hr />`;
    trade_div.innerHTML += `<canvas id="Trade bar graph"></canvas>`
    trade_div.innerHTML += `<br /><h5>The stock symbols that showed up the most: </h5>`;
    trade_div.innerHTML += `<ol id="trade_ol" start="1">`;
    for (var stock in tradeTopTenStockSymbols) {
      document.getElementById('trade_ol').innerHTML += `<li>${tradeTopTenStockSymbols[stock].stock} with ${tradeTopTenStockSymbols[stock].stock_count}</li>`
    }
    trade_div.innerHTML += `</ol>`;
  }

  //trade long
  if (trade_long.length > 0) {
    let trade_long_div = document.getElementById(trade_long[0].message_type_full_name);
    let trade_longTopTenStockSymbols = getTopTenStockSymbols(trade_long);
    let trade_longTotalPrice = numberWithCommas(getTotalBuySellPrices(trade_long));
    let trade_longTotalShares = numberWithCommas(getTotalShares(trade_long));
    trade_long_div.innerHTML += `<ul>`
    trade_long_div.innerHTML += `<li>${trade_long.length} orders for a total of ${trade_longTotalShares} shares and $${trade_longTotalPrice}.</li>`;
    trade_long_div.innerHTML += `</ul>`;
    trade_long_div.innerHTML += `<hr />`;
    trade_long_div.innerHTML += `<canvas id="Trade (Long) bar graph"></canvas>`
    trade_long_div.innerHTML += `<br /><h5>The stock symbols that showed up the most: </h5>`;
    trade_long_div.innerHTML += `<ol id="trade_long_ol" start="1">`;
    for (var stock in trade_longTopTenStockSymbols) {
      document.getElementById('trade_long_ol').innerHTML += `<li>${trade_longTopTenStockSymbols[stock].stock} with ${trade_longTopTenStockSymbols[stock].stock_count}</li>`
    }
    trade_long_div.innerHTML += `</ol>`;
  }

  //order executed 
  if (order_executed.length > 0) {
    let order_executed_div = document.getElementById(order_executed[0].message_type_full_name);
    order_executed.sort((a, b) => a.executed_shares < b.executed_shares)
    let order_executedMaxShares = order_executed[0]
    let order_executedMinShares = order_executed[order_executed.length - 1];
    let order_executedExecutedShares = numberWithCommas(getExecutedShares(order_executed));
    order_executed_div.innerHTML += `<ul>`
    order_executed_div.innerHTML += `<li>In ${order_executed.length} messages, ${order_executedExecutedShares} shares were executed.</li>`;
    order_executed_div.innerHTML += `<li>The largest execution was ${numberWithCommas(order_executedMaxShares.executed_shares)} shares in one message.</li>`;
    order_executed_div.innerHTML += `<li>The smallest was ${numberWithCommas(order_executedMinShares.executed_shares)} executed shares.</li>`;
    order_executed_div.innerHTML += `<hr />`;
  }

  //symbol clear 
  if (symbol_clear.length > 0) {
    let symbol_clear_div = document.getElementById(symbol_clear[0].message_type_full_name);
    let symbol_clearTopTenStockSymbols = getTopTenStockSymbols(symbol_clear);
    symbol_clear_div.innerHTML += `<canvas id="Symbol Clear bar graph"></canvas>`
    symbol_clear_div.innerHTML += `<br /><h5>The stock symbols that showed up the most: </h5>`;
    symbol_clear_div.innerHTML += `<ol id="symbol_clear_ol" start="1">`;
    for (var stock in symbol_clearTopTenStockSymbols) {
      document.getElementById('symbol_clear_ol').innerHTML += `<li>${symbol_clearTopTenStockSymbols[stock].stock} with ${symbol_clearTopTenStockSymbols[stock].stock_count}</li>`
    }
    symbol_clear_div.innerHTML += `</ol>`;
  }

  //trading status
  if (trading_status.length > 0) {
    let trading_status_div = document.getElementById(trading_status[0].message_type_full_name);
    let trading_statusTopTenStockSymbols = getTopTenStockSymbols(symbol_clear);
    trading_status_div.innerHTML += `<canvas id="Trading Status bar graph"></canvas>`
    trading_status_div.innerHTML += `<br /><h5>The stock symbols that showed up the most: </h5>`;
    trading_status_div.innerHTML += `<ol id="trading_status_ol" start="1">`;
    for (var stock in trading_statusTopTenStockSymbols) {
      document.getElementById('trading_status_ol').innerHTML += `<li>${trading_statusTopTenStockSymbols[stock].stock} with ${trading_statusTopTenStockSymbols[stock].stock_count}</li>`
    }
    trading_status_div.innerHTML += `</ol>`;
  }

  //auction update
  if (auction_update.length > 0) {
    let auction_update_div = document.getElementById(auction_update[0].message_type_full_name);
    let auction_updateTopTenStockSymbols = getTopTenStockSymbols(auction_update);
    auction_update_div.innerHTML += `<canvas id="Auction Update bar graph"></canvas>`
    auction_update_div.innerHTML += `<ul>`
    auction_update_div.innerHTML += `<li>${numberWithCommas(getBuyShares(auction_update))} buy shares available</li>`;
    auction_update_div.innerHTML += `<li>${numberWithCommas(getSellShares(auction_update))} sell shares available</li>`;
    auction_update_div.innerHTML += `</ul>`;
    auction_update_div.innerHTML += `<hr />`;
    auction_update_div.innerHTML += `<canvas id="Auction Update bar graph 2"></canvas>`
    auction_update_div.innerHTML += `<br /><h5>The stock symbols that showed up the most: </h5>`;
    auction_update_div.innerHTML += `<ol id="auction_update_ol" start="1">`;
    for (var stock in auction_updateTopTenStockSymbols) {
      document.getElementById('auction_update_ol').innerHTML += `<li>${auction_updateTopTenStockSymbols[stock].stock} with ${auction_updateTopTenStockSymbols[stock].stock_count}</li>`
    }
    auction_update_div.innerHTML += `</ol>`;
  }
  //auction summary
  if (auction_summary.length > 0) {
    let auction_summary_div = document.getElementById(auction_summary[0].message_type_full_name);
    let auction_summaryTopTenAuctionTypes = getAuctionTypeCounts(auction_summary)
    auction_summary_div.innerHTML += `<ul>`
    auction_summary_div.innerHTML += `<li>${numberWithCommas(getTotalShares(auction_summary))} total shares sold for a total of $${numberWithCommas(getTotalBuySellPrices(auction_summary))} </li>`;
    auction_summary_div.innerHTML += `</ul>`;
    auction_summary_div.innerHTML += `<hr />`;
    auction_summary_div.innerHTML += `<canvas id="Auction Summary bar graph "></canvas>`
    auction_summary_div.innerHTML += `<br /><h5>The most occuring auctions were: </h5>`;
    auction_summary_div.innerHTML += `<ol id="auction_summary_ol" start="1">`;
    for (var auction in auction_summaryTopTenAuctionTypes) {
      document.getElementById('auction_summary_ol').innerHTML += `<li>${auction_summaryTopTenAuctionTypes[auction].auction} with ${auction_summaryTopTenAuctionTypes[auction].auction_count}</li>`
    }
    auction_summary_div.innerHTML += `</ol>`;
  }
  //rpi
  if (retail_price_improvement.length > 0) {
    let retail_price_improvement_div = document.getElementById(retail_price_improvement[0].message_type_full_name);
    let retail_price_improvementTopTenStockTypes = getTopTenStockSymbols(retail_price_improvement)
    retail_price_improvement_div.innerHTML += `<hr />`;
    retail_price_improvement_div.innerHTML += `<canvas id="Retail Price Improvement bar graph"></canvas>`
    retail_price_improvement_div.innerHTML += `<br /><h5>The most occuring auctions were: </h5>`;
    retail_price_improvement_div.innerHTML += `<ol id="retail_price_improvement_ol" start="1">`;
    for (var stock in retail_price_improvementTopTenStockTypes) {
      document.getElementById('retail_price_improvement_ol').innerHTML += `<li>${retail_price_improvementTopTenStockTypes[stock].stock} with ${retail_price_improvementTopTenStockTypes[stock].stock_count}</li>`
    }
    retail_price_improvement_div.innerHTML += `</ol>`;
  }
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

  // function to visualize
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

  // Visualize initial Bar Graph
  let barGraph = document.getElementById('myBarGraph');
  visualizeBarGraph('Message Count', chartCounts, barGraph, allMessageNames)

  // Visualize initial Pie Graph
  let pieChart = document.getElementById('myPieChart');
  visualizePieGraph('File Breakdown', chartCounts, pieChart, allMessageNames)

  // Visualize Add order Price bar graph
  if (add_order.length > 0) {
    let add_orderPriceBarGraph = document.getElementById('Add Order bar graph');
    visualizeBarGraph('Sell vs Buy Counts', [getAddOrderBuySell().S, getAddOrderBuySell().B], add_orderPriceBarGraph, ['Sell', 'Buy'])

    // Visualize Add order Stock bar graph
    let add_orderStockBarGraph = document.getElementById('Add Order bar graph 2');
    let add_orderTopTenStockSymbols = getTopTenStockSymbols(add_order);
    let stockNames = [];
    let stockCounts = [];
    for (var i in add_orderTopTenStockSymbols) {
      stockNames.push(add_orderTopTenStockSymbols[i].stock);
      stockCounts.push(add_orderTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, add_orderStockBarGraph, stockNames)
  }


  // Visualize Add order Price bar graph
  if (add_order_long.length > 0) {
    let add_order_longPriceBarGraph = document.getElementById('Add Order (Long) bar graph');
    visualizeBarGraph('Sell vs Buy Counts', [getAddOrderLongBuySell().S, getAddOrderLongBuySell().B], add_order_longPriceBarGraph, ['Sell', 'Buy'])

    // Visualize Add order Stock bar graph
    let add_order_longStockBarGraph = document.getElementById('Add Order (Long) bar graph 2');
    let add_order_longTopTenStockSymbols = getTopTenStockSymbols(add_order_long);
    stockNames = [];
    stockCounts = [];
    for (var i in add_order_longTopTenStockSymbols) {
      stockNames.push(add_order_longTopTenStockSymbols[i].stock);
      stockCounts.push(add_order_longTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, add_order_longStockBarGraph, stockNames)
  }

  // Visualize trade stock bar graph
  if (trade.length > 0) {
    let tradeStockBarGraph = document.getElementById('Trade bar graph');
    let tradeTopTenStockSymbols = getTopTenStockSymbols(trade);
    stockNames = [];
    stockCounts = [];
    for (var i in tradeTopTenStockSymbols) {
      stockNames.push(tradeTopTenStockSymbols[i].stock);
      stockCounts.push(tradeTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, tradeStockBarGraph, stockNames)
  }
  if (trade_long.length > 0) {
    // Visualize trade stock bar graph
    let trade_longStockBarGraph = document.getElementById('Trade (Long) bar graph');
    let trade_longTopTenStockSymbols = getTopTenStockSymbols(trade_long);

    stockNames = [];
    stockCounts = [];
    for (var i in trade_longTopTenStockSymbols) {
      stockNames.push(trade_longTopTenStockSymbols[i].stock);
      stockCounts.push(trade_longTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, trade_longStockBarGraph, stockNames)
  }

  //symbol clear
  if (symbol_clear.length > 0) {
    let symbol_clearBarGraph = document.getElementById('Symbol Clear bar graph');
    let symbol_clearTopTenStockSymbols = getTopTenStockSymbols(symbol_clear);
    stockNames = [];
    stockCounts = [];
    for (var i in symbol_clearTopTenStockSymbols) {
      stockNames.push(symbol_clearTopTenStockSymbols[i].stock);
      stockCounts.push(symbol_clearTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, symbol_clearBarGraph, stockNames)
  }

  //trading status
  if (trading_status.length > 0) {
    let trading_statusBarGraph = document.getElementById('Trading Status bar graph');
    let trading_statusTopTenStockSymbols = getTopTenStockSymbols(trading_status);
    stockNames = [];
    stockCounts = [];
    for (var i in trading_statusTopTenStockSymbols) {
      stockNames.push(trading_statusTopTenStockSymbols[i].stock);
      stockCounts.push(trading_statusTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, trading_statusBarGraph, stockNames)
  }
  //auction update stock counts
  if (auction_update.length > 0) {
    let auction_updateBarGraph = document.getElementById('Auction Update bar graph 2');
    let auction_updateTopTenStockSymbols = getTopTenStockSymbols(auction_update)
    stockNames = [];
    stockCounts = [];
    for (var i in auction_updateTopTenStockSymbols) {
      stockNames.push(auction_updateTopTenStockSymbols[i].stock);
      stockCounts.push(auction_updateTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, auction_updateBarGraph, stockNames)

    // Visualize auction update  bar graph
    let auction_updatePriceBarGraph = document.getElementById('Auction Update bar graph');
    visualizeBarGraph('Sell vs Buy Counts', [getSellShares(auction_update), getBuyShares(auction_update)], auction_updatePriceBarGraph, ['Sell', 'Buy'])
  }

  //auction summary counts
  if (auction_update.length > 0) {
    let auction_summaryBarGraph = document.getElementById('Auction Summary bar graph ');
    let auction_summaryTopTenAuctionTypes = getAuctionTypeCounts(auction_summary)
    auctionNames = [];
    auctionCounts = [];
    console.log(auction_summaryTopTenAuctionTypes)
    for (var i in auction_summaryTopTenAuctionTypes) {
      auctionNames.push(auction_summaryTopTenAuctionTypes[i].auction);
      auctionCounts.push(auction_summaryTopTenAuctionTypes[i].auction_count);
    }
    visualizeBarGraph('Top Auction Types by Count', auctionCounts, auction_summaryBarGraph, auctionNames)

  }

  if (retail_price_improvement.length > 0) {
    let retail_price_improvementBarGraph = document.getElementById('Retail Price Improvement bar graph');
    let retail_price_improvementTopTenStockSymbols = getTopTenStockSymbols(retail_price_improvement)
    stockNames = [];
    stockCounts = [];
    for (var i in retail_price_improvementTopTenStockSymbols) {
      stockNames.push(retail_price_improvementTopTenStockSymbols[i].stock);
      stockCounts.push(retail_price_improvementTopTenStockSymbols[i].stock_count);
    }
    visualizeBarGraph('Top Stocks by Count', stockCounts, retail_price_improvementBarGraph, stockNames)
  }

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

