using Microsoft.Win32;
using System.Collections.Generic;

namespace MoviePosterScreensaver
{
    public static class SettingsManager
    {
        private const string RegistryKeyPath = @"Software\MoviePosterScreensaver";
        private const string GenresValueName = "SelectedGenres";
        private const string FlipSpeedValueName = "FlipSpeed";

        // A comprehensive list of movie genres
        public static readonly List<string> AllGenres = new List<string>
        {
            "Action", "Adventure", "Animation", "Biography", "Chinese", "Comedy", "Crime",
            "Documentary", "Drama", "Family", "Fantasy", "History", "Horror",
            "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport",
            "Superhero", "Thriller", "War", "Western"
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

        public static int LoadFlipSpeed()
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        object value = key.GetValue(FlipSpeedValueName);
                        if (value != null && int.TryParse(value.ToString(), out int speed))
                        {
                            if (speed >= 1 && speed <= 5)
                            {
                                return speed;
                            }
                        }
                    }
                }
            }
            catch
            {
                // Ignore registry errors
            }
            return 3; // Default speed
        }

        public static void SaveFlipSpeed(int speed)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        key.SetValue(FlipSpeedValueName, speed);
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
