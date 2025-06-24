import inquirer from "inquirer";
import path from "path";
import chalk from "chalk";
import download from 'download';
import { spawn } from 'child_process';
import ora from "ora";
import {getRegistries} from './helpers'

// 加载动画
async function wrapLoading<T>(
  fn: (...args: any[]) => Promise<T>,
  message: string,
  name: string,
  ...args: any[]
): Promise<T | void> {
  const spinner = ora(message);
  spinner.start();

  try {
    const result = await fn(name, ...args);
    spinner.succeed();
    return result;
  } catch (error: any) {
    spinner.fail(error.message);
    console.log(error.response || error);
  }
}

const gitClone = (repoUrl: string, targetPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const g = spawn('git', ['clone', repoUrl, targetPath], {
      stdio: 'inherit'
    });
    
    g.on('close', (code) => {
      code === 0 ? resolve() : reject(new Error(`Git clone failed with code ${code}`));
    });

    g.on('error', (err) => {
      reject(new Error(`Git clone error: ${err.message}`));
    });
  });
};

const downloadGitRepo = (
  name: string,
  url: string,
  targetDir: string,
  options: { clone?: boolean } = {}
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (options.clone) {
        await gitClone(url, targetDir);
      } else {
        const downloadOptions = {
          extract: true,
          strip: 1,
          mode: '666',
          headers: { accept: 'application/zip' }
        };
        await download(url, targetDir, downloadOptions);
      }
      resolve();
    } catch (err: any) {
      reject(new Error(`Download failed: ${err.message}`));
    }
  });
};


class Generator {
  name: string;
  targetDir: string;
  downloadGitRepo: typeof downloadGitRepo;

  constructor(name: string, targetDir: string) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = downloadGitRepo;
  }

  async getRepo(): Promise<Repo> {
    const repoList: Repo[] = await getRegistries();
    const { repo } = await inquirer.prompt<{ repo: string }>({
      name: "repo",
      type: "list",
      choices: repoList.map(item => item.name),
      message: "请选择要下载的模版",
    });

    return repoList.find(item => item.name === repo) as Repo;
  }

  async download(repoObj: Repo, name: string) {
    await wrapLoading(
      this.downloadGitRepo as any, 
      "请稍后正在初始化模版...",
      name,
      repoObj.url,
      path.resolve(process.cwd(), this.targetDir), 
      { clone: repoObj.clone }
    );
  }

  async create() {
    const repoObj = await this.getRepo();
    await this.download(repoObj, this.name);
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    console.log("  npm run dev\r\n");
  }
}

export = Generator;