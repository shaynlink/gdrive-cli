import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { env } from 'node:process';
import { execSync } from 'node:child_process';
import { BASE_CONFIG } from './constants.js';
import debug from 'debug'

const log = debug('gdrive-cli:env');

export function prepareEnv() {
  const homeDir = env.HOME || env.HOMEPATH || env.USERPROFILE || getHomeDirByCLI();

  const envFile = resolve(join(homeDir, '.gdrive-cli'));

  if (!existsSync(envFile)) {
    log('Creating env file');
    writeFileSync(envFile, JSON.stringify(BASE_CONFIG));
  }

  const envConfig = JSON.parse(readFileSync(envFile).toString('utf8'));

  env.GCLOUD_CREDENTIAL_PATH = envConfig.GCLOUD_CREDENTIAL_PATH;
  env.GCLOUD_TOKEN_PATH = envConfig.GCLOUD_TOKEN_PATH;

  log('Env prepared');
}

export function writeEnv(key, value) {
  key = key.toUpperCase();

  prepareEnv();

  const homeDir = env.HOME || env.HOMEPATH || env.USERPROFILE || getHomeDirByCLI();

  const envFile = resolve(join(homeDir, '.gdrive-cli'));

  const envConfig = JSON.parse(readFileSync(envFile).toString('utf8'));
  
  envConfig[key] = value;

  writeFileSync(envFile, JSON.stringify(envConfig));

  env.GCLOUD_CREDENTIAL_PATH = envConfig.GCLOUD_CREDENTIAL_PATH;
  env.GCLOUD_TOKEN_PATH = envConfig.GCLOUD_TOKEN_PATH;

  log('Env updated');
}

export function getEnvKey(key) {
  key = key.toUpperCase();

  prepareEnv();

  return env[key];
}

export function verifyEnv() {
  prepareEnv();

  return env.GCLOUD_CREDENTIAL_PATH?.length > 0 || env.GCLOUD_TOKEN_PATH?.length > 0;
}

export function getHomeDirByCLI() {
  return execSync('cd ~ && pwd').toString('utf8').trim();
}
