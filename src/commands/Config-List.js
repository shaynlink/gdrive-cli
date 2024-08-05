import { Command } from 'commander';
import chalk from 'chalk';

export default new Command('config-list')
  .action(async () => {
    console.log(chalk.blue('List of config values are:'));
    console.log(chalk.blue('gcloud_credential_path, gcloud_token_path'));
  });
