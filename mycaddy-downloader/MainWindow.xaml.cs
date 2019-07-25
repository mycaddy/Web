using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;
using System.ComponentModel;
using FluentFTP;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Interop;
using System.Windows.Threading;

using mycaddy_downloader.utils;
using System.Collections.ObjectModel;

namespace mycaddy_downloader
{
    /// <summary>
    /// MainWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    /// http://www.csharpstudy.com/Threads/backgroundworker.aspx
    /// 
    public partial class MainWindow : Window
    {
        // Move window with body >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [DllImportAttribute("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg,
                int wParam, int lParam);
        [DllImportAttribute("user32.dll")]
        public static extern bool ReleaseCapture();
        public void move_window(object sender, MouseButtonEventArgs e)
        {
            ReleaseCapture();
            SendMessage(new WindowInteropHelper(this).Handle,
                WM_NCLBUTTONDOWN, HT_CAPTION, 0);
        }
        // Move window with body <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        static class Constants
        {
            public const string FTP_ADDR = "222.236.46.92";
            public const string FTP_ID = "mycaddy";
            public const string FTP_PWD = "rladudtjs";
        }

        // Utils >>>>>>>>>>>>>>>>>>>>>>
        string DOWNLOAD_PATH = "";
        FtpClient ftp;
        USBDetector usbDetector;
        // <<<<<<<<<<<<<<<<<<<<<< Utils

        /*    
        public IList<Model> Models
        {
            get { return Models; }
            set { Models = value; }
        }
        */

        public ObservableCollection<USBDeviceInfo> usbList { get; set; }
        public ObservableCollection<DiskDriveInfo> diskList { get; set; }
        public ObservableCollection<MediaInfo> mediaList { get; set; }

        public MainWindow()
        {
            InitializeComponent();
            Initialize();
            DataContext = this;
        }

        private void Initialize()
        {
            // FTP Init
            DOWNLOAD_PATH = $@"{Directory.GetCurrentDirectory()}\_download";
            if (!Directory.Exists(DOWNLOAD_PATH))
            {
                Directory.CreateDirectory(DOWNLOAD_PATH);
            }

            ftp = new FtpClient(Constants.FTP_ADDR);
            ftp.Credentials = new NetworkCredential(Constants.FTP_ID, Constants.FTP_PWD);

            // USB Devices init
            usbDetector = new USBDetector();
            usbDetector.StartWatching();
            usbDetector.VolumeChanged += UsbDetector_VolumeChanged;
            usbList = new ObservableCollection<USBDeviceInfo>();
            diskList = new ObservableCollection<DiskDriveInfo>();
            mediaList = new ObservableCollection<MediaInfo>();

            dispatch_UsbList();
            // dispatch_DiskList();
            // dispatch_MediaList();

        }

        private void UsbDetector_VolumeChanged(object sender, EventArgs e)
        {
            dispatch_UsbList();
            // dispatch_DiskList();
            // dispatch_MediaList();
        }
        
        private void dispatch_UsbList()
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
            });

            // Check Mycaddy device
            bool bDetect = false;
            string sDetectString = "Device not founded";
            if (usbList.Count > 0)
            {
                bDetect = true;
                sDetectString = "Device founded";
            }

            Application.Current.Dispatcher.Invoke(() =>
            {
                cbxDeviceEnable.IsEnabled = bDetect;
                cbxDeviceEnable.IsChecked = bDetect;
                cbxDeviceEnable.Content = sDetectString;
            });


        }

        private void dispatch_DiskList()
        {
            // http://wangxinliu.com/tech/program/WPF-DataBinding/

            Application.Current.Dispatcher.Invoke(() =>
            {
                diskList.Clear();
                List<DiskDriveInfo> list = usbDetector.GetUSBDkiskList();
                foreach (var item in list)
                {
                    diskList.Add(item);
                }
            });
        }

        private void dispatch_MediaList()
        {
            // http://wangxinliu.com/tech/program/WPF-DataBinding/

            Application.Current.Dispatcher.Invoke(() =>
            {
                mediaList.Clear();
                List<MediaInfo> list = usbDetector.GetMediaList();
                foreach (var item in list)
                {
                    mediaList.Add(item);
                }
            });
        }

        private void BtnDownload_Click(object sender, RoutedEventArgs e)
        {
            prgbDownload.Value = 0;
            btnDownload.IsEnabled = false;

            Progress<FtpProgress> progress = new Progress<FtpProgress>(x => {
                if (x.Progress < 0)
                {
                    prgbDownload.IsIndeterminate = true;
                }
                else
                {
                    prgbDownload.IsIndeterminate = false;
                    prgbDownload.Value = x.Progress;
                }
            });
          

            ftp.Connect();
            if (ftp.IsConnected)
            {
                BackgroundWorker worker = new BackgroundWorker();
                worker.WorkerReportsProgress = true;
                worker.DoWork += Worker_DoWork;
                worker.ProgressChanged += Worker_ProgressChanged;
                worker.RunWorkerCompleted += Worker_RunWorkerCompleted;
                worker.RunWorkerAsync();
                ftp.Disconnect();
            }
            else
            {
                MessageBox.Show("Not connected");
            }
           
        }

        private void Worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            btnDownload.IsEnabled = true;
        }

        private void Worker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            prgbDownload.Value = e.ProgressPercentage;
        }

        private void Worker_DoWork(object sender, DoWorkEventArgs e)
        {
            for (int i = 0; i <= 100; i++)
            {
                (sender as BackgroundWorker).ReportProgress(i);
                Thread.Sleep(10);
            }
        }


        private void ReadModels()
        {
            // 

            // read JSON directly from a file
            // string path = Directory.GetCurrentDirectory();
            string configPath = $@"{Directory.GetCurrentDirectory()}\model.json";

            JObject o1 = JObject.Parse(File.ReadAllText(configPath));
            Console.WriteLine(o1);
            foreach(var item in o1)
            {
                
            }

            using (StreamReader file = File.OpenText(configPath))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                JObject o2 = (JObject)JToken.ReadFrom(reader);
                Console.WriteLine(o2);
            }
        }
        

    }
}
