from django.shortcuts import render
from rest_framework import viewsets          
from django.conf import settings
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse, JsonResponse
import os, json, json.encoder, json.decoder
import operator
import argparse





  
class PitchParserView():       
  def index(request):
    media_path = os.path.join(settings.MEDIA_ROOT, '')
    for file in os.listdir(media_path):
      return HttpResponse(json.encoder.encode_basestring(file))
      

  def detail(request, title):
    pitch = open(os.path.join(settings.MEDIA_ROOT, title), 'r')
    data = pitch_parser(pitch)
    return render(request, 'parsed.html', {'data':data})
    

def pitch_parser(iterable):
  """
  Takes an iterable containing PITCH messages and returns a dictionary
  with all the symbols as keys and all the executed volume as values
  """
  message_types = {
    'symbol_clear': [],
    'add_order': [],
    'add_order_long': [],
    'order_executed': [],
    'order_cancel': [],
    'trade': [],
    'trade_long': [],
    'trade_break': [],
    'trading_status': [],
    'auction_update':[],
    'auction_summary':[],
    'retail_price_improvement': [],
    'counts': []
  }
  symbol_clear_count = 0
  add_order_count = 0
  add_order_long_count = 0
  order_executed_count = 0
  order_cancel_count = 0
  trade_count = 0
  trade_long_count = 0
  trade_break_count = 0
  trading_status_count = 0
  auction_update_count = 0
  auction_summary_count = 0
  retail_price_improvement_count = 0
  for message in iterable:
      if message[0] == 'S':
          message = message[1:]
      message_type = message[8]
      if message_type == 's':
        message_type_full_name = 'Symbol Clear'
        stock_symbol = message[9:17].replace(' ', '')
        sc = {
            'message_type': message_type,
            'message_type_full_name': message_type_full_name,
            'stock_symbol': stock_symbol,
        }
        message_types['symbol_clear'].append(sc)
        symbol_clear_count += 1

      if message_type == 'A':
        message_type_full_name = 'Add Order'
        order_id = message[9:21]
        site_indicator = message[21:22]
        shares = message[22:28]
        stock_symbol = message[28:34].replace(' ', '')
        price = message[34:44]
        display = message[44:45]
        ao = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'site_indicator': site_indicator,
          'shares': int(shares),
          'stock_symbol': stock_symbol,
          'price': price,
          'display': display
        }
        message_types['add_order'].append(ao)
        add_order_count += 1
        
      if message_type == 'd':
        message_type_full_name = 'Add Order (Long)'
        order_id = message[9:21]
        site_indicator = message[21:22]
        shares = message[22:28]
        stock_symbol = message[28:36].replace(' ', '')
        price = message[36:46]
        display = message[46:47]
        participant_id = message[47:51]
        aol = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'site_indicator': site_indicator,
          'shares': int(shares),
          'stock_symbol': stock_symbol,
          'price': int(price),
          'display': display,
          'participant_id': participant_id
        }
        message_types['add_order_long'].append(aol)
        add_order_long_count += 1

      if message_type == 'E':
        message_type_full_name = 'Order Executed'
        order_id = message[9:21]
        executed_shares = message[21:27]
        oe = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'executed_shares': executed_shares
        }
        message_types['order_executed'].append(oe)
        order_executed_count += 1

      if message_type == 'X':
        message_type_full_name = 'Order Cancel'  
        order_id = message[9:21]
        canceled_shares = message[21:27]
        oc = {
        'message_type': message_type,
        'message_type_full_name': message_type_full_name,
        'order_id': order_id,
        'canceled_shares': canceled_shares
        }
        message_types['order_cancel'].append(oc)
        order_cancel_count += 1

      if message_type == 'P':
        message_type_full_name = 'Trade'
        order_id = message[9:21]
        site_indicator = message[21:22]
        shares = message[22:28]
        stock_symbol = message[28:34]
        price = message[34:44]
        trade = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'site_indicator': site_indicator,
          'shares': shares,
          'stock_symbol': stock_symbol,
          'price': price
        }
        message_types['trade'].append(trade)
        trade_count += 1

      if message_type == 'r':
        message_type_full_name = 'Trade (Long)'
        order_id = message[9:21]
        site_indicator = message[21:22]
        shares = message[22:28]
        stock_symbol = message[28:36]
        price = message[36:46]
        tl = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'site_indicator': site_indicator,
          'shares': shares,
          'stock_symbol': stock_symbol,
          'price': price
        }
        message_types['trade_long'].append(tl)
        trade_long_count += 1

      if message_type == 'B':
        message_type_full_name = 'Trade Break'
        execution_id = message[9:21]
        tb = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'execution_id': execution_id,
        }
        message_types['trade_break'].append(tb)
        trade_break_count += 1

      if message_type == 'H':
        message_type_full_name = 'Trading Status'
        stock_symbol = message[9:17]
        halt_status = message[17:18]
        reg_sho_action = message[18:19]
        ts = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'stock_symbol': stock_symbol,
          'halt_status': halt_status,
          'reg_sho_action': reg_sho_action
        }
        message_types['trading_status'].append(ts)
        trading_status_count += 1

      if message_type == 'I':
        message_type_full_name = 'Auction Update'
        stock_symbol = message[9:17]
        auction_type = message[17:18]
        ref_price = message[18:28]
        buy_shares = message[28:38]
        sell_shares = message[38:48]
        indicative_price = message[48:58]
        auction_only_price = message[58:68]
    
        au = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'stock_symbol': stock_symbol,
          'auction_type': auction_type,
          'ref_price': ref_price,
          'buy_shares': buy_shares,
          'sell_shares': sell_shares,
          'indicative_price': indicative_price,
          'auction_only_price': auction_only_price,
        }
        message_types['auction_update'].append(au)
        auction_update_count += 1

      if message_type == 'J':
        message_type_full_name = 'Auction Summary'
        stock_symbol = message[9:17]
        auction_type = message[17:18]
        price = message[18:28]
        shares = message[28:38]
        
        aucsum = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'stock_symbol': stock_symbol,
          'auction_type': auction_type,
          'price': price,
          'shares': shares,
        }
        message_types['auction_summary'].append(aucsum)
        auction_summary_count += 1

      if message_type == 'R':
        message_type_full_name = 'Retail Price Improvement'
        stock_symbol = message[9:17]
        rpi =  message[17:18]
        retail_price = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'stock_symbol': stock_symbol,
          'rpi': rpi
        }
        message_types['retail_price_improvement'].append(retail_price)
        retail_price_improvement_count += 1

  total_count = (retail_price_improvement_count + trade_count + add_order_count + trade_long_count + trade_break_count + order_cancel_count + symbol_clear_count + add_order_long_count + auction_update_count + order_executed_count + trading_status_count + auction_summary_count)
  print(total_count)
  counter = {
      'total_count' : total_count,
      'symbol_clear_count' : symbol_clear_count,
      'add_order_count' : add_order_count ,
      'add_order_long_count' : add_order_long_count ,
      'order_executed_count' : order_executed_count ,
      'order_cancel_count' : order_cancel_count,
       'trade_count' : trade_count,
       'trade_long_count' : trade_long_count,
       'trade_break_count' : trade_break_count,
       'trading_status_count' : trading_status_count,
       'auction_update_count' : auction_update_count,
       'auction_summary_count': auction_summary_count,
       'retail_price_improvement_count' : retail_price_improvement_count
  }
  message_types['counts'].append(counter)
  return message_types


{% if message.name == 'Add Order' %}
    {% for entry in data.add_order%}

    {% endfor %}

    {% elif message.name == 'Add Order (Long)' %}
    {{data.add_order_long}}
    {% elif message.name == 'Auction Summary' %}
    {{data.auction_summary}}
    {% elif message.name == 'Auction Update' %}
    {{data.auction_update}}
    {% elif message.name == 'Order Cancel' %}
    {{data.order_cancel}}
    {% elif message.name == 'Order Executed' %}
    {{data.order_executed}}
    {% elif message.name == 'Trade' %}
    {{data.trade}}
    {% elif message.name == 'Trade (Long)' %}
    {{data.trade_long}}
    {% elif message.name == 'Trade Break' %}
    {{data.trade_break}}
    {% elif message.name == 'Trading Status' %}
    {{data.trading_status}}
    {% elif message.name == 'Symbol Clear' %}
    {{data.symbol_clear}}
    {% elif message.name == 'Retail Price Improvement' %}
    {{data.retail_price_improvement}}
    {% endif %}