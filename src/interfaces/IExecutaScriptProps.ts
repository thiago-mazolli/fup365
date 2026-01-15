interface IExecutaScriptProps {
  connectionAttributes: any;
  script: string;
  params: object;
  execSQL?: boolean;
  disableLogs?: boolean;
  numeroTentativas?: number;
  libDir?: string;
}

export default IExecutaScriptProps;
