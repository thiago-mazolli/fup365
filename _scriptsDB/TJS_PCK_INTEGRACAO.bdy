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
      select case
               /* REGISTRO PENDENTE */
               when nvl(m.MOD_DT_DATAMOD, sysdate) > nvl(m.MOD_DT_DATAENV, sysdate) then
                 case
                   when pTIPO is null then 'P'
                   when pTIPO = 'D' then 'Pendente'
                   else null
                 end
               /* ÚLTIMO STATUS DO LOG */
               else
                 case
                   when pTIPO is null then l.LOG_CH_STATUS
                   when pTIPO = 'D' then
                     case l.LOG_CH_STATUS
                       when 'P' then 'Pendente'
                       when 'E' then 'Erro'
                       when 'I' then 'Integrado'
                     end
                   when pTIPO = 'M' then
                     cast(l.LOG_ST_MSG as varchar2(300))
                   when pTIPO = 'T' then
                     to_char(l.LOG_DT_DATA, 'DD/MM/RRRR HH24:MI:SS')
                 end
             end
        into result
        from TJS_INTEGRACAOMOD m
        left join (select x.MOD_ST_TBLMEGA,
                          x.MOD_ST_PKMEGA,
                          x.LOG_CH_STATUS,
                          x.LOG_ST_MSG,
                          x.LOG_DT_DATA
                     from (select g.*,
                                  row_number() over (
                                    partition by g.MOD_ST_TBLMEGA, g.MOD_ST_PKMEGA
                                    order by g.LOG_DT_DATA desc
                                  ) rn
                             from TJS_INTEGRACAOLOG g) x
                    where x.rn = 1) l on l.MOD_ST_TBLMEGA = m.MOD_ST_TBLMEGA
                                     and l.MOD_ST_PKMEGA  = m.MOD_ST_PKMEGA
       where m.MOD_ST_TBLMEGA = pMOD_ST_TBLMEGA
         and m.MOD_ST_PKMEGA  = pMOD_ST_PKMEGA;
    exception
      when no_data_found then
        result := case
                    when pTIPO is null then 'P'
                    when pTIPO = 'D' then 'Pendente'
                    else null
                  end;
      when others then
        result := 'Others';
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
