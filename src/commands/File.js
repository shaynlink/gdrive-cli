import { Command, Argument } from 'commander';
import drive from '../helpers/drive.js';
import { handle } from '../helpers/promise.js';
import chalk from 'chalk';
import { convertBytes } from '../helpers/utils.js';
import { createWriteStream } from 'node:fs';
import { resolve, join } from 'node:path';

export default new Command('file')
  .addArgument(new Argument('[id]', 'The id of the file'))
  .option('-d, --download [path]', 'Download the file')
  .action(async (id, { download }) => {
    const res = await handle(drive.files.get({
      fileId: id,
      fields: 'id, name, mimeType, size, parents, permissions'
    }));

    const { data } = res;

    console.log('File id:', chalk.blue(data.id));
    console.log('File name:', chalk.blue(data.name));
    console.log('File mimeType:', chalk.blue(data.mimeType));
    console.log('File size:', chalk.blue(convertBytes(data.size)));
    console.log('File permissions:', chalk.blue(data.permissions.map(p => `${p.role} : ${p.emailAddress}`).join(', ')));

    data.parents ?? console.log('Parents:', chalk.blue(data.parents.join(', ')));

    if (download) {
      const dest = resolve(join(download, data.name));
      const destStream = createWriteStream(dest);
      const stream = await handle(drive.files.get({
        fileId: id,
        alt: 'media'
      }, { responseType: 'stream' }));

      stream.data.pipe(destStream);

      destStream.on('finish', () => {
        console.log('File downloaded to:', chalk.green(dest));
      });
    }
  });
