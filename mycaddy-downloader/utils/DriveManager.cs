﻿using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Runtime.InteropServices;
using System.Text;

namespace mycaddy_downloader.utils
{
    public class DriveManager
    {
        #region SetLabel

        /// <summary>
        /// set a drive label to the desired value
        /// </summary>
        /// <param name="driveLetter">drive letter. Example : 'A', 'B', 'C', 'D', ..., 'Z'.</param>
        /// <param name="label">label for the drive</param>
        /// <returns>true if success, false if failure</returns>
        public static bool SetLabel(char driveLetter, string label = "")
        {
            #region args check

            if (!Char.IsLetter(driveLetter))
            {
                return false;
            }
            if (label == null)
            {
                label = "";
            }

            #endregion
            try
            {
                DriveInfo di = DriveInfo.GetDrives()
                                        .Where(d => d.Name.StartsWith(driveLetter.ToString()))
                                        .FirstOrDefault();
                di.VolumeLabel = label;
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        #endregion

        #region FormatDrive

        /// <summary>
        /// Format a drive using the best available method
        /// </summary>
        /// <param name="driveLetter">drive letter. Example : 'A', 'B', 'C', 'D', ..., 'Z'.</param>
        /// <param name="label">label for the drive</param>
        /// <param name="fileSystem">file system. Possible values : "FAT", "FAT32", "EXFAT", "NTFS", "UDF".</param>
        /// <param name="quickFormat">quick formatting?</param>
        /// <param name="enableCompression">enable drive compression?</param>
        /// <param name="clusterSize">cluster size (default=null for auto). Possible value depends on the file system : 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, ...</param>
        /// <returns>true if success, false if failure</returns>
        public bool FormatDrive(char driveLetter, string label = "", string fileSystem = "FAT", bool quickFormat = false, bool enableCompression = false, int? clusterSize = 2048)
        {
            return FormatDrive_CommandLine(driveLetter, label, fileSystem, quickFormat, enableCompression, clusterSize);
        }

        #endregion

        #region FormatDrive_CommandLine

        /// <summary>
        /// Format a drive using Format.com windows file
        /// </summary>
        /// <param name="driveLetter">drive letter. Example : 'A', 'B', 'C', 'D', ..., 'Z'.</param>
        /// <param name="label">label for the drive</param>
        /// <param name="fileSystem">file system. Possible values : "FAT", "FAT32", "EXFAT", "NTFS", "UDF".</param>
        /// <param name="quickFormat">quick formatting?</param>
        /// <param name="enableCompression">enable drive compression?</param>
        /// <param name="clusterSize">cluster size (default=null for auto). Possible value depends on the file system : 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, ...</param>
        /// <returns>true if success, false if failure</returns>
        public bool FormatDrive_CommandLine(char driveLetter, string label = "", string fileSystem = "FAT", bool quickFormat = false, bool enableCompression = false, int? clusterSize = 2048)
        {
            #region args check

            if (!Char.IsLetter(driveLetter) ||
                !IsFileSystemValid(fileSystem))
            {
                return false;
            }

            #endregion
            bool success = false;
            string drive = driveLetter + ":";
            try
            {
                var di = new DriveInfo(drive);
                var psi = new ProcessStartInfo();
                psi.FileName = "format.com";
                psi.WorkingDirectory = Environment.SystemDirectory;
                psi.Arguments = "/FS:" + fileSystem +
                                             " /Y" +
                                             " /V:" + label +
                                             (quickFormat ? " /Q" : "") +
                                             ((fileSystem == "NTFS" && enableCompression) ? " /C" : "") +
                                             (clusterSize.HasValue ? " /A:" + clusterSize.Value : "") +
                                             " " + drive;
                psi.UseShellExecute = false;
                psi.CreateNoWindow = true;
                psi.RedirectStandardOutput = true;
                psi.RedirectStandardInput = true;
                var formatProcess = Process.Start(psi);
                var swStandardInput = formatProcess.StandardInput;
                swStandardInput.WriteLine();
                formatProcess.WaitForExit();
                success = true;
            }
            catch (Exception) { }
            return success;
        }

        #endregion

        #region FormatDrive_Shell32

        #region interop

        // http://msdn.microsoft.com/en-us/library/windows/desktop/bb762169(v=vs.85).aspx
        [DllImport("shell32.dll")]
        private static extern uint SHFormatDrive(IntPtr hwnd, uint drive, SHFormatFlags fmtID, SHFormatOptions options);

        private enum SHFormatFlags : uint
        {
            SHFMT_ID_DEFAULT = 0xFFFF,
            /// <summary>
            /// A general error occured while formatting. This is not an indication that the drive cannot be formatted though.
            /// </summary>
            SHFMT_ERROR = 0xFFFFFFFF,
            /// <summary>
            /// The drive format was cancelled by user/OS.
            /// </summary>
            SHFMT_CANCEL = 0xFFFFFFFE,
            /// <summary>
            /// A serious error occured while formatting. The drive is unable to be formatted by the OS.
            /// </summary>
            SHFMT_NOFORMAT = 0xFFFFFFD
        }

        [Flags]
        private enum SHFormatOptions : uint
        {
            /// <summary>
            /// Full formatting
            /// </summary>
            SHFMT_OPT_COMPLETE = 0x0,
            /// <summary>
            /// Quick Format
            /// </summary>
            SHFMT_OPT_FULL = 0x1,
            /// <summary>
            /// MS-DOS System Boot Disk
            /// </summary>
            SHFMT_OPT_SYSONLY = 0x2
        }

        #endregion

        /// <summary>
        /// Format a drive using Shell32.dll
        /// </summary>
        /// <param name="driveLetter">drive letter. Example : 'A', 'B', 'C', 'D', ..., 'Z'.</param>
        /// <param name="label">label for the drive</param>
        /// <param name="quickFormat">quick formatting?</param>
        /// <returns>true if success, false if failure</returns>
        [Obsolete("Unsupported by Microsoft nowadays. Prefer the FormatDrive() or FormatDrive_CommandLine() methods")]
        public static bool FormatDrive_Shell32(char driveLetter, string label = "", bool quickFormat = true)
        {
            #region args check

            if (!Char.IsLetter(driveLetter))
            {
                return false;
            }

            #endregion
            bool success = false;
            string drive = driveLetter + ":";
            try
            {
                var di = new DriveInfo(drive);
                var bytes = Encoding.ASCII.GetBytes(di.Name.ToCharArray());
                uint driveNumber = Convert.ToUInt32(bytes[0] - Encoding.ASCII.GetBytes(new[] { 'A' })[0]);
                var options = SHFormatOptions.SHFMT_OPT_COMPLETE;
                if (quickFormat)
                    options = SHFormatOptions.SHFMT_OPT_FULL;

                uint returnCode = SHFormatDrive(IntPtr.Zero, driveNumber, SHFormatFlags.SHFMT_ID_DEFAULT, options);
                if (returnCode == (uint)SHFormatFlags.SHFMT_ERROR)
                    throw new Exception("An error occurred during the format. This does not indicate that the drive is unformattable.");
                else if (returnCode == (uint)SHFormatFlags.SHFMT_CANCEL)
                    throw new OperationCanceledException("The format was canceled.");
                else if (returnCode == (uint)SHFormatFlags.SHFMT_NOFORMAT)
                    throw new IOException("The drive cannot be formatted.");

                SetLabel(driveLetter, label);
                success = true;
            }
            catch (Exception) { }
            return success;
        }

        #endregion

        #region FormatDrive_Win32Api

        // http://msdn.microsoft.com/en-us/library/aa394515(VS.85).aspx

        /// <summary>
        /// Format a drive using Win32 API
        /// </summary>
        /// <param name="driveLetter">drive letter. Example : 'A', 'B', 'C', 'D', ..., 'Z'.</param>
        /// <param name="label">label for the drive</param>
        /// <param name="fileSystem">file system. Possible values : "FAT", "FAT32", "EXFAT", "NTFS", "UDF".</param>
        /// <param name="quickFormat">quick formatting?</param>
        /// <param name="enableCompression">enable drive compression?</param>
        /// <param name="clusterSize">cluster size. Possible value depends on the file system : 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, ...</param>
        /// <returns>true if success, false if failure</returns>
        [Obsolete("Might have troubles formatting ram drives. Prefer the FormatDrive() or FormatDrive_CommandLine() methods")]
        public static bool FormatDrive_Win32Api(char driveLetter, string label = "", string fileSystem = "FAT", bool quickFormat = false, bool enableCompression = false, int clusterSize = 8192)
        {
            #region args check

            if (!Char.IsLetter(driveLetter) ||
                !IsFileSystemValid(fileSystem))
            {
                return false;
            }

            #endregion
            // clusterSize = 8192
            bool success = false;
            try
            {
                var moSearcher = new ManagementObjectSearcher(@"SELECT * FROM Win32_Volume WHERE DriveLetter='" + driveLetter + ":'");
                foreach (ManagementObject mo in moSearcher.Get())
                {
                    mo.InvokeMethod("Format", new object[] { fileSystem, quickFormat, clusterSize, label, enableCompression });
                    success = true;
                }
            }
            catch (Exception)
            {
                success = false;
            }
            return success;
        }

        #endregion

        #region IsFileSystemValid

        /// <summary>
        /// test if the provided filesystem value is valid
        /// </summary>
        /// <param name="fileSystem">file system. Possible values : "FAT", "FAT32", "EXFAT", "NTFS", "UDF".</param>
        /// <returns>true if valid, false if invalid</returns>
        public static bool IsFileSystemValid(string fileSystem)
        {
            #region args check

            if (fileSystem == null)
            {
                return false;
            }

            #endregion
            switch (fileSystem)
            {
                case "FAT":
                case "FAT32":
                case "EXFAT":
                case "NTFS":
                case "UDF":
                    return true;
                default:
                    return false;
            }
        }

        #endregion



        public bool FormatUSB(string driveLetter, string fileSystem = "FAT", bool quickFormat = false, int clusterSize = 2048, string label = "", bool enableCompression = false)
        {
            //add logic to format Usb drive
            //verify conditions for the letter format: driveLetter[0] must be letter. driveLetter[1] must be ":" and all the characters mustn't be more than 2
            if (driveLetter.Length != 2 || driveLetter[1] != ':' || !char.IsLetter(driveLetter[0]))
                return false;
            DirectoryInfo di = new DirectoryInfo(driveLetter);
            foreach (FileInfo file in di.EnumerateFiles())
            {
                try {
                    file.Delete();
                }
                catch (UnauthorizedAccessException e)
                {
                    if (e.Source != null)
                    {
                        Debug.WriteLine("UnauthorizedAccessException:" + e.Message);
                        throw;
                    }

                }
                catch (IOException e)
                {
                    if (e.Source != null)
                    {
                        Debug.WriteLine("IOExeption: " + e.Message);
                        throw;
                    }
                }
            }
            foreach (DirectoryInfo dir in di.EnumerateDirectories())
            {
                try
                {
                    dir.Delete(true);
                }
                catch (UnauthorizedAccessException e)
                {
                    if (e.Source != null)
                    {
                        Debug.WriteLine("UnauthorizedAccessException:" + e.Message);
                        throw;
                    }
                }
                catch (IOException e)
                {
                    if (e.Source != null)
                    {
                        Debug.WriteLine("IOExeption: " + e.Message);
                        throw;
                    }
                }
            }

            ManagementObjectSearcher searcher = new ManagementObjectSearcher(@"select * from Win32_Volume WHERE DriveLetter = '" + driveLetter + "'");
            foreach (ManagementObject vi in searcher.Get())
            {
                try
                {
                    var completed = false;
                    var watcher = new ManagementOperationObserver();

                    watcher.Completed += (sender, args) =>
                    {
                        Debug.WriteLine("USB format completed " + args.Status);
                        completed = true;
                        OnFormatUSBCompleted(EventArgs.Empty);
                    };
                    watcher.Progress += (sender, args) =>
                    {
                        Debug.WriteLine("USB format in progress " + args.Current);

                        FormatUSBProgressEventArgs eventArgs = new FormatUSBProgressEventArgs();
                        eventArgs.current = args.Current;
                        OnFormatUSBProgress(eventArgs);
                    };

                    vi.InvokeMethod(watcher, "Format", new object[] { fileSystem, quickFormat, clusterSize, label, enableCompression });

                    while (!completed) { System.Threading.Thread.Sleep(1000); }


                }
                catch(Exception e)
                {
                    if (e.Source != null)
                    {
                        Debug.WriteLine(e.Message);
                        throw;
                    }
                }
            }
            return true;
        }

        public event EventHandler<FormatUSBProgressEventArgs> FormatUSBProgress;
        protected virtual void OnFormatUSBProgress(FormatUSBProgressEventArgs e)
        {
            EventHandler<FormatUSBProgressEventArgs> handler = FormatUSBProgress;
            if (handler != null)
            {
                handler(this, e);
            }
        }

        public event EventHandler FormatUSBCompleted;
        protected virtual void OnFormatUSBCompleted(EventArgs e)
        {
            EventHandler handler = FormatUSBCompleted;
            if (handler != null)
            {
                handler(this, e);
            }
        }


    }
    public class FormatUSBProgressEventArgs : EventArgs
    {
        public int current;
    }

}
