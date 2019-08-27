using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Management;
using System.IO;
using System.Diagnostics;
using Usb.Net;

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
            OnVolumeChanged(EventArgs.Empty);            
        }
        protected virtual void OnVolumeChanged(EventArgs e)
        {
            EventHandler handler = VolumeChanged;
            if (handler != null)
            {
                handler(this, e);
            }
        }
        public event EventHandler VolumeChanged;


        public List<USBDeviceInfo> GetUSBDeviceList()
        {
            return GetUSBDeviceList(null);
        }
        public List<USBDeviceInfo> GetUSBDeviceList(string device_id)
        {
            List<USBDeviceInfo> devices = new List<USBDeviceInfo>();

            // USB\\VID_03EB&PID_2403\\123123123123

            string sQuery = @"Select * From Win32_USBHub";
            if (!string.IsNullOrWhiteSpace(device_id))
            {
                sQuery += @" WHERE DeviceID LIKE '%"+ device_id + "%'";
            }

            ManagementObjectCollection collection;
            using (var searcher = new ManagementObjectSearcher(sQuery))
                collection = searcher.Get();

            foreach (var device in collection)
            {
                string pnp_device_id = (string)device.GetPropertyValue("PNPDeviceID");
                string disk_name = GetDiskName(pnp_device_id);
                long drive_size = 0;
                try
                {
                    DriveInfo drive = new DriveInfo(disk_name);
                    drive_size = drive.TotalSize;
                }
                catch (Exception e)
                {
                    Debug.WriteLine(e.Message);
                }

                Debug.WriteLine("TotalSize: " + drive_size.ToString());

                devices.Add(new USBDeviceInfo(
                    (string)device.GetPropertyValue("DeviceID"),
                    pnp_device_id,
                    (string)device.GetPropertyValue("Description"),
                    disk_name,
                    drive_size
                ));
            }
            collection.Dispose();

            return devices;
        }
            
        public List<DiskDriveInfo> GetUSBDkiskList()
        {
            List<DiskDriveInfo> devices = new List<DiskDriveInfo>();

            ManagementObjectCollection collection;
            using (var searcher = new ManagementObjectSearcher(@"Select * From Win32_DiskDrive WHERE InterfaceType='USB'"))
                collection = searcher.Get();

            foreach (var device in collection)
            {
                ManagementObject objectQuery = new ManagementObject("Win32_PhysicalMedia.Tag='" + (string)device.GetPropertyValue("DeviceID") + "'");
                string serialNumber =  (objectQuery != null) ? objectQuery["SerialNumber"].ToString() : "";

                Debug.WriteLine(objectQuery["SerialNumber"].ToString());
                devices.Add(new DiskDriveInfo(
                    (string)device.GetPropertyValue("DeviceID"),
                    (string)device.GetPropertyValue("PNPDeviceID"),
                    (string)device.GetPropertyValue("Description"),
                    (string)device.GetPropertyValue("Name"),
                    (string)device.GetPropertyValue("Manufacturer"),
                    serialNumber
                ));
            }
            collection.Dispose();

            return devices;
        }

        public List<MediaInfo> GetMediaList()
        {
            List<MediaInfo> devices = new List<MediaInfo>();

            ManagementObjectCollection collection;
            using (var searcher = new ManagementObjectSearcher(@"Select * From Win32_PhysicalMedia"))
                collection = searcher.Get();

            foreach (var device in collection)
            {
                devices.Add(new MediaInfo(
                    (string)device.GetPropertyValue("Caption"),
                    (string)device.GetPropertyValue("Description"),
                    (string)device.GetPropertyValue("Name"),
                    (string)device.GetPropertyValue("Manufacturer"),
                    (string)device.GetPropertyValue("SerialNumber"),
                    (string)device.GetPropertyValue("Tag"),
                    (string)device.GetPropertyValue("PartNumber")
                ));
            }
            collection.Dispose();

            return devices;
        }


        // https://stackoverflow.com/questions/20143264/find-windows-drive-letter-of-a-removable-disk-from-usb-vid-pid
        // https://codeday.me/ko/qa/20190513/535808.html
        public string GetDiskName(string PnpDeviceID)
        {
            using (Device device = Device.Get(PnpDeviceID))
            {
                // get children devices
                foreach (string childDeviceId in device.ChildrenPnpDeviceIds)
                {
                    // get the drive object that correspond to this id (escape the id)
                    foreach (ManagementObject drive in new ManagementObjectSearcher("SELECT DeviceID FROM Win32_DiskDrive WHERE PNPDeviceID='" + childDeviceId.Replace(@"\", @"\\") + "'").Get())
                    {
                        // associate physical disks with partitions
                        foreach (ManagementObject partition in new ManagementObjectSearcher("ASSOCIATORS OF {Win32_DiskDrive.DeviceID='" + drive["DeviceID"] + "'} WHERE AssocClass=Win32_DiskDriveToDiskPartition").Get())
                        {
                            // associate partitions with logical disks (drive letter volumes)
                            foreach (ManagementObject disk in new ManagementObjectSearcher("ASSOCIATORS OF {Win32_DiskPartition.DeviceID='" + partition["DeviceID"] + "'} WHERE AssocClass=Win32_LogicalDiskToPartition").Get())
                            {
                                return (string)disk["DeviceID"];
                            }
                        }
                    }
                }
            }
             
            return "none";
            
        }

        // refer: https://docs.microsoft.com/ko-kr/dotnet/standard/events/how-to-raise-and-consume-events


        private void dispatch_DriveInfos()
        {
            var usbDrives = UsbDriveListProvider.GetAllRemovableDrives();
            /*
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
            */
        }


        private void dispatch_Devices()
        {
        
            /*
            List<USBDeviceInfo> devices = new List<USBDeviceInfo>();
            ManagementObjectCollection collection;
            using (var searcher = new ManagementObjectSearcher(@"Select * From Win32_USBHub"))
                collection = searcher.Get();

            foreach (var device in collection)
            {
                devices.Add(new USBDeviceInfo(
                    (string)device.GetPropertyValue("DeviceID"),
                    (string)device.GetPropertyValue("PNPDeviceID"),
                    (string)device.GetPropertyValue("Description")
                ));
            }

            
            ManagementObjectSearcher theSearcher = new ManagementObjectSearcher("SELECT * FROM Win32_DiskDrive WHERE InterfaceType='USB'");
            foreach (ManagementObject currentObject in theSearcher.Get())
            {
                Debug.WriteLine(currentObject);
                ManagementObject theSerialNumberObjectQuery = new ManagementObject("Win32_PhysicalMedia.Tag='" + currentObject["DeviceID"] + "'");
                Debug.WriteLine(theSerialNumberObjectQuery["SerialNumber"].ToString());
            }
            */

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

    public class USBDeviceInfo
    {
        public USBDeviceInfo(string deviceID, string pnpDeviceID, string description, string diskName, long totalSize)
        {
            this.DeviceID = deviceID;
            this.PnpDeviceID = pnpDeviceID;
            this.Description = description;
            this.DiskName = diskName;
            this.TotalSize = totalSize;
        }
        public string DeviceID { get; private set; }
        public string PnpDeviceID { get; private set; }
        public string Description { get; private set; }
        public string DiskName { get; private set; }
        public long TotalSize { get; private set; }
    }

    public class DiskDriveInfo
    {
        public DiskDriveInfo(string deviceID, string pnpDeviceID, string description, string name, string manufacturer, string serialNumber)
        {
            this.DeviceID = deviceID;
            this.PnpDeviceID = pnpDeviceID;
            this.Description = description;
            this.Name = name;
            this.Manufacturer = manufacturer;
        }
        public string DeviceID { get; private set; }
        public string PnpDeviceID { get; private set; }
        public string Description { get; private set; }
        public string Name { get; private set; }
        public string Manufacturer { get; private set; }
        public string SerialNumber { get; private set; }
    }

    public class MediaInfo
    {
        public MediaInfo(string caption, string description, string name, string manufacturer, string serial_number, string tag, string part_number)
        {
            this.Caption = caption;
            this.Description = description;
            this.Name = name;
            this.Manufacturer = manufacturer;
            this.SerialNumber = serial_number;
            this.Tag = tag;
            this.PartNumber = part_number;
        }

        public string Caption { get; private set; }
        public string Description { get; private set; }
        public string Name { get; private set; }
        public string Manufacturer { get; private set; }
        public string SerialNumber { get; private set; }
        public string Tag { get; private set; }
        public string PartNumber { get; private set; }
    

    }


}
