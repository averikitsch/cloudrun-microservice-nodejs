// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const gcpMetadata = require('gcp-metadata');
const {GoogleAuth} = require('google-auth-library');
const auth = new GoogleAuth();

async function fetchProjectId() {
  return await auth.getProjectId();
}

// Use token with Authorization header to create authenticated requests
async function fetchIdToken(url) {
  const client = await auth.getIdTokenClient(url);
  const header = await client.getRequestHeaders();
  const authorization = header['Authorization'];
  return authorization.split(' ')[1].trim(); // Return only the token
}

async function fetchServiceRegion() {
  let region = undefined;
  if (gcpMetadata.isAvailable()) {
    region = await gcpMetadata.instance('region'); // format: projects/PROJECT_NUMBER/regions/REGION
  }
  return region;
}

module.exports = {
  fetchProjectId,
  fetchIdToken,
  fetchServiceRegion,
};
