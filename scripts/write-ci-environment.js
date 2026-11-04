'use strict';

const fs = require('fs');
const path = require('path');

const serverUrl = (process.env.SERVER_URL || '').trim();

if (serverUrl === '') {
  console.error('SERVER_URL is empty. Refusing to write a CI environment.');
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(serverUrl);
} catch (error) {
  console.error(`SERVER_URL is not an absolute URL: ${error.message}`);
  process.exit(1);
}

if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
  console.error(`SERVER_URL must use http or https. Found ${parsed.protocol}`);
  process.exit(1);
}

const environment = {
  name: 'ci',
  values: [
    {
      key: 'server_url',
      value: serverUrl,
      type: 'default',
      enabled: true
    }
  ]
};

const outputPath = path.join(__dirname, '..', 'ci.postman_environment.json');
fs.writeFileSync(outputPath, `${JSON.stringify(environment, null, 2)}\n`);
console.log(`Wrote CI environment with server_url host ${parsed.host}.`);
