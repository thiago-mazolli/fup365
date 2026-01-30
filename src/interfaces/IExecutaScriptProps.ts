interface IExecutaScriptProps {
  script: string;
  params: object;
  execSQL?: boolean;
  numeroTentativas?: number;
}

export default IExecutaScriptProps;
