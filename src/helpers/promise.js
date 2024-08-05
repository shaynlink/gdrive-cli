import chalk from 'chalk';

export function handle(fn) {
  return fn
    .then((res) => res)
    .catch((err) => {
      console.error('Error:', chalk.red(err.message));
      process.exit(1);
    })
}