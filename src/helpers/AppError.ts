/* eslint-disable no-underscore-dangle */
import IAppError from '../interfaces/IAppError';
import processError from './processError';

/**
 * Classe responsável por criar um objeto de erro personalizado para a aplicação.
 */
class AppError {
  private _logId: string | undefined;

  private _header: string | undefined;

  private _message: string | undefined;

  private _script: string | undefined;

  private _params: object | undefined;

  private _permUpdate: string | undefined;

  private _intServico: string | undefined;

  private _intStatus: string | undefined;

  private _intXML: string | undefined;

  private _intMsgErro: string | undefined;

  private _intPkMega: string | undefined;

  private _intCodTransacao: string | undefined;

  private _campoAdic1: string | undefined;

  private _campoAdic2: string | undefined;

  private _campoAdic3: string | undefined;

  private _campoAdic4: string | undefined;

  private _campoAdic5: string | undefined;

  private _statusCode: number | undefined;

  /**
   * Obtém o ID do log.
   * @returns O ID do log.
   */
  public get logId(): string | undefined {
    return this._logId;
  }

  /**
   * Define o ID do log.
   * @param v O ID do log.
   */
  public set logId(v: string | undefined) {
    this._logId = v;
  }

  /**
   * Obtém o cabeçalho.
   * @returns O cabeçalho.
   */
  public get header(): string | undefined {
    return this._header;
  }

  /**
   * Define o cabeçalho.
   * @param v O cabeçalho.
   */
  public set header(v: string | undefined) {
    this._header = v;
  }

  /**
   * Obtém a mensagem de erro.
   * @returns A mensagem de erro.
   */
  public get message(): string | undefined {
    return this._message;
  }

  /**
   * Define a mensagem de erro.
   * @param v A mensagem de erro.
   */
  public set message(v: string | undefined) {
    this._message = v;
  }

  /**
   * Obtém o script.
   * @returns O script.
   */
  public get script(): string | undefined {
    return this._script;
  }

  /**
   * Define o script.
   * @param v O script.
   */
  public set script(v: string | undefined) {
    this._script = v;
  }

  /**
   * Obtém os parâmetros.
   * @returns Os parâmetros.
   */
  public get params(): object | undefined {
    return this._params;
  }

  /**
   * Define os parâmetros.
   * @param v Os parâmetros.
   */
  public set params(v: object | undefined) {
    this._params = v;
  }

  /**
   * Obtém a permissão de atualização.
   * @returns A permissão de atualização.
   */
  public get permUpdate(): string | undefined {
    return this._permUpdate;
  }

  /**
   * Define a permissão de atualização.
   * @param v A permissão de atualização.
   */
  public set permUpdate(v: string | undefined) {
    this._permUpdate = v;
  }

  /**
   * Obtém o serviço interno.
   * @returns O serviço interno.
   */
  public get intServico(): string | undefined {
    return this._intServico;
  }

  /**
   * Define o serviço interno.
   * @param v O serviço interno.
   */
  public set intServico(v: string | undefined) {
    this._intServico = v;
  }

  /**
   * Obtém o status interno.
   * @returns O status interno.
   */
  public get intStatus(): string | undefined {
    return this._intStatus;
  }

  /**
   * Define o status interno.
   * @param v O status interno.
   */
  public set intStatus(v: string | undefined) {
    this._intStatus = v;
  }

  /**
   * Obtém o XML interno.
   * @returns O XML interno.
   */
  public get intXML(): string | undefined {
    return this._intXML;
  }

  /**
   * Define o XML interno.
   * @param v O XML interno.
   */
  public set intXML(v: string | undefined) {
    this._intXML = v;
  }

  /**
   * Obtém a mensagem de erro interna.
   * @returns A mensagem de erro interna.
   */
  public get intMsgErro(): string | undefined {
    return this._intMsgErro;
  }

  /**
   * Define a mensagem de erro interna.
   * @param v A mensagem de erro interna.
   */
  public set intMsgErro(v: string | undefined) {
    this._intMsgErro = v;
  }

  /**
   * Obtém o PK Mega interno.
   * @returns O PK Mega interno.
   */
  public get intPkMega(): string | undefined {
    return this._intPkMega;
  }

  /**
   * Define o PK Mega interno.
   * @param v O PK Mega interno.
   */
  public set intPkMega(v: string | undefined) {
    this._intPkMega = v;
  }

