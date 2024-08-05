import { Argument, Command } from 'commander';
import drive from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';
import chalk from 'chalk';
import { convertBytes } from '../helpers/utils.js';

export default new Command('files')
  .addArgument(new Argument('[path]', 'The path of the file'))
  .option('-s, --size', 'The size of files')
  .option('-m, --mimeType', 'The mimeType of files')
  .option('-t, --trashed', 'Show\'s trashed files')
  .action(async (path, options) => {
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
        fields: 'files(id, name)'
      }));

      if (res.data.files.length === 0) {
        console.error('Folder not found');
        process.exit(1);
      }


      const folder = res.data.files.find(f => f.name === nextSegment);

      if (!folder) {
        console.error('Folder %s not found', nextSegment);
        process.exit(1);
      }

      lastFolderId = folder.id;

      console.log('Folder find: %s', chalk.blue(folder.name));
      console.log('Folder id: %s', chalk.blue(folder.id));

    } while (!done);

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
