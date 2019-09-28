using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Threading;
using System.ComponentModel;

using FluentFTP;
using System.Net;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Interop;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using mycaddy_downloader.utils;
using System.Collections.ObjectModel;
using Renci.SshNet;
using Renci.SshNet.Sftp;
using Ionic.Zip;
using System.Globalization;
using System.Diagnostics;

using CefSharp;
using CefSharp.Wpf;
using CefSharp.SchemeHandler;
using System.Reflection;
using System.Windows.Media;
using mycaddy_i18n;

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
        string DOWNLOAD_PATH;
        FtpClient ftp;
        USBDetector usbDetector;
        ChromiumWebBrowser webBrowser;

        // <<<<<<<<<<<<<<<<<<<<<< Utils
        // Check Status >>>>>>>>>>>>>>>>>>>>>>
        private DOWNLOAD_STATUS download_status;
        private UPGRADE_STATUS upgrade_status;
        private bool device_detected;
        private int upgrade_total;
        private int upgrade_count;
        // <<<<<<<<<<<<<<<<<<<<<< Check Status

        private enum DOWNLOAD_STATUS
        {
            ini, start, end
        }
        private enum UPGRADE_STATUS
        {
            ini, start, end
        }

        public ObservableCollection<USBDeviceInfo> usbList { get; set; }
        public ObservableCollection<DiskDriveInfo> diskList { get; set; }
        public ObservableCollection<MediaInfo> mediaList { get; set; }
        public ObservableCollection<ModelInfo> modelList { get; set; }
        public ObservableCollection<LanguageInfo> languageList { get; set; }

        public MainWindow()
        {
            InitializeComponent();
            Initialize();
            InitializeBrowser();
            DataContext = this;
        }

        private void Initialize()
        {
            AssemblyName assembly = Assembly.GetExecutingAssembly().GetName();
            txtToolBar.Text = "MYCADDY DWONLOADER version:" + assembly.Version.ToString();

            download_status = DOWNLOAD_STATUS.ini;
            device_detected = false;
            upgrade_status = UPGRADE_STATUS.ini;

            // DOWNLOAD_PATH = $@"{Directory.GetCurrentDirectory()}\_download";
            DOWNLOAD_PATH = $@"{Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)}\mycaddy\_download";
            if (!Directory.Exists(DOWNLOAD_PATH))
            {
                Directory.CreateDirectory(DOWNLOAD_PATH);
            }
            // Load default model and manual
            download_config();

            // USB Devices init
            usbDetector = new USBDetector();
            usbDetector.StartWatching();
            usbDetector.VolumeChanged += UsbDetector_VolumeChanged;
            usbList = new ObservableCollection<USBDeviceInfo>();
            dispatch_usbList();

            // Model List
            modelList = new ObservableCollection<ModelInfo>();
            dispatch_modelList();

            // Language List
            languageList = new ObservableCollection<LanguageInfo>();

            update_ui();
            
        }

        private void InitializeBrowser()
        {
            // https://stackoverflow.com/questions/52338368/loading-local-html-css-js-files-with-cefsharp-v65
            CefSettings settins = new CefSharp.Wpf.CefSettings();
            settins.RegisterScheme(new CefCustomScheme
            {
                SchemeName = "localfolder",
                SchemeHandlerFactory = new FolderSchemeHandlerFactory(
                    rootFolder: $@"{DOWNLOAD_PATH}\manual",
                    hostName: "mycaddy.manual"
                )
            });
            Cef.Initialize(settins);

            string man_default = $"localfolder://mycaddy.manual/Default.{LanguageResources.Instance.CultureName.Substring(0, 2)}.html";
            webBrowser = new ChromiumWebBrowser(man_default);
            webBrowser.Height = panWebBrowser.Height;
            panWebBrowser.Children.Add(webBrowser);

        }

        private void UsbDetector_VolumeChanged(object sender, EventArgs e)
        {
            dispatch_usbList();
        }

        private void download_config()
        {
            SftpClient sftp = new SftpClient(Constants.SFTP_ADDR, Constants.SFTP_ID, Constants.SFTP_PWD);

            try
            {
                sftp.Connect();
                download_directory_sftp(sftp, "./mycaddy/manual", $"{DOWNLOAD_PATH}/manual");
                download_directory_sftp(sftp, "./mycaddy/config", $"{DOWNLOAD_PATH}/config");
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }

            sftp.Dispose();
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
                // download_status = DOWNLOAD_STATUS.end;
                // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  FOR TEST
            }
            else
            {
                device_detected = false;
            }

            update_ui();

        }

        private void dispatch_modelList()
        {
            try
            {
                modelList.Clear();

                // read JSON directly from a file
                // string path = Directory.GetCurrentDirectory();
                string configPath = $@"{DOWNLOAD_PATH}\config\models.json";

                // JObject o1 = JObject.Parse(File.ReadAllText(configPath));

                List<dynamic> list = JsonConvert.DeserializeObject<List<dynamic>>(File.ReadAllText(configPath));

                foreach (dynamic item in list)
                {
                    // Debug.WriteLine(item);
                    ModelInfo info = new ModelInfo();
                    info.name = item.name;
                    info.id = item.id;

                    Dictionary<string, string> zips = new Dictionary<string, string>();
                    foreach (JObject content in item.zip.Children<JObject>())
                    {
                        foreach (JProperty prop in content.Properties())
                        {
                            // Debug.WriteLine(prop.Name + ' ' + content[prop.Name].ToString());
                            zips.Add(prop.Name, content[prop.Name].ToString());
                        }
                    }
                    Dictionary<string, string> paths = new Dictionary<string, string>();
                    foreach (JObject content in item.paths.Children<JObject>())
                    {
                        foreach (JProperty prop in content.Properties())
                        {
                            // Debug.WriteLine(prop.Name + ' ' + content[prop.Name].ToString());
                            paths.Add(prop.Name, content[prop.Name].ToString());
                        }
                    }

                    info.zip = zips;
                    info.paths = paths;
                    info.size = item.size;
                    modelList.Add(info);
                }
            }
            catch(Exception e)
            {
                MessageBox.Show(e.Message);
            }

        }

        private void dispatch_languageList(ModelInfo model)
        {
            languageList.Clear();

            if (model != null)
            {
                foreach (var lan in model.zip)
                {
                    LanguageInfo info = new LanguageInfo();
                    info.id = lan.Key;
                    info.file = lan.Value;

                    if (info.id == "ALL")
                    {
                        info.name = "ALL";
                    }
                    else
                    {
                        try
                        {
                            CultureInfo lang = new CultureInfo(info.id);
                            info.name = lang.DisplayName;
                        }
                        catch (ArgumentException argEx)
                        {
                            Debug.WriteLine(argEx.Message);
                            info.name = "Error ISO_3166-1_alpha-2";
                        }
                    }
                    languageList.Add(info);
                }

            }

        }

        private void CbbModels_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            download_status = DOWNLOAD_STATUS.ini;
            update_ui();

            ModelInfo item = (ModelInfo)(sender as ComboBox).SelectedItem;

            if (item != null)
            {
                dispatch_languageList(item);

                load_manual($"{item.id}.{LanguageResources.Instance.CultureName.Substring(0, 2)}.html");
            }

        }
        private void CbbLanguage_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            download_status = DOWNLOAD_STATUS.ini;
            update_ui();
        }
        private void update_ui()
        {   
            // Check Mycaddy device 
            string sDetectString = device_detected ? LanguageResources.Instance.ResourceDictionary["DeviceFounded"] : LanguageResources.Instance.ResourceDictionary["NoDevice"];
            Application.Current.Dispatcher.Invoke(() =>
            {
                switch(download_status)
                {
                    case DOWNLOAD_STATUS.ini:
                        prgbDownloadText.Text = "";
                        btnDownload.IsEnabled = true;
                        prgbDownload.Value = 0;
                        cbbModels.IsEnabled = true;
                        cbbLanguage.IsEnabled = true;
                        break;
                    case DOWNLOAD_STATUS.start:
                        btnDownload.IsEnabled = false;
                        cbbModels.IsEnabled = false;
                        cbbLanguage.IsEnabled = false;
                        break;
                    default:
                        btnDownload.IsEnabled = true;
                        cbbModels.IsEnabled = true;
                        cbbLanguage.IsEnabled = true;
                        break;
                }

                if (upgrade_status == UPGRADE_STATUS.start)
                {
                    btnDownload.IsEnabled = false;
                }
                else
                {
                    btnDownload.IsEnabled = true;
                }


                cbxDeviceEnable.IsEnabled = device_detected;
                cbxDeviceEnable.IsChecked = device_detected;
                cbxDeviceEnable.Content = sDetectString;
                // cbxAutoUpgrade.IsChecked = device_detected;
                // cbxUpgradeFormat.IsEnabled = device_detected;

                if (download_status == DOWNLOAD_STATUS.end && device_detected == true && upgrade_status != UPGRADE_STATUS.start)
                {
                    btnUpgrade.IsEnabled = true;
                }
                else
                {
                    btnUpgrade.IsEnabled = false;
                }
                
                if(device_detected == false)
                {
                    prgbUpgrade.Value = 0;
                    prgbUpgradeText.Text = "";
                }


            });            
        }

        private void BtnDownload_Click(object sender, RoutedEventArgs e)
        {

            string download_file = "";
            
            if (cbbLanguage.SelectedItem != null)
            {
                LanguageInfo item = (LanguageInfo)cbbLanguage.SelectedItem;
                download_file = item.file;
            }

            if (download_file != "")
            {
                download_process(download_file);
            }
            else
            {
                MessageBox.Show("Select Language");
            }
        }

        private async void download_process(string download_file)
        {
            bool auto_upgrade = cbxAutoUpgrade.IsChecked ?? true;
            var download_task = Task.Run(() =>
            {
                // https://www.meziantou.net/performance-string-concatenation-vs-string-format-vs-interpolated-string.htm
                download_sftp($"./mycaddy/{download_file}", $@"{DOWNLOAD_PATH}/{download_file}");
            });
            await download_task;
            if (auto_upgrade)
            {
                upgrade_process();
            }

        }

        #region dispatch Disk, Media List > No used
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

        #region download_ftp(): download with FTP > incompleted
        private void download_ftp()
        {
            prgbDownload.Value = 0;
            btnDownload.IsEnabled = false;

            // FTP Init
            ftp = new FtpClient(Constants.FTP_ADDR);
            ftp.Credentials = new NetworkCredential(Constants.FTP_ID, Constants.FTP_PWD);

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

        private void Worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            //btnDownload.IsEnabled = true;
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

        #region download_sftp(): Download with SFTP
        private void download_sftp(string remote_path, string local_path)
        {
            // https://stackoverflow.com/questions/43555982/displaying-progress-of-file-upload-in-a-progressbar-with-ssh-net
            // https://stackoverflow.com/questions/44442714/displaying-progress-of-file-download-in-a-progressbar-with-ssh-net

            download_status = DOWNLOAD_STATUS.start;
            update_ui();

            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();


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

                    download_status = DOWNLOAD_STATUS.end;
                    update_ui();
                }
            }
            catch (Exception e)
            {
                download_status = DOWNLOAD_STATUS.ini;
                update_ui();
                MessageBox.Show(e.Message);
            }

            stopWatch.Stop();
            TimeSpan ts = stopWatch.Elapsed;
            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}", ts.Hours, ts.Minutes, ts.Seconds, ts.Milliseconds / 10);

            if (download_status == DOWNLOAD_STATUS.end)
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    prgbDownloadText.Text += "(" + elapsedTime + ")";
                });
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

        private void download_directory_sftp(SftpClient client, string source, string destination)
        {

            if (!Directory.Exists(destination))
            {
                Directory.CreateDirectory(destination);
            }

            var files = client.ListDirectory(source);
            foreach (var file in files)
            {
                if (!file.IsDirectory && !file.IsSymbolicLink)
                {
                    download_file_sftp(client, file, destination);
                }
                else if (file.IsSymbolicLink)
                {
                    // Debug.WriteLine("Ignoring symbolic link {0}", file.FullName);
                }
                else if (file.Name != "." && file.Name != "..")
                {
                    var dir = Directory.CreateDirectory(System.IO.Path.Combine(destination, file.Name));
                    download_directory_sftp(client, file.FullName, dir.FullName);
                }
            }
        }

        private static void download_file_sftp(SftpClient client, SftpFile file, string directory)
        {
            using (Stream fileStream = File.OpenWrite(System.IO.Path.Combine(directory, file.Name)))
            {
                client.DownloadFile(file.FullName, fileStream);
            }
        }
        #endregion

        #region extract_zipfile(): Extract zip file
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
            // Debug.WriteLine(e.EventType);

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

        private void BtnUpgrade_Click(object sender, RoutedEventArgs e)
        {
            upgrade_process();

        }

        #region format_device(): Format Disk Drive
        private bool format_device(string drive_letter, string model_id)
        {
            bool bReturn = false;
            string err_message = "";

            Application.Current.Dispatcher.Invoke(() => {
                prgbFormat.Visibility = Visibility.Visible;
                prgbUpgradeText.Text = string.Format("Formatting...      ");
                prgbUpgrade.Maximum = 100;
                prgbUpgrade.Value = 0;
            });

            try
            {
                DriveManager dm = new DriveManager();
                // bReturn = dm.FormatDrive(char.Parse(drive_letter.Replace(":","")));

                dm.FormatUSBProgress += Dm_FormatUSBProgress;
                dm.FormatUSBCompleted += Dm_FormatUSBCompleted;
                if (model_id == "WT_V8")
                {
                    bReturn = dm.FormatUSB(drive_letter, "FAT32", false, 2048, model_id);
                }
                else
                {
                    bReturn = dm.FormatUSB(drive_letter, "FAT", false, 2048, model_id);
                }

            }
            catch (FormatException e)
            {
                err_message = e.Message;
                
            }
            catch (IOException e)
            {
                err_message = e.Message;
            }
            catch (Exception e)
            {
                err_message = e.Message;
            }

            if (err_message != "")
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    prgbFormat.Visibility = Visibility.Hidden;
                    prgbUpgradeText.Text = err_message;
                    prgbUpgrade.Maximum = 100;
                    prgbUpgrade.Value = 0;
                });
            }

            return bReturn;

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
                prgbFormat.Visibility = Visibility.Hidden;
                prgbUpgrade.Value = prgbUpgrade.Maximum;
                prgbUpgradeText.Text = "Format completed!";
            });
        }
        #endregion

        private void upgrade_process()
        {
            if (lstDevice.Items.Count == 1)
            {
                lstDevice.SelectAll();
            }

            if (lstDevice.SelectedItem != null)
            {
                if (cbbModels.SelectedItem != null && cbbLanguage.SelectedItem != null)
                {
                    upgrade_task();
                }
                else
                {
                    MessageBox.Show("Select Model and Langauge");
                }    
            }
            else
            {
                MessageBox.Show("Select device!");
            }
        }

        private async void upgrade_task()
        {
            ModelInfo model = (ModelInfo)cbbModels.SelectedItem;
            LanguageInfo lan = (LanguageInfo)cbbLanguage.SelectedItem;

            load_manual($"{model.id}.{LanguageResources.Instance.CultureName.Substring(0, 2)}.html");

            try
            {
                Stopwatch stopWatch = new Stopwatch();
                stopWatch.Start();

                upgrade_status = UPGRADE_STATUS.start;
                update_ui();

                USBDeviceInfo item = (USBDeviceInfo)lstDevice.SelectedItems[0];
                bool bFormat = false;
                if (cbxUpgradeFormat.IsChecked == true)
                {
                    await Task.Run(() => {
                       bFormat = format_device(item.DiskName, model.id);
                    });
                }

                // Check Drive size
                DriveInfo drive_info = new DriveInfo(item.DiskName);
                if (model.size != drive_info.TotalSize)
                {
                    Application.Current.Dispatcher.Invoke(() => {
                        prgbUpgrade.Value = 0;
                        prgbUpgradeText.Foreground = Brushes.Red;
                        prgbUpgradeText.Text = "Upgrade Fail: Invalid disk drive size! retry Format";
                    });
                }


                await Task.Run(() => {
                    upgrade_device(item.DiskName, model, lan);
                });

                /*
                MessageBoxResult messageBoxResult = MessageBox.Show("Upgrade completed, do you want to safely eject your device?", "Remove device confirmation", System.Windows.MessageBoxButton.YesNo);
                if (messageBoxResult == MessageBoxResult.Yes)
                {
                    bool remove_safe = RemoveDriveTools.RemoveDrive(item.DiskName);
                    if (remove_safe)
                    {
                        MessageBox.Show("You can also disconnect the connected device.");
                        // dispatch_usbList();   
                    }
                }
                */
                if (stopWatch.IsRunning)
                {
                    stopWatch.Stop();
                }
                TimeSpan ts = stopWatch.Elapsed;
                string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}", ts.Hours, ts.Minutes, ts.Seconds, ts.Milliseconds / 10);

                Application.Current.Dispatcher.Invoke(() => {
                    prgbUpgrade.Value = upgrade_count;
                    prgbUpgradeText.Text = $"Completed({elapsedTime})";
                    load_manual($"{model.id}.{LanguageResources.Instance.CultureName.Substring(0, 2)}.complete.html");
                });

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                Application.Current.Dispatcher.Invoke(() => {
                    prgbUpgrade.Value = 0;
                    prgbUpgradeText.Foreground = Brushes.Red;
                    prgbUpgradeText.Text = "Upgrade Fail:" + e.Message;
                });

            }
            finally
            {
                upgrade_status = UPGRADE_STATUS.end;
                update_ui();

            }

        }

        private void upgrade_device(string disk_name, ModelInfo model, LanguageInfo lan)
        {
         
            try
            {
                /*
                Stopwatch stopWatch = new Stopwatch();
                stopWatch.Start();
                */

                string source_dir = $@"{DOWNLOAD_PATH}\{Path.GetFileNameWithoutExtension(lan.file)}";
                DirectoryInfo source_total = new DirectoryInfo(source_dir);
                upgrade_total = source_total.GetFiles("*.*", SearchOption.AllDirectories).Length;
                upgrade_count = 0;

                Application.Current.Dispatcher.Invoke(() => {
                    prgbUpgradeText.ClearValue(TextBlock.ForegroundProperty);
                    prgbUpgrade.Maximum = upgrade_total;
                    prgbUpgrade.Value = 0;
                    prgbUpgradeText.Text = string.Format("transfer... {0:N0} / {1:N0}", 0, upgrade_total);
                });

                foreach (var item in model.paths)
                {
                    string source_path = $@"{source_dir}{item.Key.Replace("/", @"\")}";
                    string target_path = $@"{disk_name}{item.Value.Replace("/", @"\")}";
                    directory_copy(source_path, target_path, true);
                }

                /*
                stopWatch.Stop();
                TimeSpan ts = stopWatch.Elapsed;
                string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}", ts.Hours, ts.Minutes, ts.Seconds, ts.Milliseconds / 10);

                Application.Current.Dispatcher.Invoke(() => {
                    prgbUpgrade.Value = upgrade_count;
                    prgbUpgradeText.Text = $"Completed({elapsedTime})";
                    load_manual($"{model.id}.ko.complete.html");
                });
                */
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
                Application.Current.Dispatcher.Invoke(() => {
                    prgbUpgradeText.Text = e.Message;
                });
                throw new Exception(e.Message);
            }


        }
        
        private void directory_copy(string source_path, string target_path, bool copy_sub)
        {
            try
            {
                // Get the subdirectories for the specified directory.
                DirectoryInfo dir = new DirectoryInfo(source_path);
                FileAttributes attr = File.GetAttributes(source_path);

                if (attr.HasFlag(FileAttributes.Directory))
                {

                    if (!dir.Exists)
                    {
                        throw new DirectoryNotFoundException(
                            "Source directory does not exist or could not be found: "
                            + source_path);
                    }

                    DirectoryInfo[] dirs = dir.GetDirectories();
                    // If the destination directory doesn't exist, create it.
                    if (!Directory.Exists(target_path))
                    {
                        Directory.CreateDirectory(target_path);
                    }

                    // Get the files in the directory and copy them to the new location.
                    FileInfo[] files = dir.GetFiles();
                    foreach (FileInfo file in files)
                    {
                        string temppath = Path.Combine(target_path, file.Name);
                        file.CopyTo(temppath, true);
                        upgrade_count += 1;
                        Application.Current.Dispatcher.Invoke(() => {
                            prgbUpgrade.Value = upgrade_count;
                            prgbUpgradeText.Text = string.Format("{0:N0} / {1:N0}", upgrade_count, upgrade_total);
                        });

                    }

                    // If copying subdirectories, copy them and their contents to new location.
                    if (copy_sub)
                    {
                        foreach (DirectoryInfo subdir in dirs)
                        {
                            string temppath = Path.Combine(target_path, subdir.Name);
                            directory_copy(subdir.FullName, temppath, copy_sub);
                        }
                    }
                }
                else
                {
                    FileInfo file = new FileInfo(source_path);
                    file.CopyTo(target_path, true);
                    upgrade_count += 1;
                    Application.Current.Dispatcher.Invoke(() => {
                        prgbUpgrade.Value = upgrade_count;
                        prgbUpgradeText.Text = string.Format("{0:N0} / {1:N0}", upgrade_count, upgrade_total);
                    });
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
                throw new Exception(e.Message);
            }

        }

        #region Load manual with Webview

        private void load_manual(string file_name)
        {
            webBrowser.Load($"localfolder://mycaddy.manual/{file_name}");
        }
        #endregion

        private void MenuPopupButton_OnClick(object sender, RoutedEventArgs e)
        {
            string menu_text = ((Button)sender).Content.ToString();
            if (menu_text == "Close")
            {
                Application.Current.Shutdown();
            }
            else {
                string language_code;
                switch (menu_text) {
                    case "English":
                        language_code = "en-US";
                        break;
                    case "Chinese":
                        language_code = "zh-CN";
                        break;
                    case "Japanese":
                        language_code = "ja-JP";
                        break;
                    default:
                        language_code = "ko-KR";
                        break;
                }
                LanguageResources.Instance.CultureName = language_code;
                cbbLanguage.SelectedIndex = -1;
                cbbModels.SelectedIndex = -1;
                load_manual($"Default.{LanguageResources.Instance.CultureName.Substring(0, 2)}.html");

            }
            
        }

    }

    public class ModelInfo
    {
        public string name { get; set; }
        public string id { get; set; }
        public Dictionary<string, string> zip { get; set; }
        public Dictionary<string, string> paths { get; set; }
        public long size { get; set; }
    }

    public class LanguageInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public string file { get; set; }
    }

}
