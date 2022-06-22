# Mycaddy

## 프로그램 빌드

1. [Visual Studio Community](https://visualstudio.microsoft.com/ko/vs/community/)

2. Visual Studio 에서 mycaddy-downloader.sln 열기 (설치 후 해당 파일 클릭)

3. Visual Studio 상단 메뉴에서 : 빌드 > mycaddy-downloader 빌드(B) 실행

4. 탐색기에 bin/x86/Releae 폴더에 mycaddy-downloader.exe 실행 파일을 포함한 리소스 파일 생성됨 확인

## 설치 프로그램 (setup) 만들기

1. [NSIS 다운로드 및 설치](https://sourceforge.net/projects/nsis/)

2. NSIS 실행

3. "Compiler" 항목의 "Compile NSI scripts" 클릭

4. [MakeNSISW] NSIS 윈도우가 열리면 상단 메뉴 / file > Load Script 실행, ./mycaddy-downloader-setup/NSIS/mycaddy-downloader-setup.nsi 파일 선택

5. ./mycaddy-downloader-setup/NSIS 폴더에 mycaddy-downloader-setup.exe 파일 생성됨 (해당 파일명은 버전정보 포함해 변경 추천)

## 빌드 / 셋업 생성 시 확인 사항

- Auto Detection USB 장치 추가 관련 MainWindow.xaml.cs 파일

```c#

// MainWindow.xaml.cs

private void dispatch_usbList()
{
    // http://wangxinliu.com/tech/program/WPF-DataBinding/

    Application.Current.Dispatcher.Invoke(() =>
    {
        usbList.Clear();
        List<USBDeviceInfo> list = usbDetector.GetUSBDeviceList("VID_03EB&PID_2403");
        // List<USBDeviceInfo> list = usbDetector.GetUSBDeviceList();
        foreach (var item in list)
        {
            usbList.Add(item);
        }

        list = usbDetector.GetUSBDeviceList("VID_0483&PID_572A");
        // List<USBDeviceInfo> list = usbDetector.GetUSBDeviceList();
        foreach (var item in list)
        {
            usbList.Add(item);
        }

        // 이 부분을 복사 추가 하여 PID, VID 변경 하면 됩니다. ---------------
        list = usbDetector.GetUSBDeviceList("VID_03EB&PID_2424");
        // List<USBDeviceInfo> list = usbDetector.GetUSBDeviceList();
        foreach (var item in list)
        {
            usbList.Add(item);
        }
        // ---------------------------------------------------------------------

    });
}
```

- 버전 표시 변경

./Properties/AssemblyInfo.cs 맨 하단

```c#
[assembly: AssemblyVersion("1.3.4.2")]
[assembly: AssemblyFileVersion("1.3.4.2")]

```

./mycaddy-downloader-setup/NSIS/mycaddy-downloader-setup.nsi 맨 상단

```bash
!define PRODUCT_NAME "mycaddy-downloader"
!define PRODUCT_VERSION "1.3.4.2"
!define PRODUCT_PUBLISHER "MYCADDY Co., LTD."
!define PRODUCT_WEB_SITE "http://www.mycaddy.co.kr"
```
