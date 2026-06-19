namespace MosaicScreensaver;

static class Program
{
    [STAThread]
    static void Main(string[] args)
    {
        ApplicationConfiguration.Initialize();

        if (args.Length > 0)
        {
            string firstArgument = args[0].ToLower().Trim();
            string secondArgument = null;

            // Handle cases where arguments are separated by colon.
            // Examples: /c:1234567 or /P:1234567
            if (firstArgument.Length > 2)
            {
                secondArgument = firstArgument.Substring(3).Trim();
                firstArgument = firstArgument.Substring(0, 2);
            }
            else if (args.Length > 1)
            {
                secondArgument = args[1];
            }

            if (firstArgument == "/c")
            {
                // Configuration mode
                MessageBox.Show("此屏保程序无需额外配置。将会从网络获取最高清的专辑封面。\nThis screensaver requires no configuration. It will fetch high-res album arts from the network.", "Mosaic Screensaver", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else if (firstArgument == "/p")
            {
                // Preview mode
                if (secondArgument == null)
                {
                    MessageBox.Show("Sorry, but the expected window handle was not provided.", "Screensaver", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    return;
                }

                IntPtr previewWndHandle = new IntPtr(long.Parse(secondArgument));
                Application.Run(new ScreensaverForm(previewWndHandle));
            }
            else if (firstArgument == "/s")
            {
                // Full-screen mode
                ShowScreensaver();
                Application.Run();
            }
            else
            {
                // Undefined argument
                MessageBox.Show("Sorry, but the command line argument \"" + firstArgument + "\" is not valid.", "Screensaver", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
            }
        }
        else
        {
            // No arguments - treat like /c
            MessageBox.Show("此屏保程序无需额外配置。将会从网络获取最高清的专辑封面。\nThis screensaver requires no configuration. It will fetch high-res album arts from the network.", "Mosaic Screensaver", MessageBoxButtons.OK, MessageBoxIcon.Information);
            
            // For testing purposes, you can uncomment this to run full screen on double click:
            // ShowScreensaver();
            // Application.Run();
        }
    }

    static void ShowScreensaver()
    {
        foreach (Screen screen in Screen.AllScreens)
        {
            ScreensaverForm screensaver = new ScreensaverForm(screen.Bounds);
            screensaver.Show();
        }
    }
}