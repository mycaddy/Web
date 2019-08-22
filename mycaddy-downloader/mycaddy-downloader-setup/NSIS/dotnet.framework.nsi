{{PageAuthor|zimsms}}

== Description ==
I have supplied the following since most people installing the .NET Framework only choose to install the English version, which may be incorrect for their end user's machine. This code also contains the proper error handling, which most installs do not contain. 
This 'Template' can be used for pretty much any Microsoft download with a few modifications. I have cut most of the 'extra' languages out to keep the example simple.
THIS IS NOT A COMPLETE SCRIPT. IT IS INTENDED TO ASSIST THOSE REQUIRING THE INSTALLATION OF THE .NET FRAMEWORK FOR A MULTI-LANGUAGE INSTALL.

== Defines ==
<highlight-nsis>
!define BASE_URL http://download.microsoft.com/download
; .NET Framework
; English
!define URL_DOTNET_1033 "${BASE_URL}/a/a/c/aac39226-8825-44ce-90e3-bf8203e74006/dotnetfx.exe"
;German
!define URL_DOTNET_1031 "${BASE_URL}/4/f/3/4f3ac857-e063-45d0-9835-83894f20e808/dotnetfx.exe"
;Spanish
!define URL_DOTNET_1034 "${BASE_URL}/8/f/0/8f023ff4-2dc1-4f10-9618-333f5b9f8040/dotnetfx.exe"
;French
!define URL_DOTNET_1036 "${BASE_URL}/e/d/a/eda9d4ea-8ec9-4431-8efa-75391fb91421/dotnetfx.exe"
;Portuguese (Brazil)
!define URL_DOTNET_1046 "${BASE_URL}/8/c/f/8cf55d0c-235e-4062-933c-64ffdf7e7043/dotnetfx.exe"
;Chinese (Simplified)
!define URL_DOTNET_2052 "${BASE_URL}/7/b/9/7b90644d-1af0-42b9-b76d-a2770319a568/dotnetfx.exe"
!define URL_DOTNET_4100 "${BASE_URL}/7/b/9/7b90644d-1af0-42b9-b76d-a2770319a568/dotnetfx.exe"
;Chinese (Traditional)
!define URL_DOTNET_1028 "${BASE_URL}/8/2/7/827bb1ef-f5e1-4464-9788-40ef682930fd/dotnetfx.exe"
!define URL_DOTNET_3076 "${BASE_URL}/8/2/7/827bb1ef-f5e1-4464-9788-40ef682930fd/dotnetfx.exe"
!define URL_DOTNET_5124 "${BASE_URL}/8/2/7/827bb1ef-f5e1-4464-9788-40ef682930fd/dotnetfx.exe"
;Czech
!define URL_DOTNET_1029 "${BASE_URL}/2/a/2/2a224db0-2e6d-4961-99ed-6f377555b1ef/dotnetfx.exe"
;Danish
!define URL_DOTNET_1030 "${BASE_URL}/e/7/5/e755a559-025d-4282-95ae-d14a8d0b1929/dotnetfx.exe"
;Dutch
!define URL_DOTNET_1043 "${BASE_URL}/4/6/b/46b519cb-bdd2-4701-b962-9ffaa323f40b/dotnetfx.exe"
!define URL_DOTNET_2067 "${BASE_URL}/4/6/b/46b519cb-bdd2-4701-b962-9ffaa323f40b/dotnetfx.exe"
;Finnish
!define URL_DOTNET_1035 "${BASE_URL}/d/a/6/da6b472c-157c-429a-98f6-6eb87fa36fd3/dotnetfx.exe"
;Greek
!define URL_DOTNET_1032 "${BASE_URL}/5/9/8/598fb686-cd09-45cd-8b13-2a0fd814e4cc/dotnetfx.exe"
;Hungarian
!define URL_DOTNET_1038 "${BASE_URL}/8/2/0/82093ba7-c9a4-457d-864d-bbeb1cd884d4/dotnetfx.exe"
;Italian
!define URL_DOTNET_1040 "${BASE_URL}/1/f/a/1fa816d7-a8d6-4f15-b682-b96239e68ab7/dotnetfx.exe"
!define URL_DOTNET_2064 "${BASE_URL}/1/f/a/1fa816d7-a8d6-4f15-b682-b96239e68ab7/dotnetfx.exe"
;Japanese
!define URL_DOTNET_1041 "${BASE_URL}/5/b/5/5b510096-5b68-4e3f-8f9e-56fb7a80ca81/dotnetfx.exe"
;Korean
!define URL_DOTNET_1042 "${BASE_URL}/d/2/d/d2db6a60-6fb1-4015-ae45-2fb84ec30faa/dotnetfx.exe"
;Norwegian
!define URL_DOTNET_1044 "${BASE_URL}/b/6/6/b663aaf1-ef27-4119-8cf1-fa23888cf6a7/dotnetfx.exe"
!define URL_DOTNET_2068 "${BASE_URL}/b/6/6/b663aaf1-ef27-4119-8cf1-fa23888cf6a7/dotnetfx.exe"
;Polish
!define URL_DOTNET_1045 "${BASE_URL}/c/9/f/c9f672f3-c14b-4cff-9671-d419842d792d/dotnetfx.exe"
;Portuguese (Portugal)
!define URL_DOTNET_2070 "${BASE_URL}/1/2/0/1206b231-b961-40ca-9ac2-e4ab7e92ca9b/dotnetfx.exe"
;Russian
!define URL_DOTNET_1049 "${BASE_URL}/0/8/6/086e7824-ddad-45c0-b765-721e5e28e4c5/dotnetfx.exe"
;Swedish
!define URL_DOTNET_1053 "${BASE_URL}/3/0/0/300b9c1c-9a26-4334-b273-8c0064ba5f2b/dotnetfx.exe"
;Turkish
!define URL_DOTNET_1055 "${BASE_URL}/a/f/7/af738ebf-dc15-4c61-a20d-1c29306cd9bc/dotnetfx.exe"
; ... If you need one not listed above you will have to visit the Microsoft Download site,
; select the language you are after and scan the page source to obtain the link.</highlight-nsis>

