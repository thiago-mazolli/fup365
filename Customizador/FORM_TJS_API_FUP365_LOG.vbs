Dim Cl_Integracao, Ds_Integracao, Tv_Integracao
Dim Cl_Log, Ds_Log, Tv_Log

Dim Cl_Reprocessar
Dim vSQL, vSeleciona

Dim vRodaPeCriado = False
Dim vQtdeSelecionados = 0

Sub OnFormCreate
  With FORM_TJS_API_FUP365_LOG

    Print(DMMega.ComputerName)
    BorderIcons = biMinimize + biMaximize + biSystemMenu
    Position = PoScreenCenter
    WindowState = WsMaximized

    Bt_Filtrar.OnAfterClick = AddressOf Bt_Filtrar_OnAfterClick()
    Bt_Limpar.OnAfterClick = AddressOf Bt_Limpar_OnAfterClick()
    Bt_Reprocessar.OnAfterClick = AddressOf Bt_Reprocessar_OnAfterClick()

    Bt_Split.OnAfterClick = AddressOf Bt_Split_OnAfterClick()
    Bt_Split.Colors = Bo_OK.Colors

    Ed_NroPedido.OnKeyPress = AddressOf SomenteNumero()

    '//CARREGA O COMBO COM OS STATUS DOS LOGS
    vSQL = "SELECT 'P' log_ch_status," & _
           "       'Pendente' log_st_status" & _
           "  FROM dual" & _
           " UNION ALL " & _
           "SELECT 'E'," & _
           "       'Erro'" & _
           "  FROM dual" & _
           " UNION ALL " & _
           "SELECT 'I'," & _
           "       'Integrado'" & _
           "  FROM dual"
    subComboCarregra(Cb_Status, "log_ch_status", "log_st_status", vSQL, True)

    '//CARREGA O COMBO COM AS FILIAIS
    vSQL = "SELECT f.org_in_codigo   fil_in_codigo," & _
           "       '[' || LPAD(f.org_in_codigo, 3, 0) || '] - ' || f.org_st_fantasia fil_st_fantasia" & _
           "  FROM glo_vw_organizacao f" & _
           " WHERE f.org_bo_consolidador = 'F'" & _
           " ORDER BY f.org_st_fantasia ASC"
    subComboCarregra(Cb_Filial, "fil_in_codigo", "fil_st_fantasia", vSQL, True)

    '//DATASET DAS INTEGRAÇÕES
    Cl_Integracao = New TMgClientDataSet(FormAtivo)
    With Cl_Integracao
      Name = "Cl_Integracao"
      TableName = "TJS_INTEGRACAOMOD"
      PkFields = "MOD_ST_TBLMEGA;MOD_ST_PKMEGA"
      IndexFieldNames = PkFields
      Close
      SQL.Add("SELECT 'N' seleciona,")
      SQL.Add("       vw.*")
      SQL.Add("  FROM tjs_vw_integracao vw")
      SQL.Add(" WHERE vw.pdc_in_codigo = decode(:pNROPEDIDO, '', vw.pdc_in_codigo, :pNROPEDIDO)")
      SQL.Add("   AND trunc(vw.mod_dt_datamod) BETWEEN :pDATAINICIAL AND :pDATAFINAL")
      SQL.Add("   AND vw.log_ch_status_atual = decode(:pSTATUS, 'T', vw.log_ch_status_atual, :pSTATUS)")
      SQL.Add("   AND vw.fil_in_codigo = decode(:pFILIAL, 'T', vw.fil_in_codigo, :pFILIAL)")
      SQL.Add(" ORDER BY vw.mod_dt_datamod ASC")
      OnBeforeOpen = AddressOf Cl_Integracao_OnBeforeOpen()
      OnAfterOpen = AddressOf Cl_Integracao_OnAfterOpen()
    End With

    '//DATASOURCE
    Ds_Integracao = New TMgDataSource(FormAtivo)
    With Ds_Integracao
      Name = "Ds_Integracao"
      DataSet = Cl_Integracao
    End With

    '//CxGrid - INTEGRAÇÕES
    Tv_Integracao = Gd_Integracao.CreateView
    Tv_Integracao.Name = "Tv_Integracao"
    Gd_Integracao.Levels.Add
    Gd_Integracao.Levels.Items[0].GridView = Tv_Integracao
    Tv_Integracao.DataController.DataSource = Ds_Integracao
    Tv_Integracao.DataController.DataModeController.GridMode = False
    Tv_Integracao.OptionsView.GroupByBox = True
    Tv_Integracao.OptionsView.Indicator = True
    Tv_Integracao.OptionsSelection.CellSelect = True
    Tv_Integracao.OptionsSelection.HideSelection = True
    Tv_Integracao.OptionsData.AppEnding = False
    Tv_Integracao.OptionsData.Deleting = False
    Tv_Integracao.OptionsData.Editing = True
    Tv_Integracao.OptionsData.Inserting = False

    '//DADOS LOGS DE INTEGRAÇÃO
    '//DATASET LOGS DE INTEGRAÇÃO
    Cl_Log = New TMgClientDataSet(FormAtivo)
    With Cl_Log
      Name = "Cl_Log"
      TableName = "TJS_INTEGRACAOLOG"
      PkFields = "LOG_DT_DATA;MOD_ST_TBLMEGA;MOD_ST_PKMEGA"
      '//IndexFieldNames = PkFields
      Close
      SQL.Add("SELECT l.*,")
      SQL.Add("       decode(l.log_ch_status, 'P', 'Pendente', 'E', 'Erro', 'I', 'Integrado') log_st_status")
      SQL.Add("  FROM tjs_integracaolog l")
      SQL.Add(" WHERE l.mod_st_tblmega = :pMOD_ST_TBLMEGA")
      SQL.Add("   AND l.mod_st_pkmega = :pMOD_ST_PKMEGA")
      SQL.Add(" ORDER BY l.log_dt_data DESC")
      OnBeforeOpen = AddressOf Cl_Log_OnBeforeOpen()
      OnAfterOpen = AddressOf Cl_Log_OnAfterOpen()
    End With

    '//DATASOURCE
    Ds_Log = New TMgDataSource(FormAtivo)
    With Ds_Log
      Name = "Ds_Log"
      DataSet = Cl_Log
    End With

    '//CxGrid - LOG
    Tv_Log = Gd_Log.CreateView
    Tv_Log.Name = "Tv_Log"
    Gd_Log.Levels.Add
    Gd_Log.Levels.Items[0].GridView = Tv_Log
    Tv_Log.DataController.DataSource = Ds_Log
    Tv_Log.DataController.DataModeController.GridMode = False
    Tv_Log.OptionsView.GroupByBox = False
    Tv_Log.OptionsView.Indicator = True
    Tv_Log.OptionsSelection.CellSelect = True
    Tv_Log.OptionsSelection.HideSelection = True
    Tv_Log.OptionsData.AppEnding = False
    Tv_Log.OptionsData.Deleting = False
    Tv_Log.OptionsData.Editing = False
    Tv_Log.OptionsData.Inserting = False
    '//DADOS LOGS DE INTEGRAÇÃO

    Mm_Request.DataSource = Ds_Log
    Mm_Request.DataField = "LOG_CL_REQUEST"

    Mm_Response.DataSource = Ds_Log
    Mm_Response.DataField = "LOG_CL_RESPONSE"

    Bt_Limpar_OnAfterClick()

    Cl_Reprocessar = New TMgClientDataSet(FormAtivo)
    With Cl_Reprocessar
      Name = "Cl_Reprocessar"
      TableName = "DUAL"
      Close
      SQL.Clear
      SQL.Add("BEGIN")
      SQL.Add("  tjs_pck_integracao.p_reprocessar(:pMOD_ST_TBLMEGA,")
      SQL.Add("                                   :pMOD_ST_PKMEGA,")
      SQL.Add("                                   :pERRO,")
      SQL.Add("                                   :pMENSAGEM);")
      SQL.Add("END;")
    End With

  End With
