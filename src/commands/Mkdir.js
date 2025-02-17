import { Argument, Command } from 'commander';
import drive, { navigateWithPath } from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';
import chalk from 'chalk';
import { log } from '../helpers/utils.js';

export default new Command('mkdir')
  .addArgument(new Argument('[path]', 'The path of parent folder'))
  .addArgument(new Argument('[name]', 'The name of the folder'))
  // .option('-r, --recursive', 'Create parent folders if not exists')
  .action(async (path, name, options) => {
    const lastFolderId = await navigateWithPath(path);

    log('Last folder id:', chalk.blue(lastFolderId));

    const res = await handle(drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [lastFolderId]
      }
    }));

    console.log('Folder created: %s (%s)', chalk.blue(res.data.id), chalk.green(res.data.name));
  });