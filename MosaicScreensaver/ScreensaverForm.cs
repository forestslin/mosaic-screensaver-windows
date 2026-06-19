using System;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace MosaicScreensaver
{
    public partial class ScreensaverForm : Form
    {
        [DllImport("user32.dll")]
        static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);

        [DllImport("user32.dll")]
        static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll", SetLastError = true)]
        static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        static extern bool GetClientRect(IntPtr hWnd, out Rectangle lpRect);

        private Point mouseLocation;
        private bool previewMode = false;
        private WebView2 webView;

        public ScreensaverForm(Rectangle bounds)
        {
            InitializeComponent();
            InitScreensaver();
            this.Bounds = bounds;
        }

        public ScreensaverForm(IntPtr PreviewWndHandle)
        {
            InitializeComponent();
            previewMode = true;

            // Set the preview window as the parent of this window
            SetParent(this.Handle, PreviewWndHandle);

            // Make this a child window so it will close when the parent dialog closes
            SetWindowLong(this.Handle, -16, new IntPtr(GetWindowLong(this.Handle, -16) | 0x40000000).ToInt32());

            // Place our window inside the parent
            Rectangle ParentRect;
            GetClientRect(PreviewWndHandle, out ParentRect);
            Size = ParentRect.Size;
            Location = new Point(0, 0);

            InitScreensaver();
        }

        private void InitScreensaver()
        {
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.Manual;
            this.BackColor = Color.Black;

            if (!previewMode)
            {
                this.TopMost = true;
                Cursor.Hide();
            }

            // Initialize WebView2
            webView = new WebView2();
            webView.Dock = DockStyle.Fill;
            this.Controls.Add(webView);
            InitializeAsync();
        }

        async void InitializeAsync()
        {
            try
            {
                string userDataFolder = Path.Combine(Path.GetTempPath(), "MosaicScreensaver_WebView2_" + System.Diagnostics.Process.GetCurrentProcess().Id);
                var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
                await webView.EnsureCoreWebView2Async(env);
                
                string appDir = AppDomain.CurrentDomain.BaseDirectory;
                string htmlPath = Path.Combine(appDir, "web", "index.html");
                if (File.Exists(htmlPath))
                {
                    webView.Source = new Uri(htmlPath);
                }
            }
            catch (Exception ex)
            {
                // Prevent unhandled exception dialog
                Label errorLabel = new Label();
                errorLabel.Text = "WebView2 Init Error";
                errorLabel.ForeColor = Color.White;
                errorLabel.AutoSize = true;
                this.Controls.Add(errorLabel);
                errorLabel.BringToFront();
            }
        }

        private void ScreensaverForm_Load(object sender, EventArgs e)
        {
            if (!previewMode)
            {
                mouseLocation = Cursor.Position;
                
                // Hook up events to exit
                this.MouseMove += new MouseEventHandler(ScreensaverForm_MouseMove);
                this.MouseClick += new MouseEventHandler(ScreensaverForm_MouseClick);
                this.KeyDown += new KeyEventHandler(ScreensaverForm_KeyDown);

                // Need to also capture events if WebView2 eats them. 
                // A robust way in WinForms is a global hook or a timer checking mouse pos,
                // but let's use a simple timer for cursor movement if WebView takes focus.
                System.Windows.Forms.Timer exitTimer = new System.Windows.Forms.Timer();
                exitTimer.Interval = 100;
                exitTimer.Tick += (s, args) =>
                {
                    if (Cursor.Position != mouseLocation)
                    {
                        Application.Exit();
                    }
                };
                exitTimer.Start();
            }
        }

        private void ScreensaverForm_MouseMove(object sender, MouseEventArgs e)
        {
            if (!previewMode)
            {
                if (Math.Abs(mouseLocation.X - Cursor.Position.X) > 5 ||
                    Math.Abs(mouseLocation.Y - Cursor.Position.Y) > 5)
                {
                    Application.Exit();
                }
            }
        }

        private void ScreensaverForm_MouseClick(object sender, MouseEventArgs e)
        {
            if (!previewMode)
                Application.Exit();
        }

        private void ScreensaverForm_KeyDown(object sender, KeyEventArgs e)
        {
            if (!previewMode)
                Application.Exit();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            // 
            // ScreensaverForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Name = "ScreensaverForm";
            this.Text = "MosaicScreensaver";
            this.Load += new System.EventHandler(this.ScreensaverForm_Load);
            this.ResumeLayout(false);
        }
    }
}