End Sub

Sub Bt_Limpar_OnAfterClick()
  With FormAtivo
    Ed_NroPedido.Text = ""

    Ed_DataInicial.Value = Date
    Ed_DataFinal.Value = Date

    Cb_Status.ItemIndex = 0
    Cb_Filial.ItemIndex = 0

    Bt_Filtrar_OnAfterClick()
  End With
End Sub

Sub Bt_Filtrar_OnAfterClick()
  With FormAtivo
    Cl_Integracao.OnAfterScroll = Nil
    Cl_Integracao.DisableControls
    Cl_Integracao.Close
    Cl_Integracao.Open
    Cl_Integracao.EnableControls
    Cl_Integracao.First
    Cl_Integracao.OnAfterScroll = AddressOf Cl_Integracao_OnAfterScroll()

    Cl_Integracao_OnAfterScroll(Cl_Integracao)
  End With
End Sub

Sub Bt_Reprocessar_OnAfterClick()
  Dim vContador = 0
  Dim vChave

  With FormAtivo

    Cl_Integracao.OnAfterScroll = Nil

    '//FUNÇÃO RETORNA 1 CASO TENHA ALGUM REGISTRO SELECIONADO
    If funValidaSeleciona(Cl_Integracao) = 0 Then
      MgMessageDlg("Selecione um registro para reprocessar.", mtWarning, mbOk, 0)
      Cl_Integracao.OnAfterScroll = AddressOf Cl_Integracao_OnAfterScroll()
      RaiseException("")
    End If

    If (MgMessageDlg("Tem certeza que deseja reprocessar o(s) registros(s) selecionado(s)?", mtConfirmation, mbYes + mbNo, 0)) = mrYes Then

      vChave = Cl_Integracao.FieldByName("MOD_ST_CHAVE").Value
      vQtdeSelecionados = funQtdeSelecionados(Cl_Integracao)

      FormAtivo.Lb_Mensagem.Caption = "Reprocessando 1/" & vQtdeSelecionados
      FormAtivo.Lb_Mensagem.Visible = True
      Application.ProcessMessages

      Cl_Integracao.DisableControls
      Cl_Integracao.First
      While Not Cl_Integracao.EOF
        If Cl_Integracao.FieldByName("SELECIONA").Value = "S" Then

          vContador = vContador + 1
          FormAtivo.Lb_Mensagem.Caption = "Reprocessando " & vContador & "/" & vQtdeSelecionados
          Application.ProcessMessages

          '//INTEGRAÇÃO SÓ PODE SER REPROCESSADA CASO ESTEJA COM O STATUS DE ERRO
          If (Cl_Integracao.FieldByName("LOG_CH_STATUS_ATUAL").Value In ["E"]) Then

            With Cl_Reprocessar
              Close
              ParamByName("pMOD_ST_TBLMEGA").Value = Cl_Integracao.FieldByName("MOD_ST_TBLMEGA").Value
              ParamByName("pMOD_ST_PKMEGA").Value  = Cl_Integracao.FieldByName("MOD_ST_PKMEGA").Value
              ExecSQL

              '//PEGA O RETORNO DA PROCEDURE
              If (ParamByName("pERRO").Value = "S") Then
                MgMessageDlg(ParamByName("pMENSAGEM").Value, mtWarning, mbOk, 0)
                FormAtivo.Lb_Mensagem.Visible = False
                Application.ProcessMessages
                Cl_Integracao.EnableControls
                Cl_Integracao.OnAfterScroll = AddressOf Cl_Integracao_OnAfterScroll()
                RaiseException("")
              End If
            End With

          End If

        End if
      Cl_Integracao.Next
      Wend

      Bt_Filtrar_OnAfterClick()

      Cl_Integracao.First
      Cl_Integracao.EnableControls

      Cl_Integracao.Locate("MOD_ST_CHAVE", vChave, 0)

      MgMessageDlg("Integração(ões) incluída(s) na fila para processamento com sucesso.", mtInformation, mbOk, 0)

      FormAtivo.Lb_Mensagem.Visible = False
      Application.ProcessMessages

    End If

  End With
