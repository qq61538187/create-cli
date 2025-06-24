interface Registry {
  home: string;
  registry: string;
}

interface Repo {
  name: string;
  url: string;
  clone: boolean;
  [key: string]: any;
}
