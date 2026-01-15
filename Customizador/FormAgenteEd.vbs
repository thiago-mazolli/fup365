'//API Integracao Fup365
Dim cCl_IntegraFup, cDs_IntegraFup, cCk_IntegraFup
'//Fim API Integracao Fup365

Sub OnFormCreate
  With FormAgenteEd
    '//API Integracao Fup365
    '//DATASOURCE E DATASET
    cCl_IntegraFup = New TMgClientDataSet(FormAtivo)
    cCl_IntegraFup.OnAfterOpen = AddressOf cCl_IntegraFup_OnAfterOpen()
    cCl_IntegraFup.OnClNewRecord = AddressOf cCl_IntegraFup_OnClNewRecord()
    With cCl_IntegraFup
      Name = "cCl_IntegraFup"
      TableName = "TJS_AGENTE"
      PkFields = "AGN_TAB_IN_CODIGO;AGN_PAD_IN_CODIGO;AGN_IN_CODIGO"
      IndexFieldNames = PkFields
      MasterFields = PkFields
      MasterSource = FormAtivo.Ed_AGN_IN_CODIGO1.DataSource
      SQL.Add("SELECT a.* FROM tjs_agente a")
    End With

    cDs_IntegraFup = New TMgDataSource(FormAtivo)
    With cDs_IntegraFup
      Name = "cDs_IntegraFup"
      DataSet = cCl_IntegraFup
    End With
    '//DATASOURCE E DATASET

    '//CHECKBOX
    cCk_IntegraFup = New TMgDBCheckBox(FormAtivo)
    With cCk_IntegraFup
      Name = "cCk_IntegraFup"
      Parent = FormAtivo.Ck_ForAprovado.Parent
      Caption = "Integração FUP365"
      Top = FormAtivo.Ck_ForAprovado.Top
      Left = FormAtivo.Ck_ForAprovado.Left + FormAtivo.Ck_ForAprovado.Width + 50
      Width = 150
      Anchors = FormAtivo.Ck_ForAprovado.Anchors
      DataSource = cDs_IntegraFup
      DataField  =  "AGN_CH_INTEGRAFUP"
      ValueChecked = "S"
      ValueUnChecked = "N"
    End With

    AddDataSource(cDs_IntegraFup)
    '//Fim API Integracao Fup365
  End With
End Sub

'//API Integracao Fup365
Sub cCl_IntegraFup_OnAfterOpen(pDataSet As TMgClientDataSet)
  If (pDataSet.RecordCount = 0) Then
    cCk_IntegraFup.Checked = False
  End If
End sub

Sub cCl_IntegraFup_OnClNewRecord(pDataSet As TMgClientDataSet)
  With pDataSet
    Edit
    FieldByName("AGN_CH_INTEGRAFUP").Value = "N"
  End With
End Sub

Sub AtualizaAntesGravacao()
  With FormAtivo
    Ed_AGN_IN_CODIGO1.HouveAlteracao = True
  End With
End Sub
'//Fim API Integracao Fup365