End Sub

Sub Bt_Split_OnAfterClick()
  With FormAtivo
    If Pn_LogDados.Height = 0 Then
      Pn_LogDados.Height = 350
    Else
      Pn_LogDados.Height = 0
    End If
  End With
End Sub

Sub Cl_Integracao_OnAfterScroll(Sender As TMgClientDataSet)
  With FormAtivo
    Print("Cl_Integracao_OnAfterScroll")
    Cl_Log.DisableControls
    Cl_Log.Close
    Cl_Log.Open
    Cl_Log.EnableControls
  End With
End Sub

Sub Cl_Integracao_OnBeforeOpen(Sender As TMgClientDataSet)
  With FormAtivo
    With Sender
      ParamByName("pNROPEDIDO").Value = Ed_NroPedido.Text
      ParamByName("pDATAINICIAL").Value = Ed_DataInicial.DateValue
      ParamByName("pDATAFINAL").Value = Ed_DataFinal.DateValue
      ParamByName("pSTATUS").Value = Cb_Status.Value
      ParamByName("pFILIAL").Value = Cb_Filial.Value

      /*
      Print(ParamByName("pNROPEDIDO").Value)
      Print(ParamByName("pDATAINICIAL").Value)
      Print(ParamByName("pDATAFINAL").Value)
      Print(ParamByName("pSTATUS").Value)
      Print(ParamByName("pFILIAL").Value)

      ShowMessage(ParamByName("pNROPEDIDO").Value)
      ShowMessage(ParamByName("pDATAINICIAL").Value)
      ShowMessage(ParamByName("pDATAFINAL").Value)
      ShowMessage(ParamByName("pSTATUS").Value)
      ShowMessage(ParamByName("pFILIAL").Value)
      */
    End With
  End With
