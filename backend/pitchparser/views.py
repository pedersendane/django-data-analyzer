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
    print(data)
    #topTen = extract_top_ten_symbols_from_volume(volume)
    #for symbol, value in topTen:
           # print ("{} {}".format(symbol, value))
    return JsonResponse(data, safe=False)
    #return JsonResponse(json.dumps(['data', data]), safe=False)

    

def pitch_parser(iterable):
  """
  Takes an iterable containing PITCH messages and returns a dictionary
  with all the symbols as keys and all the executed volume as values
  """
  message_types = [];
  for message in iterable:
      if message[0] == 'S':
          message = message[1:]
      message_type = message[8]
      if message_type == 's':
        message_type_full_name = 'Symbol Clear'
        stock_symbol = message[9:17].replace(' ', '')
        symbol_clear = {
            'message_type': message_type,
            'message_type_full_name': message_type_full_name,
            'stock_symbol': stock_symbol,
        }
        message_types.append(symbol_clear)
      
      if message_type == 'A':
        message_type_full_name = 'Add Order'
        order_id = message[9:21]
        site_indicator = message[21:22]
        shares = message[22:28]
        stock_symbol = message[28:34].replace(' ', '')
        price = message[34:44]
        display = message[44:45]
        add_order = {
            'message_type': message_type,
            'message_type_full_name': message_type_full_name,
            'order_id': order_id,
            'site_indicator': site_indicator,
            'shares': int(shares),
            'stock_symbol': stock_symbol,
            'price': price,
            'display': display
        }
        message_types.append(add_order)
        
      if message_type == 'd':
        message_type_full_name = 'Add Order (Long)'
        order_id = message[9:21]
        site_indicator = message[21:22]
        shares = message[22:28]
        stock_symbol = message[28:36].replace(' ', '')
        price = message[36:46]
        display = message[46:47]
        participant_id = message[47:51]
        add_order_long = {
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
        message_types.append(add_order_long)

      if message_type == 'E':
        message_type_full_name = 'Order Executed'
        order_id = message[9:21]
        executed_shares = message[21:27]
        order_executed = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'executed_shares': executed_shares
        }
        message_types.append(order_executed)

      if message_type == 'X':
        message_type_full_name = 'Order Cancel'  
        order_id = message[9:21]
        canceled_shares = message[21:27]
        order_cancel = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'canceled_shares': canceled_shares
        }
        message_types.append(order_cancel)

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
        message_types.append(trade)

      if message_type == 'r':
        message_type_full_name = 'Trade (Long)'
        order_id = message[9:21]
        site_indicator = message[21:22]
        shares = message[22:28]
        stock_symbol = message[28:36]
        price = message[36:46]

        trade_long = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'order_id': order_id,
          'site_indicator': site_indicator,
          'shares': shares,
          'stock_symbol': stock_symbol,
          'price': price
        }

        message_types.append(trade_long)

      if message_type == 'B':
        message_type_full_name = 'Trade Break'
        execution_id = message[9:21]
        trade_break = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'execution_id': execution_id,
        }

        message_types.append(trade_break)

      if message_type == 'H':
        message_type_full_name = 'Trading Status'
        stock_symbol = message[9:17]
        halt_status = message[17:18]
        reg_sho_action = message[18:19]
        trading_status = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'stock_symbol': stock_symbol,
          'halt_status': halt_status,
          'reg_sho_action': reg_sho_action
        }
        message_types.append(trading_status)

      if message_type == 'I':
        message_type_full_name = 'Auction Update'
        stock_symbol = message[9:17]
        auction_type = message[17:18]
        ref_price = message[18:28]
        buy_shares = message[28:38]
        sell_shares = message[38:48]
        indicative_price = message[48:58]
        auction_only_price = message[58:68]
    
        auction_update = {
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
        message_types.append(auction_update)

      if message_type == 'J':
        message_type_full_name = 'Auction Summary'
        stock_symbol = message[9:17]
        auction_type = message[17:18]
        price = message[18:28]
        shares = message[28:38]
        
        auction_summary = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'stock_symbol': stock_symbol,
          'auction_type': auction_type,
          'price': price,
          'shares': shares,
        }
        message_types.append(auction_summary)

      if message_type == 'R':
        message_type_full_name = 'Retail Price Improvement'
        stock_symbol = message[9:17]
        rpi =  message[17:18]
        retail_price_improvement = {
          'message_type': message_type,
          'message_type_full_name': message_type_full_name,
          'stock_symbol': stock_symbol,
          'rpi': rpi
        }
        message_types.append(retail_price_improvement)

  return message_types


def extract_top_ten_symbols_from_volume(volume):
  """
  Takes a volume and returns a tuple of the first ten symbols by
  executed volume
  """
  symbol_clear = {
            'message_type': 'T',
            'message_type_full_name': 'Full Test',
            'stock_symbol': 'yes',
        }
  
  sorted_volume = sorted(
      volume.items(), key=operator.itemgetter(1), reverse=True
  )
  return tuple(sorted_volume[:10])


