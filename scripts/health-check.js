#!/usr/bin/env node

const https = require('https');
const http = require('http');
require('dotenv').config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || 'Store';

if (!API_URL) {
  console.error('❌ NEXT_PUBLIC_API_URL is not configured in .env file');
  process.exit(1);
}

console.log(`🏪 ${STORE_NAME} - API Health Check`);
console.log(`🔍 Checking API endpoint: ${API_URL}`);

const checkAPI = () => {
  return new Promise((resolve, reject) => {
    const client = API_URL.startsWith('https:') ? https : http;
    
    const request = client.get(API_URL, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const products = JSON.parse(data);
            if (Array.isArray(products) && products.length > 0) {
              resolve({
                status: 'success',
                productsCount: products.length,
                statusCode: response.statusCode
              });
            } else {
              reject({
                status: 'error',
                message: 'API returned empty or invalid product data',
                statusCode: response.statusCode
              });
            }
          } catch (error) {
            reject({
              status: 'error',
              message: 'Invalid JSON response from API',
              statusCode: response.statusCode,
              error: error.message
            });
          }
        } else {
          reject({
            status: 'error',
            message: `API returned status code: ${response.statusCode}`,
            statusCode: response.statusCode
          });
        }
      });
    });
    
    request.on('error', (error) => {
      reject({
        status: 'error',
        message: 'Failed to connect to API',
        error: error.message
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject({
        status: 'error',
        message: 'API request timeout (10s)'
      });
    });
  });
};

// Run the health check
checkAPI()
  .then((result) => {
    console.log(`✅ API is healthy! Found ${result.productsCount} products`);
    console.log(`🚀 ${STORE_NAME} is ready to serve customers!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`❌ API Health Check Failed:`);
    console.error(`   Message: ${error.message}`);
    if (error.statusCode) {
      console.error(`   Status Code: ${error.statusCode}`);
    }
    if (error.error) {
      console.error(`   Error Details: ${error.error}`);
    }
    console.error(`⚠️  ${STORE_NAME} may not function properly!`);
    process.exit(1);
  });