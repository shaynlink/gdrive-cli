import { Command, Argument } from 'commander';
import chalk from 'chalk';
import drive, { navigateWithPath } from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';

export default new Command('move')
  .addArgument(new Argument('[id]', 'The id of the file'))
  .addArgument(new Argument('[path]', 'The path to move the file to'))
  .option('-p, --parents [parents...]', 'The parents of the file')
  .action(async (id, path, options) => {
    const lastFolderId = await navigateWithPath(path);

    const update = {
      fileId: id,
      addParents: lastFolderId,
    };
    
    if (options.parents) {
      update.removeParents = options.parents.join(',');
    }

    await handle(drive.files.update(update));

    console.log('> Successfully moved file to:', chalk.green(path));
  })
  