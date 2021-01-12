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

const app = require('./app.js');
const {logger} = require('./logging');
const {fetchProjectId} = require('./metadata');
const {initTracing} = require('./middleware');

const PORT = process.env.PORT || 8080;
const startServer = () => {
  app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
};

const main = async () => {
  let project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) {
    project = fetchProjectId();
  }
  initTracing(project); // Pass project Id to tracing middleware
  startServer();
};

// Listen for SIGTERM signal
process.on('SIGTERM', () => {
  // Clean up resources on shutdown
  logger.info('Caught SIGTERM.');
  logger.end();
  logger.on('finish', () => {
    console.log('Logs flushed.');
    process.exit(0);
  });
});

main();
