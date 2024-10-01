import { readFileSync } from 'node:fs';
import { env } from 'node:process';
import { google } from 'googleapis';
import { prepareEnv } from './env.js';
import { handle } from './promise.js';
import chalk from 'chalk';
import { log } from './utils.js';

function loadSavedCredentials() {
  prepareEnv();
  const content = readFileSync(env.GCLOUD_TOKEN_PATH);
  const credentials = JSON.parse(content);
  return google.auth.fromJSON(credentials);
}

const drive = google.drive({
  version: 'v3',
  auth: loadSavedCredentials()
});

export async function navigateWithPath(path) {
  const destructedPath = path.split('/');

  let lastFolderId = '';
  let index = 0;
  let done = false;

  do {
    const segment = destructedPath[index];
    const nextSegment = destructedPath[index + 1];

    if (segment === '') {
      lastFolderId = 'root';
    }

    if (index == destructedPath.length - 1 || nextSegment === '') {
      done = true;
      break;
    }

    index++;

    const res = await handle(drive.files.list({
      q: `'${lastFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    }));

    if (res.data.files.length === 0) {
      console.error('Folder not found');
      process.exit(1);
    }

    const folder = res.data.files.find(f => f.name === nextSegment);

    if (!folder) {
      console.error('Folder %s not found', nextSegment ?? 'unknown');
      process.exit(1);
    }

    lastFolderId = folder.id;

    log('Folder find: %s', chalk.blue(folder.name));
    log('Folder id: %s', chalk.blue(folder.id));
  } while (!done);

  return lastFolderId;
}

export async function* getFilesFromFolderParentId(folderParentId, fields = 'files(id, name)') {
  let pageToken;

  fields += ', nextPageToken';

  do {
    const response = await handle(drive.files.list({
      q: `'${folderParentId}' in parents and trashed = false`,
      fields,
      pageToken,
    }));

    pageToken = response.data.nextPageToken;

    yield response.data.files;
  } while (pageToken);
}

export function createPagination(pages) {
  return async function pagination(handler, config) {
    let page = 0;
    const files = [];
    let nextPageToken;

    config.fields ??= '';
    config.fields += ', nextPageToken';
    config.pageSize ??= 100;
    config.pageToken ??= nextPageToken;

    while (page < pages) {
      nextPageToken && (config.pageToken = nextPageToken);

      const res = await handler.call(drive, config)
        .then((response) => {
          nextPageToken = response.data.nextPageToken;
          return response;
        })

      log('newt page token:', nextPageToken)

      files.push(...res.data.files);
      
      if (!nextPageToken) {
        break;
      }
    }

    return files;
  }
}

export default drive;