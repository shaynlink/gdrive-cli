import { verifyEnv } from '../src/helpers/env.js';
import configSet from './commands/Config-Set.js';
import configList from './commands/Config-List.js';
import configGet from './commands/Config-Get.js';
import files from './commands/Files.js';
import file from './commands/File.js';

/**
 * @param {import('commander').Command} program 
 */
export default function registers(program) {
  program.addCommand(configSet);
  program.addCommand(configList);
  program.addCommand(configGet);
  program.addCommand(files);
  program.addCommand(file);

  program.hook('preAction', ({ args }) => {
    const [cmd] = args;

    if (cmd === 'config-set') return;
    
    if (!verifyEnv()) {
      console.error('Please set the environment variables before using this command');
      process.exit(1);
    }
  })
}
