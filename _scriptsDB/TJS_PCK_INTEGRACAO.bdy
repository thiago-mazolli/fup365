create or replace package body TJS_PCK_INTEGRACAO is

  procedure P_CRIA_INTEGRACAO (
    pMOD_ST_TBLMEGA in TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type,
    pMOD_ST_PKMEGA  in TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%type
  ) is
  begin
    merge into
      TJS_INTEGRACAOMOD tgt using (
        select
          pMOD_ST_TBLMEGA as MOD_ST_TBLMEGA,
          pMOD_ST_PKMEGA as MOD_ST_PKMEGA,
          sysdate as MOD_DT_DATAMOD,
          (sysdate - 1) as MOD_DT_DATAENV
        from
          dual
      ) src on (
        tgt.MOD_ST_TBLMEGA = src.MOD_ST_TBLMEGA
        and tgt.MOD_ST_PKMEGA = src.MOD_ST_PKMEGA
      )
    when matched then
    update set
      tgt.MOD_DT_DATAMOD = src.MOD_DT_DATAMOD
    when not matched then
    insert
      (
        MOD_ST_TBLMEGA,
        MOD_ST_PKMEGA,
        MOD_DT_DATAMOD,
        MOD_DT_DATAENV
      )
    values
      (
        src.MOD_ST_TBLMEGA,
        src.MOD_ST_PKMEGA,
        src.MOD_DT_DATAMOD,
        src.MOD_DT_DATAENV
      )
    ;

  end P_CRIA_INTEGRACAO;
  
  function F_STATUS_INTEGRACAO (
    pMOD_ST_TBLMEGA in TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type,
    pMOD_ST_PKMEGA  in TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%type,
    pTIPO           in char default null /*d = descrição; m = mensagem / null retorna a o status (char)*/
  ) return varchar2 is
    result varchar2(300);
  begin
    begin
      select (case
               when pTIPO is null then
                s.LOG_CH_STATUS
               when pTIPO = 'M' then
                cast(s.LOG_ST_MSG as varchar2(300))
               when pTIPO = 'D' then
                decode(s.LOG_CH_STATUS, 'P', 'Pendente', 'E', 'Erro', 'I', 'Integrado')
               when pTIPO = 'T' then
                to_char(s.LOG_DT_DATA, 'DD/MM/RRRR HH24:MI:SS')
               else
                null
             end) LOG_ST_STATUS
        into result
        from TJS_INTEGRACAOLOG s
       where s.MOD_ST_TBLMEGA = pMOD_ST_TBLMEGA
         and s.MOD_ST_PKMEGA = pMOD_ST_PKMEGA
         and s.LOG_DT_DATA = (select max(l.LOG_DT_DATA)
                                from TJS_INTEGRACAOLOG l
                               where l.MOD_ST_TBLMEGA = s.MOD_ST_TBLMEGA
                                 and l.MOD_ST_PKMEGA = s.MOD_ST_PKMEGA);
    exception
      when no_data_found then
        result := (case
                    when pTIPO is null then
                     'P'
                    when pTIPO = 'M' then
                     null
                    when pTIPO = 'D' then
                     'Pendente'
                    else
                     null
                  end);
      when others then
        result := null;
    end;
  
    return result;
  
  end F_STATUS_INTEGRACAO;
  
  procedure P_REPROCESSAR (
    pMOD_ST_TBLMEGA in TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type,
    pMOD_ST_PKMEGA  in TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%type,
    pERRO           out varchar2,
    pMENSAGEM       out varchar2
  ) as
  begin
    begin
      update TJS_INTEGRACAOMOD m
         set m.MOD_DT_DATAENV = sysdate-1
       where m.MOD_ST_TBLMEGA = pMOD_ST_TBLMEGA
         and m.mod_st_pkmega = pMOD_ST_PKMEGA;

      insert into TJS_INTEGRACAOLOG
        (LOG_DT_DATA,
         MOD_ST_TBLMEGA,
         MOD_ST_PKMEGA,
         LOG_CH_STATUS,
         LOG_ST_MSG,
         LOG_CL_REQUEST,
         LOG_CL_RESPONSE)
      values
        (sysdate, --log_dt_data
         pMOD_ST_TBLMEGA,
         pMOD_ST_PKMEGA,
         'P', --log_ch_status
         'Fila para processamento', --log_st_msg
         null, --log_cl_request
         null); --log_cl_response

      commit;
      perro     := 'N';
      pmensagem := 'Item incluído na fila para processamento.';
    exception
      when others then
        perro     := 'S';
        pmensagem := 'Erro ao reprocessar o registro [' || pMOD_ST_PKMEGA || ']: ' || sqlerrm;
    end;
  end P_REPROCESSAR;

END TJS_PCK_INTEGRACAO;
