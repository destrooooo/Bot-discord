const { GG_API_KEY, GG_CX } = require("./config.json");
const args = process.argv.slice(2);
const queryArg = args[0];

// Following code adapted from https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/customsearch/customsearch.js

// Copyright 2012 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

("use strict");

// Object to store the array of search results
let SearchResult = class {
  constructor(resultArray) {
    this.resultArray = resultArray;
    this.currentResult = 0;
  }

  currentSearch() {
    return this.resultArray[this.currentResult];
  }

  nextSearch() {
    this.currentResult++;
    if (this.currentResult >= this.resultArray.length) {
      this.currentResult = 0;
    }
    return this.currentSearch();
  }

  prevSearch() {
    this.currentResult--;
    if (this.currentResult < 0) {
      this.currentResult = this.resultArray.length - 1;
    }
    return this.currentSearch();
  }
};

const { google } = require("googleapis");
const customsearch = google.customsearch("v1");

// Search Google Images for "query"
async function search(query) {
  const res = await customsearch.cse.list({
    cx: GG_CX,
    q: query,
    auth: GG_API_KEY,
    searchType: "image",
  });
  // Create the SearchResult object
  const result = new SearchResult(res.data.items);
  return result;
}

// Used to run this file externally using 'node image_search.js <query>'
if (module === require.main) {
  search(queryArg).catch(console.error);
}

module.exports = {
  search,
};
