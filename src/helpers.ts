import fs from 'node:fs';
import chalk from 'chalk';
import ini from 'ini';
import { REGISTRIES, CREATE_CLI } from './constants';
export function printSuccess(message: string) {
  console.log(`${chalk.bgGreenBright(padding('SUCCESS'))} ${message}`);
}

export function printMessages(messages: string[]) {
  console.log(messages.join('\n'));
}

export function padding(message = '', before = 1, after = 1) {
  return (
    new Array(before).fill(' ').join('') +
    message +
    new Array(after).fill(' ').join('')
  );
}

export function printError(error: string) {
  console.error(`${chalk.bgRed(padding('ERROR'))} ${chalk.red(error)}`);
}

export function exit(error?: string) {
  error && printError(error);
  process.exit(1);
}

export function deleteFileSync(filePath: fs.PathLike) {
  try {
    fs.accessSync(filePath); // 检查文件是否存在
    fs.unlinkSync(filePath); // 删除文件
    console.log(`文件 ${filePath} 删除成功`);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log(`文件 ${filePath} 不存在，无需删除`);
    } else {
      console.error(`删除文件 ${filePath} 时出错:`, err);
    }
    return false;
  }
}

export async function readFile(file: fs.PathLike): Promise<any> {
  return new Promise((resolve) => {
    if (!fs.existsSync(file)) {
      resolve(JSON.stringify(REGISTRIES)); // 如果文件不存在，返回空对象
    } else {
      try {
        const content: string = fs.readFileSync(file, 'utf-8');
        resolve(content);
      } catch (error: any) {
        exit(error);
      }
    }
  });
}

export async function writeFile(
  path: fs.PathOrFileDescriptor,
  content: string,
) {
  return new Promise<void>((resolve) => {
    try {
      fs.writeFileSync(path, content, 'utf-8');
      resolve();
    } catch (error: any) {
      exit(error);
    }
  });
}

export async function getRegistries(): Promise<any> {
  let customRegistries: any = await readFile(CREATE_CLI);
  customRegistries = JSON.parse(customRegistries || '[]');
  return customRegistries;
}
