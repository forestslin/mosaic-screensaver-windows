using Microsoft.Win32;
using System.Collections.Generic;

namespace MosaicScreensaver
{
    public static class SettingsManager
    {
        private const string RegistryKeyPath = @"Software\MosaicScreensaver";
        private const string GenresValueName = "SelectedGenres";
        private const string MovieGenresValueName = "SelectedMovieGenres";
        private const string FlipSpeedValueName = "FlipSpeed";
        private const string DisplayModeValueName = "DisplayMode";
        private const string AnimationTypeValueName = "AnimationType";
        private const string BookLanguageValueName = "BookLanguage";

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

        // A comprehensive list of movie genres
        public static readonly string[] AllMovieGenres = new string[]
        {
            "Action", "Adventure", "Animation", "Biography", "Chinese", "Comedy", "Crime",
            "Documentary", "Drama", "Family", "Fantasy", "History", "Horror",
            "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport",
            "Superhero", "Thriller", "War", "Western"
        };

        // Default to a diverse mix of movie genres
        public static readonly string[] DefaultMovieGenres = new string[]
        {
            "Action", "Comedy", "Sci-Fi", "Chinese", "Adventure"
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

        public static List<string> LoadMovieGenres()
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        string value = key.GetValue(MovieGenresValueName) as string;
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

            return new List<string>(DefaultMovieGenres);
        }

        public static void SaveMovieGenres(List<string> genres)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        key.SetValue(MovieGenresValueName, string.Join(",", genres));
                    }
                }
            }
            catch
            {
                // Ignore registry errors
            }
        }

        public static int LoadDisplayMode()
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        object value = key.GetValue(DisplayModeValueName);
                        if (value != null && int.TryParse(value.ToString(), out int mode))
                        {
                            if (mode >= 0 && mode <= 4)
                            {
                                return mode;
                            }
                        }
                    }
                }
            }
            catch
            {
                // Ignore registry errors
            }
            return 2; // Default to Mixed mode (2)
        }

        public static void SaveDisplayMode(int mode)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        key.SetValue(DisplayModeValueName, mode);
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

        public static int LoadAnimationType()
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        object value = key.GetValue(AnimationTypeValueName);
                        if (value != null && int.TryParse(value.ToString(), out int mode))
                        {
                            if (mode >= 0 && mode <= 1)
                            {
                                return mode;
                            }
                        }
                    }
                }
            }
            catch { }
            return 0; // Default to Flip (0). 1 = Flow
        }

        public static void SaveAnimationType(int mode)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        key.SetValue(AnimationTypeValueName, mode);
                    }
                }
            }
            catch { }
        }

        public static int LoadBookLanguage()
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        object value = key.GetValue(BookLanguageValueName);
                        if (value != null && int.TryParse(value.ToString(), out int mode))
                        {
                            if (mode >= 0 && mode <= 1)
                            {
                                return mode;
                            }
                        }
                    }
                }
            }
            catch { }
            return 0; // Default to Chinese Only (0). 1 = Chinese & Western
        }

        public static void SaveBookLanguage(int mode)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(RegistryKeyPath))
                {
                    if (key != null)
                    {
                        key.SetValue(BookLanguageValueName, mode);
                    }
                }
            }
            catch { }
        }
    }
}
