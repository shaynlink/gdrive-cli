import { Command, Argument } from 'commander';
import chalk from 'chalk';
import drive, { navigateWithPath, getFilesFromFolderParentId } from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';

export default new Command('move-all')
  .addArgument(new Argument('[oldPath]', 'Current path of the files to move'))
  .addArgument(new Argument('[newPath]', 'The path to move the file to'))
  .option('-p, --parents [parents...]', 'The parents of the file')
  .action(async (oldPath, newPath, options) => {
    const lastOldFolderId = await navigateWithPath(oldPath);
    const lastNewFolderId = await navigateWithPath(newPath);

    for await (const files of getFilesFromFolderParentId(lastOldFolderId, 'files(id, name, parents)')) {
      for (const file of files) {
        const update = {
          fileId: file.id,
          addParents: lastNewFolderId,
          removeParents: file.parents.join(','),
        };
        
        if (options.parents) {
          update.removeParents = [update.removeParents, options.parents].join(',');
        }
    
        await handle(drive.files.update(update));
        console.log('> Successfully moved file (%s | %s) to: %s (%s)', chalk.blue(file.name), chalk.blue(file.id), chalk.green(newPath), chalk.blue(lastNewFolderId));
      }
    }

    console.log('> Successfully moved all files to:', chalk.green(newPath));
  })
  