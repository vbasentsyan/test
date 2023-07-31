import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

import {closeConnection, connect} from './connection';
import {fetchAndStorePrices} from "./fetchAndStorePrices";

// export const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3/ticker/price';
// const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT'];


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
    try {
        const fetched = await fetchAndStorePrices();
        console.log('fetched============', fetched);

        return {
            statusCode: 200,
            body: fetched.body,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: {
                message: `${err}`,
            },
        };
    }
};

// export async function fetchAndStorePrices() {
//     try {
//         const prices: Record<string, number> = {};
//         for (const symbol of SYMBOLS) {
//             const response = await axios.get(`${BINANCE_API_BASE_URL}?symbol=${symbol}`);
//             if (response && response.data && response.data.price) {
//                 prices[symbol] = parseFloat(response.data.price);
//             }
//         }
//         console.log('Fetched prices:', prices);
//
//         await savePricesToDatabase(prices);
//
//         return {
//             statusCode: 200,
//             body: prices,
//         };
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Failed to fetch data from Binance API' }),
//         };
//     }
// }
//
// async function savePricesToDatabase(prices: Record<string, number>): Promise<any> {
//     const connection = await connect();
//
//     const insertValues = Object.keys(prices).map((symbol) => `('${symbol}', ${prices[symbol]})`);
//     const createTable = `CREATE TABLE IF NOT EXISTS prices (
//             symbol VARCHAR(50) NOT NULL,
//             price DECIMAL(10, 2) NOT NULL
//         )`;
//     const insertQuery = `INSERT INTO prices (symbol, price) VALUES ${insertValues.join(',')}`;
//
//     const createTableResult = await connection.query(createTable);
//
//     const insertQueryResult = await connection.query(insertQuery);
//
//     console.log('createTableResult=====:', createTableResult);
//
//     console.log('insertQueryResult=====', insertQueryResult);
//     await connection.release()
//     await closeConnection()
// }
