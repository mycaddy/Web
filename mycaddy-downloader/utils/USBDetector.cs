using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Management;
using System.IO;
using System.Diagnostics;

namespace mycaddy_downloader.utils
{
    class USBDetector : IDisposable
    {
        public List<DriveInfo> DriveInfos { get; set; }
        public int UsbDriveCount { get; set; }
        private ManagementEventWatcher _watcher;

        public USBDetector()
        {
            _watcher = new ManagementEventWatcher();
            var query = new WqlEventQuery("SELECT * FROM Win32_VolumeChangeEvent");
            _watcher.EventArrived += watcher_EventArrived;
            _watcher.Query = query;

        }
        public void StartWatching()
        {
            _watcher.Start();
        }

        public void StopWatching()
        {
            _watcher.Stop();
        }

        private void watcher_EventArrived(object sender, EventArrivedEventArgs e)
        {
            Debug.WriteLine(e.NewEvent);
            
        }

        private void dispatch_DriveInfos()
        {
            var usbDrives = UsbDriveListProvider.GetAllRemovableDrives();


            Application.Current.Dispatcher.Invoke(() =>
            {
                DriveInfos.Clear();

                foreach (var usbDrive in usbDrives)
                {
                    DriveInfos.Add(usbDrive);
                }
                UsbDriveCount = DriveInfos.Count;
                RaisePropertyChanged("UsbDriveCount");
                RaisePropertyChanged("DriveInfos");
            });

        }

        public void Dispose()
        {
            if (_watcher != null)
            {
                _watcher.Stop();
                _watcher.EventArrived -= watcher_EventArrived;
            }
        }
    }

    public static class UsbDriveListProvider
    {
        public static IEnumerable<DriveInfo> GetAllRemovableDrives()
        {
            var driveInfos = DriveInfo.GetDrives().AsEnumerable();
            driveInfos = driveInfos.Where(drive => drive.DriveType == DriveType.Removable);
            return driveInfos;
        }
    }
}