End Sub

Sub Cl_Integracao_OnAfterOpen(Sender As TMgClientDataSet)
  Dim i As Integer

  With Sender
    For i = 0 To Fields.Count-1
      Fields[i].Visible = False
    Next

    i = 0
    FieldByName("SELECIONA").DisplayLabel = "Sel"
    FieldByName("SELECIONA").DisplayWidth = 3
    FieldByName("SELECIONA").Visible = True
    FieldByName("SELECIONA").Index = i

    i = i + 1
    FieldByName("PDC_IN_CODIGO").DisplayLabel = "Pedido"
    FieldByName("PDC_IN_CODIGO").DisplayWidth = 8
    FieldByName("PDC_IN_CODIGO").Visible = True
    FieldByName("PDC_IN_CODIGO").Index = i
    FieldByName("PDC_IN_CODIGO").ReadOnly = True

    i = i + 1
    FieldByName("SER_ST_CODIGO").DisplayLabel = "Serie"
    FieldByName("SER_ST_CODIGO").DisplayWidth = 8
    FieldByName("SER_ST_CODIGO").Visible = True
    FieldByName("SER_ST_CODIGO").Index = i

    i = i + 1
    FieldByName("AGN_IN_CODIGO").DisplayLabel = "Cód Agente"
    FieldByName("AGN_IN_CODIGO").DisplayWidth = 8
    FieldByName("AGN_IN_CODIGO").Visible = True
    FieldByName("AGN_IN_CODIGO").Index = i

    i = i + 1
    FieldByName("AGN_ST_NOME").DisplayLabel = "Agente"
    FieldByName("AGN_ST_NOME").DisplayWidth = 40
    FieldByName("AGN_ST_NOME").Visible = True
    FieldByName("AGN_ST_NOME").Index = i

    i = i + 1
    FieldByName("LOG_DT_STATUS_ATUAL").DisplayLabel = "Data Integração"
    FieldByName("LOG_DT_STATUS_ATUAL").DisplayWidth = 18
    FieldByName("LOG_DT_STATUS_ATUAL").Visible = True
    FieldByName("LOG_DT_STATUS_ATUAL").Index = i

    i = i + 1
    FieldByName("LOG_ST_STATUS_ATUAL").DisplayLabel = "Status"
    FieldByName("LOG_ST_STATUS_ATUAL").DisplayWidth = 15
    FieldByName("LOG_ST_STATUS_ATUAL").Visible = True
    FieldByName("LOG_ST_STATUS_ATUAL").Index = i

    i = i + 1
    FieldByName("LOG_ST_STATUS_ATUAL_MENSAGEM").DisplayLabel = "Mensagem"
    FieldByName("LOG_ST_STATUS_ATUAL_MENSAGEM").DisplayWidth = 50
    FieldByName("LOG_ST_STATUS_ATUAL_MENSAGEM").Visible = True
    FieldByName("LOG_ST_STATUS_ATUAL_MENSAGEM").Index = i

    i = i + 1
    FieldByName("FIL_IN_CODIGO").DisplayLabel = "Cód Filial"
    FieldByName("FIL_IN_CODIGO").DisplayWidth = 10
    FieldByName("FIL_IN_CODIGO").Visible = True
    FieldByName("FIL_IN_CODIGO").Index = i

    i = i + 1
    FieldByName("FIL_ST_FANTASIA").DisplayLabel = "Filial"
    FieldByName("FIL_ST_FANTASIA").DisplayWidth = 40
    FieldByName("FIL_ST_FANTASIA").Visible = True
    FieldByName("FIL_ST_FANTASIA").Index = i

    '//MONTA AS COLUNAS DO GRID
    Tv_Integracao.DataController.CreateAllItems(True)

    '//MONTA A COLUNA SELECIONA
    subDesabilitaEdicao(Sender, Tv_Integracao)

  End With
