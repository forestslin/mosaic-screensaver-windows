using Microsoft.Win32;
using System.Collections.Generic;

namespace MosaicScreensaver
{
    public static class SettingsManager
    {
        private const string RegistryKeyPath = @"Software\MosaicScreensaver";
        private const string GenresValueName = "SelectedGenres";

        // A comprehensive list of music genres
        public static readonly string[] AllGenres = new string[]
        {
            "Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Rap", "Electronic", "Dance",
            "R&B", "Soul", "Country", "Alternative", "Indie", "Blues", "Reggae", 
            "K-Pop", "J-Pop", "Latin", "Metal", "Folk", "Punk", "Acoustic",
            "Soundtrack", "Gospel", "New Age", "World", "Vocal", "Easy Listening"
        };

        // Default to a diverse mix if nothing is selected
        public static readonly string[] DefaultGenres = new string[]
        {
            "Pop", "Rock", "Jazz", "Hip-Hop", "Classical", "Electronic"
        };

        public static List<string> LoadGenres()
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        string value = key.GetValue(GenresValueName) as string;
                        if (!string.IsNullOrEmpty(value))
                        {
                            return new List<string>(value.Split(','));
                        }
                    }
                }
            }
            catch
            {
                // Ignore registry errors and fallback
            }

            return new List<string>(DefaultGenres);
        }

        public static void SaveGenres(List<string> genres)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        key.SetValue(GenresValueName, string.Join(",", genres));
                    }
                }
            }
            catch
            {
                // Ignore registry errors
            }
        }
    }
}
