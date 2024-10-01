import { Command, Argument } from 'commander';
import chalk from 'chalk';
import drive, { navigateWithPath } from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';

export default new Command('copy-all')
  .addArgument(new Argument('[oldPath]', 'Current path of the files to copy'))
  .addArgument(new Argument('[path]', 'The path to move the file to'))
  .action(async (oldPath, newPath) => {
    const lastOldFolderId = await navigateWithPath(oldPath);
    const lastNewFolderId = await navigateWithPath(newPath);

    console.log('> Copying all files to: (%s)', chalk.green(oldPath), lastOldFolderId);
      
    const files = [];
    let pageToken = null;

    do {
      const response = await handle(drive.files.list({
        q: `'${lastOldFolderId}' in parents`,
        fields: 'files(id, name), nextPageToken',
        pageToken,
      }));

      console.log('%s files added (page token: %s)', files.push(...response.data.files), response.data.nextPageToken);
      pageToken = response.data.nextPageToken;
    } while (pageToken);


    for (const file of files) {
      await handle(drive.files.copy({
        fileId: file.id,
        requestBody: {
          parents: [lastNewFolderId]
        }
      }));
      console.log('> Successfully copied file (%s | %s) to:', file.name, file.id, chalk.green(newPath));
    }

    console.log('> Successfully copied all files to:', chalk.green(newPath));
    return;
  })
  