End Sub

Sub Cl_Log_OnBeforeOpen(Sender As TMgClientDataSet)
  With FormAtivo
    With Sender
      ParamByName("pMOD_ST_TBLMEGA").Value = Cl_Integracao.FieldByName("MOD_ST_TBLMEGA").Value
      ParamByName("pMOD_ST_PKMEGA").Value  = Cl_Integracao.FieldByName("MOD_ST_PKMEGA").Value

      /*
      Print(ParamByName("pMOD_ST_TBLMEGA").Value)
      Print(ParamByName("pMOD_ST_PKMEGA").Value)

      ShowMessage(ParamByName("pMOD_ST_TBLMEGA").Value)
      ShowMessage(ParamByName("pMOD_ST_PKMEGA").Value)
      */
    End With
  End With
End Sub

Sub Cl_Log_OnAfterOpen(Sender As TMgClientDataSet)
  Dim i As Integer

  With Sender
    For i = 0 To Fields.Count-1
      Fields[i].Visible = False
    Next

    i = 0
    FieldByName("LOG_DT_DATA").DisplayLabel = "Data"
    FieldByName("LOG_DT_DATA").DisplayWidth = 18
    FieldByName("LOG_DT_DATA").Visible = True
    FieldByName("LOG_DT_DATA").Index = i

    i = i + 1
    FieldByName("LOG_ST_STATUS").DisplayLabel = "Status"
    FieldByName("LOG_ST_STATUS").DisplayWidth = 15
    FieldByName("LOG_ST_STATUS").Visible = True
    FieldByName("LOG_ST_STATUS").Index = i

    i = i + 1
    FieldByName("LOG_ST_MSG").DisplayLabel = "Mensagem"
    FieldByName("LOG_ST_MSG").DisplayWidth = 50
    FieldByName("LOG_ST_MSG").Visible = True
    FieldByName("LOG_ST_MSG").Index = i

    '//MONTA AS COLUNAS DO GRID
    Tv_Log.DataController.CreateAllItems(True)
  End With
End Sub

