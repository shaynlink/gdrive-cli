import { Argument, Command } from 'commander';
import { writeEnv } from '../helpers/env.js';
import chalk from 'chalk';

export default new Command('config-set')
  .addArgument(new Argument('key', 'The key to set'))
  .addArgument(new Argument('Value', 'The value to set'))
  .action((key, value) => {
    console.log(`Setting "${chalk.blue(key)}" to "${chalk.blue(value)}"`);
    writeEnv(key, value);
  });
