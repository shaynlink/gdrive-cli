import { readFileSync } from 'node:fs';
import { env } from 'node:process';
import { google } from 'googleapis';
import { prepareEnv } from './env.js';

function loadSavedCredentials() {
  prepareEnv();
  const content = readFileSync(env.GCLOUD_TOKEN_PATH);
  const credentials = JSON.parse(content);
  return google.auth.fromJSON(credentials);
}

export default google.drive({
  version: 'v3',
  auth: loadSavedCredentials()
});