'//--------------------------------------------------------
'//-------------------- FUNÇÕES PADRÃO --------------------
'//--------------------------------------------------------
Sub SomenteNumero(Sender As TObject, Key As Char)
  With FormAtivo
    '//Permite números, backspace e combinações com Ctrl (como Ctrl+V)
    '//If (Not(Key In ["0".."9", #8])) And (Ord(Key) >= 32) Then
    If Not(Key In["0".."9", #08, #22]) Then
      Key = #0
    End If
  End With
End Sub

Sub subComboCarregra(pcCombo As TMgDBComboBox, psCampoIndex As String, psCampoDescricao As String, _
                     psSQL As String, pPrimeiroItemBranco As Boolean = False, psIndex As Boolean = True)

  Dim Cl_Combo = New TMgClientDataSet(FormAtivo)
  Dim vSelecionado

  With Cl_Combo
    Name = "Cl_Combo"
    TableName = "DUAL"
    SQL.Clear
    SQL.Add(psSQL)
    Open

    pcCombo.Items.Clear

    If pPrimeiroItemBranco = True Then
      If psIndex = True Then
        pcCombo.MapList = True
        pcCombo.Items.Add("Todos"#9"T")
      Else
        pcCombo.Items.Add("Todos")
      End If
    End If

    If RecordCount > 0 Then
      First

      While Not EOF
        '//pcCombo.Items.Add(FieldByName(psCampoDescricao).Value)
        '//pcCombo.AddItem (IIf(IsNull(rsAux(psCampoDescricao)), "", rsAux(psCampoDescricao)))

        If psIndex = True Then
          pcCombo.MapList = True
          pcCombo.Items.Add(FieldByName(psCampoDescricao).Value & #9 & FieldByName(psCampoIndex).Value)
          '//pcCombo.ItemData(pcComboAux.NewIndex) = rsAux(psCampoIndex)
        Else
          pcCombo.Items.Add(FieldByName(psCampoDescricao).Value)
        End If

      Cl_Combo.Next
      Wend

      If pPrimeiroItemBranco = True Then
        pcCombo.ItemIndex = 0
      Else
        pcCombo.ItemIndex = -1
      End If

    End If

  End With

  Cl_Combo.Close
  Cl_Combo.Free
  Cl_Combo = Nil
End Sub

Function funQtdeSelecionados(pDataSet As TMgClientDataSet)
  Dim vCount = 0
  With pDataSet
    If RecordCount > 0 Then
      DisableControls
      First
      While Not EOF
        If (FieldByName("SELECIONA").Value = "S") Then
          vCount = vCount + 1
        End If
      pDataSet.Next
      Wend
      First
      EnableControls
    End If
  End With

  Return vCount
End Function

'//VERIFICA SE O USUÁRIO SELECIONOU ALGUMA LINHA NO DATASET
Function funValidaSeleciona(pDataSet As TMgClientDataSet)
  With pDataSet
    If RecordCount > 0 Then
      DisableControls
      First
      While Not EOF
        If (FieldByName("SELECIONA").Value = "S") Then
          EnableControls
          Return 1
        End If
      pDataSet.Next
      Wend
      First
      EnableControls
    End If
  End With

  Return 0
End Function

Sub subDesabilitaEdicao(pDataset As TMgClientDataset, pTableview)
  Dim i

  For i = 0 To pDataset.Fields.Count - 1
    If pTableview.GetColumnByFieldName(pDataset.Fields[i].FieldName) <> Nil Then
      With TcxGridDBColumn(pTableview.GetColumnByFieldName(pDataset.Fields[i].FieldName))
        If (pDataset.Fields[i].FieldName <> "SELECIONA") And _
           (pDataset.Fields[i].FieldName <> "PDC_IN_CODIGO") Then
          Options.Editing = False
          '//Options.Focusing = False
        Else
          If (pDataset.Fields[i].FieldName = "SELECIONA") Then
            subAcertaCampoSeleciona(pTableview, "SELECIONA")
          End If
        End If
      End With
    End If
  Next
End Sub

Sub subAcertaCampoSeleciona(pTableview, pColuna)
  With pTableview.GetColumnByFieldName(pColuna)
    PropertiesClassName = "TcxCheckBoxProperties"
    '//Options.Editing = True
    Options.Filtering = False

    With TMgCxCheckBoxProperties(pTableview.GetColumnByFieldName(pColuna).Properties)
      ValueChecked = "S"
      ValueUnchecked = "N"
    End With

    ShowCheckBoxHeader = True
  End With
End Sub
'//--------------------------------------------------------
'//-------------------- FUNÇÕES PADRÃO --------------------
'//--------------------------------------------------------
