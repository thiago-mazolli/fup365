CREATE OR REPLACE PACKAGE TJS_PCK_INTEGRACAO IS

  procedure P_CRIA_INTEGRACAO (
    pMOD_ST_TBLMEGA IN TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%TYPE,
    pMOD_ST_PKMEGA  IN TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%TYPE
  );
  
  function F_STATUS_INTEGRACAO
  (
    pMOD_ST_TBLMEGA in TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type,
    pMOD_ST_PKMEGA  in TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%type,
    pTIPO           in char default null /*d = descrição; m = mensagem / null retorna a o status (char)*/
  ) return varchar2;
  
  procedure P_REPROCESSAR (
    pMOD_ST_TBLMEGA in TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type,
    pMOD_ST_PKMEGA  in TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%type,
    pERRO           out varchar2,
    pMENSAGEM       out varchar2
  );

END TJS_PCK_INTEGRACAO;
