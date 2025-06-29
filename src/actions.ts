import path from 'node:path';
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { CREATE_CLI } from './constants';
import Generator from './generator';
import {
  deleteFileSync,
  getRegistries,
  printMessages,
  printSuccess,
  readFile,
  writeFile,
} from './helpers';
export const onCreate = async (name: string, options: string) => {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name);
  if (fs.existsSync(targetAir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: 'Target directory already exists Pick an action:',
        choices: [
          {
            name: 'Overwrite',
            value: 'overwrite',
          },
          {
            name: 'Cancel',
            value: false,
          },
        ],
      },
    ]);
    if (!action) {
      return;
    }
    if (action === 'overwrite') {
      // 移除已存在的目录
      await fs.remove(targetAir);
    }
  }
  // 创建项目
  const generator = new Generator(name, targetAir);

  // 开始创建项目
  generator.create();
};

export const onList = async () => {
  const list = await getRegistries();

  printMessages(
    list.map(
      (item: Repo, index: number) =>
        `[${index}]${item.name} ---------- ${item.url} ---------- clone: ${item.clone} ----------describe:${item.describe || ''}`,
    ),
  );
};
export const onAdd = async (
  name: string,
  url: string,
  clone: string,
  describe: string,
) => {
  let customRegistries: any = await readFile(CREATE_CLI);
  customRegistries = JSON.parse(customRegistries || '[]');
  customRegistries.push({
    name,
    url,
    clone: clone === 'true',
    describe: describe || '',
  });
  await writeFile(CREATE_CLI, JSON.stringify(customRegistries, null, 2));
  printSuccess(`${chalk.green(`添加模版数据 ${name} 成功`)} `);
};
export const onDelete = async (index: number) => {
  let customRegistries: any = await readFile(CREATE_CLI);
  customRegistries = JSON.parse(customRegistries || '[]');
  if (customRegistries[index]) {
    customRegistries.splice(index, 1);
  }
  await writeFile(CREATE_CLI, JSON.stringify(customRegistries, null, 2));
  printSuccess(`${chalk.green(`删除模版数据 ${index} 成功`)} `);
  onList();
};

export const onReset = () => {
  deleteFileSync(CREATE_CLI);
};

export const onHelp = () => {
  console.log(
    [
      '\r\n运行 ',
      chalk.cyan('rl <command> --help'),
      ' 查看指定命令的详细用法\r\n',
    ].join(''),
  );
};
