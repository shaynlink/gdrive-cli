import { Command, Argument } from 'commander';
import chalk from 'chalk';
import drive, { navigateWithPath } from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';

export default new Command('copy')
  .addArgument(new Argument('[id]', 'The id of the file'))
  .addArgument(new Argument('[path]', 'The path to move the file to'))
  .action(async (id, path) => {
    const lastFolderId = await navigateWithPath(path);

    await handle(drive.files.copy({
      fileId: id,
      requestBody: {
        parents: [lastFolderId]
      }
    }));

    console.log('> Successfully copy file to:', chalk.green(path));
  })
  