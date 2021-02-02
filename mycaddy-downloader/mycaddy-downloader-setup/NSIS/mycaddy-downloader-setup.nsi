!include "MUI2.nsh"
!include "DotNetChecker.nsh"
!include WinVer.nsh

!define PRODUCT_NAME "mycaddy-downloader"
!define PRODUCT_VERSION "1.3.4.0"
!define PRODUCT_PUBLISHER "MYCADDY Co., LTD."
!define PRODUCT_WEB_SITE "http://www.mycaddy.co.kr"

;!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\${PRODUCT_NAME}.exe"
;!define PRODUCT_UNINST_ROOT_KEY "HKLM"
;!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"

Name "${PRODUCT_NAME}"
OutFile "${PRODUCT_NAME}-setup.exe"

InstallDir "$PROGRAMFILES32\${PRODUCT_NAME}" 
InstallDirRegKey HKCU "Software\${PRODUCT_NAME}" ""

RequestExecutionLevel admin

!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
 
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
  
!insertmacro MUI_LANGUAGE "English"


SetOverWrite on

Section "Program" SEC_PROGRAM

  SetOutPath "$INSTDIR"
 
  !insertmacro CheckNetFramework 472
  
  File /r /x "*.pdb" "..\..\bin\x86\Release\*.*" 

  ;create desktop shortcut
  CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe" ""
 
  ;create start-menu items
  CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe" "" "$INSTDIR\${PRODUCT_NAME}.exe" 0

  ;write uninstall information to the registry
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME} (remove only)"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"

  WriteUninstaller "$INSTDIR\Uninstall.exe"

SectionEnd

Section "Config" SEC_CONFIG

  SetOutPath "$APPDATA\mycaddy"

  SetOverwrite on

  File /r "..\..\_download"

SectionEnd

Section "Visual C++ Redistributable Library" SEC_CPP_REDIST

  SetOutPath "$TEMP"

  SetOverwrite on

  File ".\vc_redist.x86.exe"

  ;Call Installvc_redist.x86

SectionEnd


Section "Uninstall"

  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"

  ;Delete Start Menu Shortcuts
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\*.*"
  RmDir  "$SMPROGRAMS\${PRODUCT_NAME}"
 
  ;Delete Uninstaller And Unistall Registry Entries
  DeleteRegKey HKEY_LOCAL_MACHINE "SOFTWARE\${PRODUCT_NAME}"
  DeleteRegKey HKEY_LOCAL_MACHINE "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"  

SectionEnd

Function .onInit
  ${IfNot} ${AtLeastWin7}
    MessageBox MB_OK "Windows 7 and above required"
    Quit
  ${EndIf}

  ; define mandatory sections
  SectionSetFlags ${SEC_PROGRAM} 17
  SectionSetFlags ${SEC_CONFIG} 17
  SectionSetFlags ${SEC_CPP_REDIST} 17
  
FunctionEnd

Function .onInstSuccess
   Call Installvc_redist.x86
FunctionEnd

Function Installvc_redist.x86
    ; https://wonsx.tistory.com/30
    ; https://stackoverflow.com/questions/12206314/detect-if-visual-c-redistributable-for-visual-studio-2012-is-installed
    ; https://m.blog.naver.com/PostView.nhn?blogId=ddarunglee&logNo=220110762955&proxyReferer=https%3A%2F%2Fwww.google.com%2F
    
    ReadRegDword $R0 HKCR "Installer\Dependencies\VC,redist.x86,x86,14.22,bundle" "Version"

    ${If} $R0 == "14.22.27821.0"
      MessageBox MB_OK|MB_ICONINFORMATION  "Visual C++ Redistributable Library Already Installed"
    ${Else}
      MessageBox MB_OK|MB_ICONINFORMATION  "Install Visual C++ Redistributable Library v14.22.27821.0"
      ExecWait "$TEMP\vc_redist.x86.exe"
      ; ExecWait '"$TEMP\vc_redist.x86.exe" /q:a /c:"msiexec /i vcredist.msi /qb! /l*v $TEMP\vc_redist.x86.log" '
      ; ExecWait 'vc_redist.x86.exe /q:a /c:"msiexec /i vcredist.msi /qb! /l*v $TEMP\vc_redist.x86.log" '
    ${EndIf}

FunctionEnd
