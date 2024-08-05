import { Argument, Command } from 'commander';
import { getEnvKey } from '../helpers/env.js';
import chalk from 'chalk';

export default new Command('config-get')
  .addArgument(new Argument('key', 'The key to set'))
  .action((key) => {
    console.log(`config "${chalk.blue(key)}" -> "${chalk.blue(getEnvKey(key))}"`);
  });
