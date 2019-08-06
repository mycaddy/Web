﻿using System;
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
using Renci.SshNet;
using Renci.SshNet.Sftp;
using Ionic.Zip;
using System.Management;

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
            public const string SFTP_ADDR = "mycaddy.io";
            public const string SFTP_ID = "downloader";
            public const string SFTP_PWD = "ajB5xtXHP&7J";
        }

        // Utils >>>>>>>>>>>>>>>>>>>>>>
        string DOWNLOAD_PATH = "_download";
        FtpClient ftp;
        USBDetector usbDetector;

        // <<<<<<<<<<<<<<<<<<<<<< Utils
        // Check Status >>>>>>>>>>>>>>>>>>>>>>
        private DOWNLOAD_STATUS download_completed;
        private bool device_detected;
        // <<<<<<<<<<<<<<<<<<<<<< Check Status

        private enum DOWNLOAD_STATUS
        {
            ini, start, end
        }

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

        [Obsolete]
        public MainWindow()
        {
            InitializeComponent();
            Initialize();
            DataContext = this;
        }

        [Obsolete]
        private void Initialize()
        {
            

            download_completed = DOWNLOAD_STATUS.ini;
            device_detected = false;

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

            dispatch_usbList();
            // dispatch_DiskList();
            // dispatch_MediaList();

            // dispatch_modelList();
            update_ui();
            dispatch_modelList();
        }


        private void UsbDetector_VolumeChanged(object sender, EventArgs e)
        {
            dispatch_usbList();
            // dispatch_DiskList();
            // dispatch_MediaList();
        }
        
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
            });

            if (usbList.Count > 0)
            {
                device_detected = true;
                // FOR TEST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                download_completed = DOWNLOAD_STATUS.end;
                // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  FOR TEST
            }
            else
            {
                device_detected = false;
            }

            update_ui();

        }

        private void update_ui()
        {   
            // Check Mycaddy device 
            string sDetectString = device_detected ? "Device founded" : "Device not founded";
            Application.Current.Dispatcher.Invoke(() =>
            {
                prgbDownload.Value = 0;
                btnDownload.IsEnabled = (download_completed != DOWNLOAD_STATUS.start) ? true : false;

                cbxDeviceEnable.IsEnabled = device_detected;
                cbxDeviceEnable.IsChecked = device_detected;
                cbxDeviceEnable.Content = sDetectString;
                if (download_completed == DOWNLOAD_STATUS.end && device_detected)
                {
                    btnUpgrade.IsEnabled = true;
                }
                else
                {
                    btnUpgrade.IsEnabled = false;
                }               

            });            
        }

        #region dispatch Disk, Media List
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
        #endregion

        [Obsolete]
        private void BtnDownload_Click(object sender, RoutedEventArgs e)
        {
            load_manual();
            // https://www.meziantou.net/performance-string-concatenation-vs-string-format-vs-interpolated-string.htm

            Task.Run(() =>
            {
                download_sftp("./mycaddy/WT_V8.zip", $"{DOWNLOAD_PATH}/WT_V8.zip");
            });
        }

        #region download with FTP > incompleted
        private void download_ftp()
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

            // Error handling
            
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

        private void check_button_status()
        {

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
        #endregion

        #region Download with SFTP
        private void download_sftp(string remote_path, string local_path)
        {
            // https://stackoverflow.com/questions/43555982/displaying-progress-of-file-upload-in-a-progressbar-with-ssh-net
            // https://stackoverflow.com/questions/44442714/displaying-progress-of-file-download-in-a-progressbar-with-ssh-net

            download_completed = DOWNLOAD_STATUS.start;
            update_ui();

            SftpClient sftp = new SftpClient(Constants.SFTP_ADDR, Constants.SFTP_ID, Constants.SFTP_PWD);

            try
            {
                using (var stream = new FileStream(local_path, FileMode.Create))
                using (sftp)
                {
                    if (!sftp.IsConnected)
                    {
                        sftp.Connect();
                    }
                    SftpFileAttributes attributes = sftp.GetAttributes(remote_path);

                    // Set progress bar maximum on foreground thread
                    Application.Current.Dispatcher.Invoke(() => {
                        var file_size = ByteSize.FromBytes((double)attributes.Size);

                        prgbDownload.Value = 0;
                        prgbDownload.Maximum = (int)file_size.Bytes;
                        prgbDownloadText.Text = string.Format("{0} / {1:F1} MB", 0, file_size.MegaBytes);

                    });
                    sftp.DownloadFile(remote_path, stream, download_sftp_progress);
                    extract_zipfile(local_path);

                    download_completed = DOWNLOAD_STATUS.end;
                    update_ui();
                }
            }
            catch (Exception e)
            {
                download_completed = DOWNLOAD_STATUS.ini;
                update_ui();
                MessageBox.Show(e.Message);
            }

            sftp.Dispose();
        }
        private void download_sftp_progress(ulong downloaded)
        {
            // Update progress bar on foreground thread
            Application.Current.Dispatcher.Invoke(() => {
                var downloaded_size = ByteSize.FromBytes((double)downloaded);
                var download_size = ByteSize.FromBytes(prgbDownload.Maximum);
                prgbDownload.Value = (int)downloaded_size.Bytes;
                prgbDownloadText.Text = string.Format("{0:F1} / {1:F1} MB", downloaded_size.MegaBytes, download_size.MegaBytes);
            });
        }
        #endregion

        #region Extract zip file
        private void extract_zipfile(string local_path)
        {
            using (ZipFile zip = ZipFile.Read(local_path))
            {
               
                zip.ExtractProgress += extract_zipfile_progress;
                
                zip.ExtractAll(local_path.Replace(".zip",""), ExtractExistingFileAction.OverwriteSilently);
            };
        }
        
        private void extract_zipfile_progress(object sender, ExtractProgressEventArgs e)
        {
            Console.WriteLine(e.EventType);

            Application.Current.Dispatcher.Invoke(() => {
                int total = e.EntriesTotal;
                int treated = e.EntriesExtracted;
                switch(e.EventType)
                {
                    case ZipProgressEventType.Extracting_BeforeExtractAll:
                        prgbDownload.Value = 0;
                        break;
                    case ZipProgressEventType.Extracting_AfterExtractEntry:
                        prgbDownload.Maximum = total;
                        prgbDownload.Value = treated;
                        prgbDownloadText.Text = "Extracting..." + string.Format("{0:N0} / {1:N0}", treated, total);
                        break;
                    case ZipProgressEventType.Extracting_AfterExtractAll:
                        prgbDownloadText.Text = "Completed";
                        break;
                    default:
                        break;
                }
               
            });
        }
        #endregion

        [Obsolete]
        private void load_manual()
        {
            load_manual("");
        }
        [Obsolete]
        private void load_manual(string path)
        {
            wvc.NavigateToLocal("/_download/manual/WT_S.ko.html");
            /*
             * 
            string path = $@"{DOWNLOAD_PATH}\ko.html";
            
            // wvc.Navigate(new Uri("file:///"+path));
            // wvc.Navigate();
            

            Uri url = wvc.BuildLocalStreamUri("MyTag", "/Minesweeper/default.html");
            StreamUriWinRTResolver myResolver = new StreamUriWinRTResolver();

            // Pass the resolver object to the navigate call.
            webView4.NavigateToLocalStreamUri(url, myResolver);
            */

        }

        private void dispatch_modelList()
        {
            // read JSON directly from a file
            // string path = Directory.GetCurrentDirectory();
            string configPath = $@"{DOWNLOAD_PATH}\models.json";

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

        private void ListBoxItem_Selected(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void CbbModels_Selected(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("selected!");
        }

        private void BtnUpgrade_Click(object sender, RoutedEventArgs e)
        {
            if (lstDevice.Items.Count > 0)
            {

                // MYCADDY Device only one can be detected
                lstDevice.SelectAll();

                USBDeviceInfo item = (USBDeviceInfo)lstDevice.SelectedItems[0];

                Task.Run(() =>
                {
                    format_device(item.DiskName);
                });

            }
            else
            {
                MessageBox.Show("No device!");
            }

        }

        private void format_device(string drive_letter)
        {
            Application.Current.Dispatcher.Invoke(() => {
                prgbUpgradeText.Text = string.Format("Formatting...");
                prgbUpgrade.Maximum = 100;
                prgbUpgrade.Value = 0;
            });


            DriveManager dm = new DriveManager();
            dm.FormatUSBProgress += Dm_FormatUSBProgress;
            dm.FormatUSBCompleted += Dm_FormatUSBCompleted;
            dm.FormatUSB(drive_letter);

        }

        private void Dm_FormatUSBProgress(object sender, FormatUSBProgressEventArgs e)
        {
            Application.Current.Dispatcher.Invoke(() => {
                prgbUpgrade.Value = e.current;
                prgbUpgradeText.Text = string.Format("Formatting... {0}%", e.current);
            });
        }

        private void Dm_FormatUSBCompleted(object sender, EventArgs e)
        {
            Application.Current.Dispatcher.Invoke(() => {
                prgbUpgradeText.Text = "Format completed!";
            });
        }
    }
}
