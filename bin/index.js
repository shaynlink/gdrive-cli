#!/usr/bin/env node

import { program } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { prepareEnv } from '../src/helpers/env.js';
import registersCmds from '../src/registers.js';

prepareEnv();

program
  .version(pkg.version)
  .description(pkg.description);

registersCmds(program);

program.parse(process.argv);