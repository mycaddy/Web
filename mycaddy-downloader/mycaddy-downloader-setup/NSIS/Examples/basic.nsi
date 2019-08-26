;https://www.opentutorials.org/module/3650/21900

; MUI https://wonsx.tistory.com/24

; HM NIS Edit Wizard helper defines
!define PRODUCT_NAME "mycaddy-downloader"
!define PRODUCT_VERSION "1.0.5.0"
!define PRODUCT_PUBLISHER "MYCADDY Co., LTD."
!define PRODUCT_WEB_SITE "http://www.mycaddy.co.kr"

!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\프로그램명.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"
 

; MUI 1.67 compatible ------
!include "MUI.nsh"
!include "x64.nsh"
!include "LogicLib.nsh"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON ".\install.ico"
!define MUI_UNICON ".\install.ico"

; Welcome page

!insertmacro MUI_PAGE_WELCOME

; License page

; !insertmacro MUI_PAGE_LICENSE "..\..\..\..\path\to\licence\YourSoftwareLicence.txt"

; Directory page

; !insertmacro MUI_PAGE_DIRECTORY

; Instfiles page

!insertmacro MUI_PAGE_INSTFILES

; Finish page

!insertmacro MUI_PAGE_FINISH

 

; Uninstaller pages

!insertmacro MUI_UNPAGE_INSTFILES

 

; Language files

!insertmacro MUI_LANGUAGE "Korean"

 

; MUI end ------

 

Name "${PRODUCT_NAME}"

OutFile "설치파일명.exe"

InstallDir "$PROGRAMFILES\Moong\TestProgram"

InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""

ShowInstDetails show

ShowUnInstDetails show



; 재배포 패키지 x86 설치

Function InstallVCRedist_x86

    Call CheckVCRedist_x86 ; 재배포 패키지가 설치되어 있는지 확인하는 함수 호출

    Pop $R0

    StrCmp $R0 "No" 0 +3

    ;MessageBox MB_OK|MB_ICONSTOP "프로그램 실행을 위해 Visual C++ 2008 SP1 Redistributable x86을(를) 설치합니다."

    ExecWait '"$TEMP\vcredist_x86.exe" /qb /norestart'

FunctionEnd

; 이미 재배포 패키지가 설치되어 있는지 확인하는 함수

Function CheckVCRedist_x86

   Push $R0

   ClearErrors

   SetRegView 32

   ; 재배포 패키지는 "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall" 경로에서 Product Code를 확인할 수 있다.

   ; DisplayName에 "Microsoft Visual C++ 2010  x64 Redistributable - 10.0.40219" 이런식으로 기재되어 있으니 자신이 설치하려고 하는 재배포 패키지와 버전이 맞는지 확인.

   ; 인터넷에 검색하면 나오기도 하지만 영문 버전, 한글 버전, 그리고 뒤에 세부 버전에 따라 Product Code가 다 다르다고 하니 자신이 설치하려고 하는 재배포 패키지를 직접 설치한 후 Product Code를 직접 확인하는 것이 제일 좋다.

   ;ReadRegDword $R0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{9A25302D-30C0-39D9-BD6F-21E6EC160475}" "Version" ;2008 SP1 x86

  ; https://stackoverflow.com/questions/12206314/detect-if-visual-c-redistributable-for-visual-studio-2012-is-installed
   ReadRegDword $R0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{5bfc1380-fd35-4b85-9715-7351535d077e}" "Version" ;2008 SP1 x86 MFC

   ; if VS 2008 SP1 redist x86 not installed, install it
   IfErrors 0 VSRedistx86Installed

   StrCpy $R0 "No"

VSRedistx86Installed:

   Exch $R0

FunctionEnd



; 재배포 패키지 x64 설치

Function InstallVCRedist_x64

    Call CheckVCRedist_x64 ; 재배포 패키지가 설치되어 있는지 확인하는 함수 호출

    Pop $R0

    StrCmp $R0 "No" 0 +3

;MessageBox MB_OK|MB_ICONSTOP "프로그램 실행을 위해 Visual C++ 2008 SP1 Redistributable x64을(를) 설치합니다."

    ExecWait '"$TEMP\vcredist_x64.exe" /qb /norestart'

FunctionEnd

; 이미 재배포 패키지가 설치되어 있는지 확인하는 함수

Function CheckVCRedist_x64

   Push $R0

   ClearErrors

   SetRegView 64

   ; 재배포 패키지는 "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall" 경로에서 Product Code를 확인할 수 있다.

   ; DisplayName에 "Microsoft Visual C++ 2010  x64 Redistributable - 10.0.40219" 이런식으로 기재되어 있으니 자신이 설치하려고 하는 재배포 패키지와 버전이 맞는지 확인.

   ; 인터넷에 검색하면 나오기도 하지만 영문 버전, 한글 버전, 그리고 뒤에 세부 버전에 따라 Product Code가 다 다르다고 하니 자신이 설치하려고 하는 재배포 패키지를 직접 설치한 후 Product Code를 직접 확인하는 것이 제일 좋다.

   ;ReadRegDword $R0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{8220EEFE-38CD-377E-8595-13398D740ACE}" "Version" ;2008 SP1 x64

   ReadRegDword $R0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{5FCE6D76-F5DC-37AB-B2B8-22AB8CEDB1D4}" "Version" ;2008 SP1 x64 MFC

   SetRegView 32

   ; if VS 2008 SP1 redist x64 not installed, install it

   IfErrors 0 VSRedistx64Installed

   StrCpy $R0 "No"