== Variables ==
<highlight-nsis>
Var "LANGUAGE_DLL_TITLE"
Var "LANGUAGE_DLL_INFO"
Var "URL_DOTNET"
Var "OSLANGUAGE"
Var "DOTNET_RETURN_CODE"
</highlight-nsis>

== Language Strings ==
<highlight-nsis>
LangString DESC_REMAINING ${LANG_ENGLISH} " (%d %s%s remaining)"
LangString DESC_PROGRESS ${LANG_ENGLISH} "%d.%01dkB/s" ;"%dkB (%d%%) of %dkB @ %d.%01dkB/s"
LangString DESC_PLURAL ${LANG_ENGLISH} "s"
LangString DESC_HOUR ${LANG_ENGLISH} "hour"
LangString DESC_MINUTE ${LANG_ENGLISH} "minute"
LangString DESC_SECOND ${LANG_ENGLISH} "second"
LangString DESC_CONNECTING ${LANG_ENGLISH} "Connecting..."
LangString DESC_DOWNLOADING ${LANG_ENGLISH} "Downloading %s"
LangString DESC_SHORTDOTNET ${LANG_ENGLISH} "Microsoft .Net Framework 1.1"
LangString DESC_LONGDOTNET ${LANG_ENGLISH} "Microsoft .Net Framework 1.1"
LangString DESC_DOTNET_DECISION ${LANG_ENGLISH} "$(DESC_SHORTDOTNET) is required.$\nIt is strongly \
  advised that you install$\n$(DESC_SHORTDOTNET) before continuing.$\nIf you choose to continue, \
  you will need to connect$\nto the internet before proceeding.$\nWould you like to continue with \
  the installation?"
