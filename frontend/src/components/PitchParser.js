import React, { useState } from 'react'
import uploadFilesService from '../services/upload-files.service';

function PitchParser(data) {
    const [parserData, setParserData] = useState({data: ''})
    if (data !== null) {
        console.log(data.data.data)
        const selector = data.data.data;
        let symbol_clear = selector.filter(a => a.message_type === 's')
        let add_order = selector.filter(a => a.message_type === 'A')
        let add_order_long = selector.filter(a => a.message_type === 'd') 
        let order_executed = selector.filter(a => a.message_type === 'E') 
        let order_cancel = selector.filter(a => a.message_type === 'X') 
        let trade = selector.filter(a => a.message_type === 'P') 
        let trade_long = selector.filter(a => a.message_type === 'r') 
        let trade_break = selector.filter(a => a.message_type === 'B') 
        let trading_status = selector.filter(a => a.message_type === 'H') 
        let auction_update = selector.filter(a => a.message_type === 'I') 
        let auction_summary = selector.filter(a => a.message_type === 'J') 
        let rpi = selector.filter(a => a.message_type === 'R') 
        
    return (
        <div>
            <ul>
                <li>
                    
                </li>
            </ul>
            
        </div>
    )
    }
    
}

export default PitchParser
