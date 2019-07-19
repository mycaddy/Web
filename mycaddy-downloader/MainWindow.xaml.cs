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


namespace mycaddy_downloader
{
    /// <summary>
    /// MainWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    /// http://www.csharpstudy.com/Threads/backgroundworker.aspx
    /// 
    public partial class MainWindow : Window
    {
        static class Constants
        {
            public const string FTP_ADDR = "222.236.46.92";
            public const string FTP_ID = "mycaddy";
            public const string FTP_PWD = "rladudtjs";
        }

        public class Model
        {
            public int ID { get; set; }
            public string Name { get; set; }
            public string Path { get; set; }
        }
        public IList<Model> Models
        {
            get { return Models; }
            set { Models = value; }
        }

        FtpClient ftp = new FtpClient(Constants.FTP_ADDR);

        public MainWindow()
        {
            InitializeComponent();
            prgbDownload.Value = 0;
            ftp.Credentials = new NetworkCredential(Constants.FTP_ID, Constants.FTP_PWD);
        }

        private void BtnDownload_Click(object sender, RoutedEventArgs e)
        {
            prgbDownload.Value = 0;
            btnDownload.IsEnabled = false;
                                 
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

        

    }
}
