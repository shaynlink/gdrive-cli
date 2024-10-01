import { verifyEnv } from '../src/helpers/env.js';
import configSet from './commands/Config-Set.js';
import configList from './commands/Config-List.js';
import configGet from './commands/Config-Get.js';
import ls from './commands/Ls.js';
import file from './commands/File.js';
import move from './commands/Move.js';
import moveAll from './commands/Move-All.js';
import copy from './commands/Copy.js';
import copyAll from './commands/Copy-All.js';

/**
 * @param {import('commander').Command} program 
 */
export default function registers(program) {
  program.addCommand(configSet);
  program.addCommand(configList);
  program.addCommand(configGet);
  program.addCommand(ls);
  program.addCommand(file);
  program.addCommand(move);
  program.addCommand(moveAll);
  program.addCommand(copy);
  program.addCommand(copyAll);

  program.hook('preAction', ({ args }) => {
    const [cmd] = args;

    if (cmd === 'config-set') return;
    
    if (!verifyEnv()) {
      console.error('Please set the environment variables before using this command');
      process.exit(1);
    }
  })
}