LangString SEC_DOTNET ${LANG_ENGLISH} "$(DESC_SHORTDOTNET) "
LangString DESC_INSTALLING ${LANG_ENGLISH} "Installing"
LangString DESC_DOWNLOADING1 ${LANG_ENGLISH} "Downloading"
LangString DESC_DOWNLOADFAILED ${LANG_ENGLISH} "Download Failed:"
LangString ERROR_DOTNET_DUPLICATE_INSTANCE ${LANG_ENGLISH} "The $(DESC_SHORTDOTNET) Installer is \
  already running."
LangString ERROR_NOT_ADMINISTRATOR ${LANG_ENGLISH} "$(DESC_000022)"
LangString ERROR_INVALID_PLATFORM ${LANG_ENGLISH} "$(DESC_000023)"
LangString DESC_DOTNET_TIMEOUT ${LANG_ENGLISH} "The installation of the $(DESC_SHORTDOTNET) \
  has timed out."
LangString ERROR_DOTNET_INVALID_PATH ${LANG_ENGLISH} "The $(DESC_SHORTDOTNET) Installation$\n\
  was not found in the following location:$\n"
LangString ERROR_DOTNET_FATAL ${LANG_ENGLISH} "A fatal error occurred during the installation$\n\
  of the $(DESC_SHORTDOTNET)."
LangString FAILED_DOTNET_INSTALL ${LANG_ENGLISH} "The installation of $(PRODUCT_NAME) will$\n\
  continue. However, it may not function properly$\nuntil $(DESC_SHORTDOTNET)$\nis installed."
</highlight-nsis>

== Section ==
<highlight-nsis>
  Section $(SEC_DOTNET) SECDOTNET
    SectionIn RO
    IfSilent lbl_IsSilent
    !define DOTNETFILESDIR "Common\Files\MSNET"
    StrCpy $DOTNET_RETURN_CODE "0"
!ifdef DOTNET_ONCD_1033
    StrCmp "$OSLANGUAGE" "1033" 0 lbl_Not1033
    SetOutPath "$PLUGINSDIR"
    file /r "${DOTNETFILESDIR}\dotnetfx1033.exe"
    DetailPrint "$(DESC_INSTALLING) $(DESC_SHORTDOTNET)..."
    Banner::show /NOUNLOAD "$(DESC_INSTALLING) $(DESC_SHORTDOTNET)..."
    nsExec::ExecToStack '"$PLUGINSDIR\dotnetfx1033.exe" /q /c:"install.exe /noaspupgrade /q"'
    pop $DOTNET_RETURN_CODE
    Banner::destroy
    SetRebootFlag true
    Goto lbl_NoDownloadRequired
    lbl_Not1033:
