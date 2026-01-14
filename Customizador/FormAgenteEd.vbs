'//API Integracao Fup365
Dim cCl_IntegraMe, cDs_IntegraMe, cCk_IntegraMe
'//Fim API Integracao Fup365

Sub OnFormCreate
  With FormAgenteEd
    '//API Integracao Fup365
    '//DATASOURCE E DATASET
    cCl_IntegraMe = New TMgClientDataSet(FormAtivo)
    cCl_IntegraMe.OnAfterOpen = AddressOf cCl_IntegraMe_OnAfterOpen()
    cCl_IntegraMe.OnClNewRecord = AddressOf cCl_IntegraMe_OnClNewRecord()
    With cCl_IntegraMe
      Name = "cCl_IntegraMe"
      TableName = "TJS_AGENTE"
      PkFields = "AGN_TAB_IN_CODIGO;AGN_PAD_IN_CODIGO;AGN_IN_CODIGO"
      IndexFieldNames = PkFields
      MasterFields = PkFields
      MasterSource = FormAtivo.Ed_AGN_IN_CODIGO1.DataSource
      SQL.Add("SELECT a.* FROM TJS_agente a")
    End With

    cDs_IntegraMe = New TMgDataSource(FormAtivo)
    With cDs_IntegraMe
      Name = "cDs_IntegraMe"
      DataSet = cCl_IntegraMe
    End With
    '//DATASOURCE E DATASET

    '//CHECKBOX
    cCk_IntegraMe = New TMgDBCheckBox(FormAtivo)
    With cCk_IntegraMe
      Name = "cCk_IntegraMe"
      Parent = FormAtivo.Ck_ForAprovado.Parent
      Caption = "Integração Mercado Eletrônico"
      Top = FormAtivo.Ck_ForAprovado.Top
      Left = FormAtivo.Ck_ForAprovado.Left + FormAtivo.Ck_ForAprovado.Width + 50
      Width = 150
      Anchors = FormAtivo.Ck_ForAprovado.Anchors
      DataSource = cDs_IntegraMe
      DataField  =  "AGN_CH_INTEGRAME"
      ValueChecked = "S"
      ValueUnChecked = "N"
    End With

    AddDataSource(cDs_IntegraMe)
    '//Fim API Integracao Fup365
  End With
End Sub

'//API Integracao Fup365
Sub cCl_IntegraMe_OnAfterOpen(pDataSet As TMgClientDataSet)
  If (pDataSet.RecordCount = 0) Then
    cCk_IntegraMe.Checked = False
  End If
End sub

Sub cCl_IntegraMe_OnClNewRecord(pDataSet As TMgClientDataSet)
  With pDataSet
    Edit
    FieldByName("AGN_CH_INTEGRAME").Value = "N"
  End With
End Sub

Sub AtualizaAntesGravacao()
  With FormAtivo
    Ed_AGN_IN_CODIGO1.HouveAlteracao = True
  End With
End Sub
'//Fim API Integracao Fup365