VSRedistx64Installed:

   Exch $R0

FunctionEnd

 

Section "MainSection" SEC01

  ; 먼저 재배포 패키지 설치 파일을 TEMP 폴더에 넣어둔다.

  SetOutPath "$TEMP"

  SetOverwrite on

  File ".\vcredist_x86.exe"
  File ".\vcredist_x64.exe"

  ; 재배포 패키지 설치 함수 호출.
  Call InstallVCRedist_x86
  Call InstallVCRedist_x64
 

  SetOutPath "$SYSDIR"

  SetOverwrite on

  File ".\TestProject\Test.ocx"

  RegDLL "$SYSDIR\Test.ocx" ; 파일 레지 등록

  

  SetOutPath "$SYSDIR"

  SetOverwrite on

  ${DisableX64FSRedirection} ; 64비트 환경에서 Syswow64 폴더가 아니라 System32 폴더에 넣고자 할 때.

  File ".\TestProject\Test_x64.ocx"

  ExecWait '"$SYSDIR\regsvr32.exe" /s "$SYSDIR\Text_x64.ocx"' ; x64 파일 레지 등록

  ${EnableX64FSRedirection}

SectionEnd

 

Section -Post

  WriteUninstaller "$SYSDIR\UnInstaller.exe"

  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$WINDIR\SysWOW64\프로그램명.exe"

  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "${PRODUCT_NAME}"

  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$SYSDIR\UnInstaller.exe"

  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$WINDIR\SysWOW64\프로그램명.exe"

  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"

  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"

  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"

SectionEnd

 

 

Function un.onUninstSuccess

  HideWindow

  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name)는(은) 완전히 제거되었습니다."

FunctionEnd

 

Function un.onInit

  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "$(^Name)을(를) 제거하시겠습니까?" IDYES +2

  Abort

FunctionEnd

 

Section Uninstall

  ; 재배포 패키지 설치 파일 삭제. 프로그램 삭제 시가 아니라 설치 시 재배포 패키지 설치 후 바로 삭제해도 됨.

  Delete "$TEMP\vcredist_x86.exe"

  Delete "$TEMP\vcredist_x64.exe"

  

  Delete "$SYSDIR\UnInstaller.exe"

  ${DisableX64FSRedirection}

  ExecWait '"$SYSDIR\regsvr32.exe" /u /s "$SYSDIR\Test_x64.ocx"'

  Delete "$SYSDIR\Test_x64.ocx"

  ${EnableX64FSRedirection}

  

  UnRegDLL "$SYSDIR\Test.ocx"

  Delete "$SYSDIR\Test.ocx"

 

  ;RMDir "$WINDIR\SysWOW64"

  ;RMDir "$WINDIR\System32"

 

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"

  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"

  SetAutoClose true

SectionEnd


Function InstallVCRedist
;MessageBox MB_ICONINFORMATION|MB_OK "재배포패키지 설치시작"
    Call CheckVCRedist
    Pop $R0
    StrCmp $R0 "No" 0 +3
   File "TEST\Driver\vcredist_x86.exe"  ; 지정된 경로를 적어둠.

 

   ExecWait 'vcredist_x86.exe /q:a /c:"msiexec /i vcredist.msi /qb! /l*v $TEMP\vcredist_x86.log" '

​;//처음에 자동설치모드로 실행했으나,, 해당PC에 vcredist_x86이 있는경우 복구/삭제 선택메뉴 뜨게됨..

;// 맨아래 옵션주면 복구/삭제메뉴를 보지 않도록 한다. ​

;//각 옵션별 기능. 

 ;  ExecWait 'vcredist_x86.exe' # 일반설치
 ; ExecWait '"vcredist_x86.exe" /q' # silent install 자동설치

;  ExecWait '"vcredist_x86.exe" /q:a' # silent install, display a progress dialog but requires no user interaction.
;  ExecWait '"vcredist_x86.exe" /qb' # unattended install 무인설치
;  ExecWait 'vcredist_x86.exe /q:a /c:"msiexec /i vcredist.msi /qb! /l*v $TEMP\vcredist_x86.log" ' # suppress all UI during installation.

FunctionEnd


Function CheckVCRedist
   Push $R0
   ClearErrors
   ReadRegDword $R0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{9A25302D-30C0-39D9-BD6F-21E6EC160475}}" "Version"

   IfErrors 0 VSRedistInstalled
   StrCpy $R0 "No"

VSRedistInstalled:
   Exch $R0
FunctionEnd

