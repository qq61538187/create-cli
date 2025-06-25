# 智AI湾 vue脚手架 

快速搭建自己的项目模版脚手架，其中内置了一些脚手架供用户选择。用户可以自己通过`zhiaiwan-vue-cli add  repoName   repoUrl  isClone describe`添加自己的项目模版，从而达到对自己的项目脚手架的管理

## Installation

```bash
npm install -g zhiaiwan-vue-cli
# or
yarn global add zhiaiwan-vue-cli
```

## Example

```bash
zhiaiwan-vue-cli -h
Usage: zhiaiwan-vue-cli [options] [command]

Options:
  -h, --help                           display help for command

Commands:
  create <app-name>                    create a new project
  ls                                   List all the registries
  add <name> <url> [clone] [describe]  Add custom template repo
  del <Index>                          Delete custom template repo
  reset                                reset init template repo
  help [command]                       display help for command

运行 rl <command> --help 查看指定命令的详细用法
```

## 发布

```sh
yarn changeset  // 提交版本变更信息

yarn changeset version //更新版本信息

yarn changeset publish 发布
```