'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { Collection } = require('postman-collection');

const root = path.resolve(__dirname, '..');
const collectionPath = path.join(root, 'Urban.Grocers.postman_collection.json');
const environmentPath = path.join(root, 'tripleten_qa_api.postman_environment.json');
const COLLECTION_SCHEMA = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(filePath) {
  let text;
  try {
    text = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    fail(`Cannot read ${path.basename(filePath)}: ${error.message}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${path.basename(filePath)} is not valid JSON: ${error.message}`);
  }
}

function scriptSource(script, label) {
  if (!script || script.exec == null) {
    return '';
  }

  const { exec } = script;
  if (typeof exec === 'string') {
    return exec;
  }

  if (!Array.isArray(exec) || exec.some((line) => typeof line !== 'string')) {
    fail(`${label} script.exec must be a string or an array of strings`);
  }

  return exec.join('\n');
}

function countRequests(items, trail) {
  if (!Array.isArray(items)) {
    fail(`${trail} must be an array`);
  }

  let count = 0;
  for (const item of items) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      fail(`${trail} contains an entry that is not an object`);
    }

    const name = typeof item.name === 'string' && item.name.trim() !== '' ? item.name : '(unnamed)';
    if (Array.isArray(item.item)) {
      count += countRequests(item.item, `${trail} / ${name}`);
      continue;
    }

    if (!item.request || typeof item.request !== 'object' || Array.isArray(item.request)) {
      fail(`"${name}" has no request object`);
    }

    if (typeof item.request.method !== 'string' || item.request.method.trim() === '') {
      fail(`"${name}" is missing a request method`);
    }

    const url = item.request.url;
    const rawUrl = typeof url === 'string' ? url : url && typeof url === 'object' ? url.raw : '';
    if (typeof rawUrl !== 'string' || rawUrl.trim() === '') {
      fail(`"${name}" is missing a request URL`);
    }

    const events = Array.isArray(item.event) ? item.event : [];
    for (const event of events) {
      if (!event || (event.listen !== 'test' && event.listen !== 'prerequest')) {
        continue;
      }

      const source = scriptSource(event.script, `"${name}" ${event.listen}`);
      try {
        new vm.Script(source, { filename: `${name}.${event.listen}.js` });
      } catch (error) {
        fail(`JavaScript syntax error in ${event.listen} script "${name}": ${error.message}`);
      }
    }

    count += 1;
  }

  return count;
}

const collectionJson = readJson(collectionPath);

if (!collectionJson.info || collectionJson.info.schema !== COLLECTION_SCHEMA) {
  fail(`Collection schema must be ${COLLECTION_SCHEMA}`);
}

if (typeof collectionJson.info.name !== 'string' || collectionJson.info.name.trim() === '') {
  fail('Collection info.name must be a non-empty string');
}

const requestCount = countRequests(collectionJson.item, 'item');
if (requestCount === 0) {
  fail('Collection parsed but contains no requests');
}

let collection;
try {
  collection = new Collection(collectionJson);
} catch (error) {
  fail(`Postman Collection SDK rejected the file: ${error.message}`);
}

let sdkRequestCount = 0;
let testCount = 0;
collection.forEachItem((item) => {
  sdkRequestCount += 1;
  item.events.each((event) => {
    if (event.listen !== 'test') {
      return;
    }
    const source = event.script.toSource();
    testCount += (source.match(/pm\.test\s*\(/g) || []).length;
  });
  const method = item.request.method;
  const url = item.request.url.toString();
  console.log(`${method} ${url} — ${item.name}`);
});

if (sdkRequestCount !== requestCount) {
  fail(`JSON contains ${requestCount} requests but the Postman Collection SDK loaded ${sdkRequestCount}`);
}

const environmentJson = readJson(environmentPath);
if (!Array.isArray(environmentJson.values)) {
  fail('Environment values must be an array');
}

const serverUrl = environmentJson.values.find((entry) => {
  return entry && entry.key === 'server_url' && entry.enabled !== false;
});

if (!serverUrl || typeof serverUrl.value !== 'string' || serverUrl.value.trim() === '') {
  fail('Environment is missing an enabled server_url value');
}

let parsedUrl;
try {
  parsedUrl = new URL(serverUrl.value);
} catch (error) {
  fail(`server_url is not an absolute URL: ${error.message}`);
}

if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
  fail(`server_url must use http or https. Found ${parsedUrl.protocol}`);
}

const environmentName = typeof environmentJson.name === 'string' ? environmentJson.name : '(unnamed)';
console.log(`Collection "${collection.name}" parsed: ${sdkRequestCount} requests, ${testCount} pm.test calls.`);
console.log(`Environment "${environmentName}" parsed; server_url host is ${parsedUrl.host}.`);
