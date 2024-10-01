import { Argument, Command } from 'commander';
import drive, { navigateWithPath, createPagination } from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';
import chalk from 'chalk';
import { convertBytes, log } from '../helpers/utils.js';

export default new Command('ls')
  .addArgument(new Argument('[path]', 'The path of the file'))
  .option('-s, --size', 'The size of files')
  .option('-m, --mimeType', 'The mimeType of files')
  .option('-t, --trashed', 'Show\'s trashed files')
  .option('-a', '--all', 'List all files')
  .action(async (path, options) => {
   const lastFolderId = await navigateWithPath(path);
   const pagination = createPagination(options.all ?? Number.MAX_SAFE_INTEGER);

    log('Last folder id:', chalk.blue(lastFolderId));

    const projection = ['name', 'id'];

    options.size && projection.push('size');
    options.mimeType && projection.push('mimeType');
    options.trashed && projection.push('trashed');

    const fields = `files(${projection.join(',')})`

    const files = await handle(pagination(drive.files.list, {
      q: `'${lastFolderId}' in parents${options.trashed ? ' and (trashed = true or trashed = false)' : ''}`,
      fields
    }));

    console.log('[ID] NAME - ', projection.map((p) => p.toUpperCase()).join(' - '));

    files.map(
      (file) => console.log(
        '> [%s] %s' + projection
          .slice(2)
          .map((p, _, opt) => {
            return p === 'size'
              ? ` - ${opt.includes('mimeType') && file.mimeType === 'application/vnd.google-apps.folder' ? 'No size' : convertBytes(file.size)}`
              : ` - ${file[p]}`;
          }).join(''),
        file.id,
        file.trashed ? `🗑️ ${chalk.yellow(file.name)}` : chalk.blue(file.name),
      )).join('\n');

    process.exit(0);
  });
