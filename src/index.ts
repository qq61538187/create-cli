#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json';
import {
  onCreate,
onAdd,
onDelete,
onList,
onReset,
onHelp
} from './actions';

const program = new Command();



program
  // 定义命令和参数
  .command("create <app-name>")
  .description("create a new project")
  .action(onCreate);

program.command('ls').description('List all the registries').action(onList);

program
  .command('add <name> <url> [clone] [describe]')
  .description('Add custom template repo')
  .action(onAdd);

program
.command('del <Index>')
.description('Delete custom template repo')
.action(onDelete);

program
.command('reset')
.description('reset init template repo')
.action(onReset);

program
  // 监听 --help 执行
  .on("--help",onHelp);

program.parse(process.argv);