  /**
   * Obtém o código de transação interno.
   * @returns O código de transação interno.
   */
  public get intCodTransacao(): string | undefined {
    return this._intCodTransacao;
  }

  /**
   * Define o código de transação interno.
   * @param v O código de transação interno.
   */
  public set intCodTransacao(v: string | undefined) {
    this._intCodTransacao = v;
  }

  /**
   * Obtém o campo adicional 1.
   * @returns O campo adicional 1.
   */
  public get campoAdic1(): string | undefined {
    return this._campoAdic1;
  }

  /**
   * Define o campo adicional 1.
   * @param v O campo adicional 1.
   */
  public set campoAdic1(v: string | undefined) {
    this._campoAdic1 = v;
  }

  /**
   * Obtém o campo adicional 2.
   * @returns O campo adicional 2.
   */
  public get campoAdic2(): string | undefined {
    return this._campoAdic2;
  }

  /**
   * Define o campo adicional 2.
   * @param v O campo adicional 2.
   */
  public set campoAdic2(v: string | undefined) {
    this._campoAdic2 = v;
  }

  /**
   * Obtém o campo adicional 3.
   * @returns O campo adicional 3.
   */
  public get campoAdic3(): string | undefined {
    return this._campoAdic3;
  }

  /**
   * Define o campo adicional 3.
   * @param v O campo adicional 3.
   */
  public set campoAdic3(v: string | undefined) {
    this._campoAdic3 = v;
  }

  /**
   * Obtém o campo adicional 4.
   * @returns O campo adicional 4.
   */
  public get campoAdic4(): string | undefined {
    return this._campoAdic4;
  }

  /**
   * Define o campo adicional 4.
   * @param v O campo adicional 4.
   */
  public set campoAdic4(v: string | undefined) {
    this._campoAdic4 = v;
  }

  /**
   * Obtém o campo adicional 5.
   * @returns O campo adicional 5.
   */
  public get campoAdic5(): string | undefined {
    return this._campoAdic5;
  }

  /**
   * Define o campo adicional 5.
   * @param v O campo adicional 5.
   */
  public set campoAdic5(v: string | undefined) {
    this._campoAdic5 = v;
  }

  /**
   * Obtém o código de status.
   * @returns O código de status.
   */
  public get statusCode(): number | undefined {
    return this._statusCode;
  }

  /**
   * Define o código de status.
   * @param v O código de status.
   */
  public set statusCode(v: number | undefined) {
    this._statusCode = v;
  }

  /**
   * Construtor da classe AppError.
   * @param error O erro.
   * @param logId O ID do log.
   * @param header O cabeçalho.
   * @param script O script.
   * @param params Os parâmetros.
   * @param permUpdate A permissão de atualização.
   * @param intServico O serviço interno.
   * @param intStatus O status interno.
   * @param intXML O XML interno.
   * @param intMsgErro A mensagem de erro interna.
   * @param intPkMega O PK Mega interno.
   * @param intCodTransacao O código de transação interno.
   * @param campoAdic1 O campo adicional 1.
   * @param campoAdic2 O campo adicional 2.
   * @param campoAdic3 O campo adicional 3.
   * @param campoAdic4 O campo adicional 4.
   * @param campoAdic5 O campo adicional 5.
   * @param statusCode O código de status.
   */
  constructor({
    error,
    logId,
    header,
    script,
    params,
    permUpdate = 'N',
    intServico,
    intStatus,
    intXML,
    intMsgErro,
    intPkMega,
    intCodTransacao,
    campoAdic1,
    campoAdic2,
    campoAdic3,
    campoAdic4,
    campoAdic5,
    statusCode = 500,
  }: IAppError) {
    // consoleLog('AppError_error', error);
    // Atribuir os valores dos parâmetros às propriedades
    this.logId = logId;
    this.header = header;
    this.message = processError(error);
    this.script = script;
    this.params = params;
    this.permUpdate = permUpdate;
    this.intServico = intServico;
    this.intStatus = intStatus;
    this.intXML = intXML;
    this.intMsgErro = intMsgErro;
    this.intPkMega = intPkMega;
    this.intCodTransacao = intCodTransacao;
    this.campoAdic1 = campoAdic1;
    this.campoAdic2 = campoAdic2;
    this.campoAdic3 = campoAdic3;
    this.campoAdic4 = campoAdic4;
    this.campoAdic5 = campoAdic5;
    this.statusCode = statusCode;
  }
}

export default AppError;