!endif
; Insert Other language blocks here

    ; the following Goto and Label is for consistency.
    Goto lbl_DownloadRequired
    lbl_DownloadRequired:
    DetailPrint "$(DESC_DOWNLOADING1) $(DESC_SHORTDOTNET)..."
    MessageBox MB_ICONEXCLAMATION|MB_YESNO|MB_DEFBUTTON2 "$(DESC_DOTNET_DECISION)" /SD IDNO \
      IDYES +2 IDNO 0
    Abort
    ; "Downloading Microsoft .Net Framework"
    AddSize 153600
    nsisdl::download /TRANSLATE "$(DESC_DOWNLOADING)" "$(DESC_CONNECTING)" \
       "$(DESC_SECOND)" "$(DESC_MINUTE)" "$(DESC_HOUR)" "$(DESC_PLURAL)" \
       "$(DESC_PROGRESS)" "$(DESC_REMAINING)" \
       /TIMEOUT=30000 "$URL_DOTNET" "$PLUGINSDIR\dotnetfx.exe"
    Pop $0
    StrCmp "$0" "success" lbl_continue
    DetailPrint "$(DESC_DOWNLOADFAILED) $0"
    Abort

    lbl_continue:
      DetailPrint "$(DESC_INSTALLING) $(DESC_SHORTDOTNET)..."
      Banner::show /NOUNLOAD "$(DESC_INSTALLING) $(DESC_SHORTDOTNET)..."
      nsExec::ExecToStack '"$PLUGINSDIR\dotnetfx.exe" /q /c:"install.exe /noaspupgrade /q"'
      pop $DOTNET_RETURN_CODE
      Banner::destroy
      SetRebootFlag true
      ; silence the compiler
      Goto lbl_NoDownloadRequired
      lbl_NoDownloadRequired:

      ; obtain any error code and inform the user ($DOTNET_RETURN_CODE)
      ; If nsExec is unable to execute the process,
      ; it will return "error"
      ; If the process timed out it will return "timeout"
      ; else it will return the return code from the executed process.
      StrCmp "$DOTNET_RETURN_CODE" "" lbl_NoError
      StrCmp "$DOTNET_RETURN_CODE" "0" lbl_NoError
      StrCmp "$DOTNET_RETURN_CODE" "3010" lbl_NoError
      StrCmp "$DOTNET_RETURN_CODE" "8192" lbl_NoError
      StrCmp "$DOTNET_RETURN_CODE" "error" lbl_Error
      StrCmp "$DOTNET_RETURN_CODE" "timeout" lbl_TimeOut
      ; It's a .Net Error
      StrCmp "$DOTNET_RETURN_CODE" "4101" lbl_Error_DuplicateInstance
      StrCmp "$DOTNET_RETURN_CODE" "4097" lbl_Error_NotAdministrator
      StrCmp "$DOTNET_RETURN_CODE" "1633" lbl_Error_InvalidPlatform lbl_FatalError
      ; all others are fatal

    lbl_Error_DuplicateInstance:
    DetailPrint "$(ERROR_DOTNET_DUPLICATE_INSTANCE)"
    GoTo lbl_Done

    lbl_Error_NotAdministrator:
    DetailPrint "$(ERROR_NOT_ADMINISTRATOR)"
    GoTo lbl_Done

    lbl_Error_InvalidPlatform:
    DetailPrint "$(ERROR_INVALID_PLATFORM)"
    GoTo lbl_Done

    lbl_TimeOut:
    DetailPrint "$(DESC_DOTNET_TIMEOUT)"
    GoTo lbl_Done

    lbl_Error:
    DetailPrint "$(ERROR_DOTNET_INVALID_PATH)"
    GoTo lbl_Done

    lbl_FatalError:
    DetailPrint "$(ERROR_DOTNET_FATAL)[$DOTNET_RETURN_CODE]"
    GoTo lbl_Done

    lbl_Done:
    DetailPrint "$(FAILED_DOTNET_INSTALL)"
    lbl_NoError:
    lbl_IsSilent:
  SectionEnd

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SECDOTNET} $(DESC_LONGDOTNET)
!insertmacro MUI_FUNCTION_DESCRIPTION_END
</highlight-nsis>
This requires some setup in .OnInit:
<highlight-nsis>
Function .onInit
  StrCpy $LANGUAGE_DLL_TITLE "Installer Language"
  StrCpy $LANGUAGE_DLL_INFO "Please select a language:"
  StrCpy $URL_DOTNET "${URL_DOTNET_1033}"
  StrCpy $OSLANGUAGE "1033"

; Insert other Language Blocks Here

  !define MUI_LANGDLL_WINDOWTITLE "$LANGUAGE_DLL_TITLE"
  !define MUI_LANGDLL_INFO "$LANGUAGE_DLL_INFO"
  !insertmacro MUI_LANGDLL_DISPLAY
  !undef MUI_LANGDLL_WINDOWTITLE
  !undef MUI_LANGDLL_INFO
  InitPluginsDir
  SetOutPath "$PLUGINSDIR"
  File "Common\Plugins\*.*"
  File /r "${NSISDIR}\Plugins\*.*"
FunctionEnd
</highlight-nsis>
I test for IsDotNetInstalled by defining a custom function overriding GUI Init, and set the section selection accordingly.
Hopefully this was of use to you.
Cheers!

[[Category:Code Examples]]
