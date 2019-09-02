using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace mycaddy_i18n
{
    public sealed class LanguageResources : INotifyPropertyChanged
    {
        #region Singleton instance
        private static volatile LanguageResources instance;
        private static object syncRoot = new Object();
        private string DOWNLOAD_PATH;

        private LanguageResources()
        {
            DOWNLOAD_PATH = $@"{Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)}\mycaddy\_download";
            LoadResource();
        }
        ~LanguageResources()
        {
            if (ResourceDictionary != null)
            {
                ResourceDictionary.Clear();
                ResourceDictionary = null;
            }

            if (NotifyPropertyChangedDictoionary != null)
            {
                NotifyPropertyChangedDictoionary.Clear();
                NotifyPropertyChangedDictoionary = null;
            }
        }

        public static LanguageResources Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                        {
                            instance = new LanguageResources();
                        }
                    }
                }

                return instance;
            }
        }
        #endregion

        #region LoadResource
        private void LoadResource()
        {
            try
            {
                string lanFilePath = $@"{DOWNLOAD_PATH}\config\language.{CultureName}.json";

                // List<dynamic> list = JsonConvert.DeserializeObject<List<dynamic>>(File.ReadAllText(lanFilePath));

                if (ResourceDictionary != null)
                {
                    ResourceDictionary.Clear();
                    ResourceDictionary = null;
                }
                var list = JsonConvert.DeserializeObject<IEnumerable<KeyValuePair<string, string>>>(File.ReadAllText(lanFilePath));
                ResourceDictionary = list.ToDictionary(x => x.Key, x => x.Value);

                /*    
                string filepath = string.Format(Settings.LANGUAGE_FILE_PATH, CultureName);

                if (DesignerProperties.GetIsInDesignMode(new DependencyObject()) == false)
                {
                    fileStream = File.ReadAllText(filepath);
                }
                else
                {
                    fileStream = File.ReadAllText(Settings.TARGET_PROJECT_NAME + Settings.OUTPUT_PATH + filepath);
                }

                DataContractJsonSerializer dcjs = new DataContractJsonSerializer(typeof(Dictionary<string, string>));
                byte[] fileByte = Encoding.UTF8.GetBytes(fileStream);
                MemoryStream ms = new MemoryStream(fileByte);

                if (ResourceDictionary != null)
                {
                    ResourceDictionary.Clear();
                    ResourceDictionary = null;
                }
                ResourceDictionary = dcjs.ReadObject(ms) as Dictionary<string, string>;
                */
            }
            catch
            {
                Debug.Assert(false);
            }
        }
        #endregion

        #region ResourceDictionary
        private Dictionary<string, string> _resourceDictionary;
        public Dictionary<string, string> ResourceDictionary
        {
            set
            {
                _resourceDictionary = value;
                if (_resourceDictionary != null && PropertyChanged != null)
                {
                    // Set property name "Binding.IndexerName" for PropertyChanged event
                    PropertyChanged(this, new PropertyChangedEventArgs("Item[]"));
                    // call PropertyChanged in registered viewmodels implement INotifyPropertyChanged interface
                    foreach (var item in NotifyPropertyChangedDictoionary)
                    {
                        if (item.Key != null && item.Value != null)
                        {
                            foreach (string propertyname in item.Value)
                            {
                                PropertyChanged(item.Key, new PropertyChangedEventArgs(propertyname));
                            }
                        }
                    }
                }
            }
            get
            {
                return _resourceDictionary;
            }
        }
        #endregion

        #region Indexer
        public string this[string key]
        {
            get
            {
                string value = key == null ? "" : key;

                if (ResourceDictionary != null && ResourceDictionary.ContainsKey(key) == true)
                {
                    value = ResourceDictionary[key];
                }
                else
                {
                    value = string.Format(Settings.RESOURCE_NOT_FOUND_MESSAGE, key);
                }
                return value;
            }
        }
        #endregion

        #region CultureName
        /// <summary>
        /// To load resources, set CultureName. Default is "ko-KR"
        /// </summary>
        public string CultureName
        {
            get
            {
                return _CultureName;
            }
            set
            {
                CultureInfo ci = CultureInfo.GetCultures(CultureTypes.AllCultures).FirstOrDefault(f => f.Name == value);
                if (ci != null)
                {
                    _CultureName = value;
                    LoadResource();
                }
            }
        }
        //private string _CultureName = Thread.CurrentThread.CurrentCulture.Name;
        private string _CultureName = "ko-KR";
        #endregion

        #region NotifyPropertyChangedDictoionary
        private Dictionary<INotifyPropertyChanged, string[]> _NotifyPropertyChangedDictoionary = null;
        private Dictionary<INotifyPropertyChanged, string[]> NotifyPropertyChangedDictoionary
        {
            get
            {
                if (_NotifyPropertyChangedDictoionary == null)
                {
                    _NotifyPropertyChangedDictoionary = new Dictionary<INotifyPropertyChanged, string[]>();
                }
                return _NotifyPropertyChangedDictoionary;
            }
            set
            {
                _NotifyPropertyChangedDictoionary = value;
            }
        }
        #endregion

        #region SetRegisterNotifyPropertyChanged
        public void SetRegisterNotifyPropertyChanged(INotifyPropertyChanged sender, params string[] propertynames)
        {
            if (NotifyPropertyChangedDictoionary != null)
            {
                NotifyPropertyChangedDictoionary.Add(sender, propertynames);
            }
        }
        #endregion

        #region INotifyPropertyChanged, PropertyChanged
        public event PropertyChangedEventHandler PropertyChanged;
        #endregion
    }
}