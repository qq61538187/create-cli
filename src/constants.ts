import os from 'node:os';
import path from 'node:path';

export const CREATE_CLI = path.join(os.homedir(), '.create-cli');

export const REGISTRIES: Repo[] = [];
