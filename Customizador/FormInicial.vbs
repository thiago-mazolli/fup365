'//Fim API Integracao Fup365
Dim vModInt As String = "Integrações"
Dim cBt_FORM_TJS_API_FUP365_LOG
'//Fim API Integracao Fup365

Sub OnFormCreate
  With FormInicial
    '//Fim API Integracao Fup365
    '// Materiais
    AddMenuCategoria(39, vModInt)

    cBt_FORM_TJS_API_FUP365_LOG = new TAction(FormInicial)
    cBt_FORM_TJS_API_FUP365_LOG.Name = "cBt_FORM_TJS_API_FUP365_LOG"
    cBt_FORM_TJS_API_FUP365_LOG.Caption = "Log de integração FUP 365"
    cBt_FORM_TJS_API_FUP365_LOG.OnExecute = AddressOf cBt_FORM_TJS_API_FUP365_LOG_OnExecute
    AddMenuAction1(39, vModInt, cBt_FORM_TJS_API_FUP365_LOG)
    '//'//Fim API Integracao Fup365
  End With
End Sub

'//Fim API Integracao Fup365
Sub cBt_FORM_TJS_API_FUP365_LOG_OnExecute
  ExecutaForm("FORM_TJS_API_FUP365_LOG").Show
End Sub
'//Fim API Integracao Fup365