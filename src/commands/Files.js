import { Argument, Command } from 'commander';
import drive, { navigateWithPath } from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';
import chalk from 'chalk';
import { convertBytes } from '../helpers/utils.js';

export default new Command('files')
  .addArgument(new Argument('[path]', 'The path of the file'))
  .option('-s, --size', 'The size of files')
  .option('-m, --mimeType', 'The mimeType of files')
  .option('-t, --trashed', 'Show\'s trashed files')
  .action(async (path, options) => {
   const lastFolderId = await navigateWithPath(path);

    console.log('Last folder id:', chalk.blue(lastFolderId));

    const projection = ['name', 'id'];
    if (options.size) {
      projection.push('size');
    }
    if (options.mimeType) {
      projection.push('mimeType');
    }

    const fields = `files(${projection.join(',')})`

    const res = await handle(drive.files.list({
      q: `'${lastFolderId}' in parents ${options.trashed ? 'and trashed = true' : ''}`,
      fields
    }));

    console.log('[ID] NAME - ', projection.map((p) => p.toUpperCase()).join(' - '));

    res.data.files.map(
      (file) => console.log(
        '> [%s] %s' + projection
          .slice(2)
          .map((p, _, opt) => {
            return p === 'size'
              ? ` - ${opt.includes('mimeType') && file.mimeType === 'application/vnd.google-apps.folder' ? 'No' : convertBytes(file.size)}`
              : ` - ${file[p]}`;
          }).join(''),
        file.id,
        chalk.blue(file.name),
      )).join('\n');

    process.exit(0);
  });
