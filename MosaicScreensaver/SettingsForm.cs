using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace MosaicScreensaver
{
    public class SettingsForm : Form
    {
        private GroupBox grpDisplayMode;
        private RadioButton rdoMusicOnly;
        private RadioButton rdoMovieOnly;
        private RadioButton rdoMixed;
        private RadioButton rdoBooksOnly;
        private RadioButton rdoAllMixed;

        private GroupBox grpAnimation;
        private RadioButton rdoFlip;
        private RadioButton rdoFlow;

        private GroupBox grpBooks;
        private RadioButton rdoChineseBooks;
        private RadioButton rdoAllBooks;

        private Label lblMusicTitle;
        private CheckedListBox lstMusicGenres;

        private Label lblMovieTitle;
        private CheckedListBox lstMovieGenres;

        private Label lblSpeed;
        private TrackBar trackBarSpeed;
        private Label lblSpeedLabels;

        private Button btnSave;
        private Button btnCancel;

        public SettingsForm()
        {
            InitializeComponent();
            LoadSettings();
            UpdateControlStates();
        }

        private void InitializeComponent()
        {
            this.Text = "Mosaic Screensaver Settings";
            this.ClientSize = new Size(880, 680);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;

            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.White;

            // Display Content Mode Selector
            grpDisplayMode = new GroupBox();
            grpDisplayMode.Text = "Display Content";
            grpDisplayMode.Location = new Point(15, 15);
            grpDisplayMode.Size = new Size(280, 200);
            grpDisplayMode.Font = new Font("Segoe UI", 9, FontStyle.Bold);

            rdoMusicOnly = new RadioButton { Text = "Music Albums only", Location = new Point(15, 25), Size = new Size(250, 30), Font = new Font("Segoe UI", 9) };
            rdoMovieOnly = new RadioButton { Text = "Movie Posters only", Location = new Point(15, 60), Size = new Size(250, 30), Font = new Font("Segoe UI", 9) };
            rdoBooksOnly = new RadioButton { Text = "Book Covers only", Location = new Point(15, 95), Size = new Size(250, 30), Font = new Font("Segoe UI", 9) };
            rdoMixed = new RadioButton { Text = "Mixed (Music & Movie)", Location = new Point(15, 130), Size = new Size(250, 30), Font = new Font("Segoe UI", 9) };
            rdoAllMixed = new RadioButton { Text = "All Mixed (Music, Movie, Books)", Location = new Point(15, 165), Size = new Size(250, 30), Font = new Font("Segoe UI", 9) };
            
            rdoMusicOnly.CheckedChanged += (s, e) => UpdateControlStates();
            rdoMovieOnly.CheckedChanged += (s, e) => UpdateControlStates();
            rdoBooksOnly.CheckedChanged += (s, e) => UpdateControlStates();
            rdoMixed.CheckedChanged += (s, e) => UpdateControlStates();
            rdoAllMixed.CheckedChanged += (s, e) => UpdateControlStates();

            grpDisplayMode.Controls.AddRange(new Control[] { rdoMusicOnly, rdoMovieOnly, rdoBooksOnly, rdoMixed, rdoAllMixed });

            // Animation Effect
            grpAnimation = new GroupBox();
            grpAnimation.Text = "Animation Effect";
            grpAnimation.Location = new Point(310, 15);
            grpAnimation.Size = new Size(280, 100);
            grpAnimation.Font = new Font("Segoe UI", 9, FontStyle.Bold);

            rdoFlip = new RadioButton { Text = "3D Tile Flip", Location = new Point(15, 25), Size = new Size(250, 30), Font = new Font("Segoe UI", 9) };
            rdoFlow = new RadioButton { Text = "Flowing (Left to Right)", Location = new Point(15, 60), Size = new Size(250, 30), Font = new Font("Segoe UI", 9) };
            grpAnimation.Controls.AddRange(new Control[] { rdoFlip, rdoFlow });

            // Books Settings
            grpBooks = new GroupBox();
            grpBooks.Text = "Books Options";
            grpBooks.Location = new Point(605, 15);
            grpBooks.Size = new Size(260, 100);
            grpBooks.Font = new Font("Segoe UI", 9, FontStyle.Bold);

            rdoChineseBooks = new RadioButton { Text = "Chinese Books Only", Location = new Point(15, 25), Size = new Size(240, 30), Font = new Font("Segoe UI", 9) };
            rdoAllBooks = new RadioButton { Text = "Chinese & Western Books", Location = new Point(15, 60), Size = new Size(240, 30), Font = new Font("Segoe UI", 9) };
            grpBooks.Controls.AddRange(new Control[] { rdoChineseBooks, rdoAllBooks });

            // Music Genres List
            lblMusicTitle = new Label { Text = "Music Genres", Font = new Font("Segoe UI", 10, FontStyle.Bold), Location = new Point(15, 230), AutoSize = true };
            lstMusicGenres = new CheckedListBox { Location = new Point(15, 255), Size = new Size(280, 270), CheckOnClick = true, Font = new Font("Segoe UI", 9) };
            foreach (var genre in SettingsManager.AllGenres) lstMusicGenres.Items.Add(genre);

            // Movie Genres List
            lblMovieTitle = new Label { Text = "Movie Genres", Font = new Font("Segoe UI", 10, FontStyle.Bold), Location = new Point(310, 130), AutoSize = true };
            lstMovieGenres = new CheckedListBox { Location = new Point(310, 155), Size = new Size(280, 370), CheckOnClick = true, Font = new Font("Segoe UI", 9) };
            foreach (var genre in SettingsManager.AllMovieGenres) lstMovieGenres.Items.Add(genre);

            // Speed Control
            lblSpeed = new Label { Text = "Animation Speed", Font = new Font("Segoe UI", 10, FontStyle.Bold), Location = new Point(15, 540), AutoSize = true };
            trackBarSpeed = new TrackBar { Location = new Point(15, 565), Size = new Size(575, 45), Minimum = 1, Maximum = 5, Value = 3, TickStyle = TickStyle.BottomRight, TickFrequency = 1 };
            lblSpeedLabels = new Label { Text = "1 (Slowest)                         2                         3 (Normal)                         4                         5 (Fastest)", Font = new Font("Segoe UI", 8), Location = new Point(20, 610), Size = new Size(580, 20), ForeColor = Color.Gray };

            // Buttons
            btnSave = new Button { Text = "Save", Location = new Point(680, 630), Size = new Size(90, 35), Font = new Font("Segoe UI", 9) };
            btnSave.Click += BtnSave_Click;
            btnCancel = new Button { Text = "Cancel", Location = new Point(775, 630), Size = new Size(90, 35), Font = new Font("Segoe UI", 9) };
            btnCancel.Click += BtnCancel_Click;

            this.Controls.Add(grpDisplayMode);
            this.Controls.Add(grpAnimation);
            this.Controls.Add(grpBooks);
            this.Controls.Add(lblMusicTitle);
            this.Controls.Add(lstMusicGenres);
            this.Controls.Add(lblMovieTitle);
            this.Controls.Add(lstMovieGenres);
            this.Controls.Add(lblSpeed);
            this.Controls.Add(trackBarSpeed);
            this.Controls.Add(lblSpeedLabels);
            this.Controls.Add(btnSave);
            this.Controls.Add(btnCancel);
            
            this.AcceptButton = btnSave;
            this.CancelButton = btnCancel;
        }

        private void UpdateControlStates()
        {
            bool needsMusic = rdoMusicOnly.Checked || rdoMixed.Checked || rdoAllMixed.Checked;
            bool needsMovie = rdoMovieOnly.Checked || rdoMixed.Checked || rdoAllMixed.Checked;
            bool needsBooks = rdoBooksOnly.Checked || rdoAllMixed.Checked;

            lstMusicGenres.Enabled = needsMusic;
            lblMusicTitle.ForeColor = needsMusic ? Color.Black : Color.Gray;

            lstMovieGenres.Enabled = needsMovie;
            lblMovieTitle.ForeColor = needsMovie ? Color.Black : Color.Gray;

            grpBooks.Enabled = needsBooks;
        }

        private void LoadSettings()
        {
            int mode = SettingsManager.LoadDisplayMode();
            if (mode == 0) rdoMusicOnly.Checked = true;
            else if (mode == 1) rdoMovieOnly.Checked = true;
            else if (mode == 2) rdoMixed.Checked = true;
            else if (mode == 3) rdoBooksOnly.Checked = true;
            else rdoAllMixed.Checked = true;

            int animType = SettingsManager.LoadAnimationType();
            if (animType == 1) rdoFlow.Checked = true; else rdoFlip.Checked = true;

            int bookLang = SettingsManager.LoadBookLanguage();
            if (bookLang == 1) rdoAllBooks.Checked = true; else rdoChineseBooks.Checked = true;

            List<string> savedGenres = SettingsManager.LoadGenres();
            for (int i = 0; i < lstMusicGenres.Items.Count; i++)
            {
                if (savedGenres.Contains(lstMusicGenres.Items[i].ToString()))
                    lstMusicGenres.SetItemChecked(i, true);
            }

            List<string> savedMovieGenres = SettingsManager.LoadMovieGenres();
            for (int i = 0; i < lstMovieGenres.Items.Count; i++)
            {
                if (savedMovieGenres.Contains(lstMovieGenres.Items[i].ToString()))
                    lstMovieGenres.SetItemChecked(i, true);
            }

            trackBarSpeed.Value = SettingsManager.LoadFlipSpeed();
        }

        private void BtnSave_Click(object sender, EventArgs e)
        {
            List<string> selectedGenres = new List<string>();
            foreach (var item in lstMusicGenres.CheckedItems) selectedGenres.Add(item.ToString());

            List<string> selectedMovieGenres = new List<string>();
            foreach (var item in lstMovieGenres.CheckedItems) selectedMovieGenres.Add(item.ToString());

            bool needsMusic = rdoMusicOnly.Checked || rdoMixed.Checked || rdoAllMixed.Checked;
            bool needsMovie = rdoMovieOnly.Checked || rdoMixed.Checked || rdoAllMixed.Checked;

            if (needsMusic && selectedGenres.Count == 0)
            {
                MessageBox.Show("Please select at least one music genre.", "Settings", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            if (needsMovie && selectedMovieGenres.Count == 0)
            {
                MessageBox.Show("Please select at least one movie genre.", "Settings", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            int mode = 2;
            if (rdoMusicOnly.Checked) mode = 0;
            else if (rdoMovieOnly.Checked) mode = 1;
            else if (rdoMixed.Checked) mode = 2;
            else if (rdoBooksOnly.Checked) mode = 3;
            else if (rdoAllMixed.Checked) mode = 4;

            int animType = rdoFlow.Checked ? 1 : 0;
            int bookLang = rdoAllBooks.Checked ? 1 : 0;

            SettingsManager.SaveDisplayMode(mode);
            SettingsManager.SaveAnimationType(animType);
            SettingsManager.SaveBookLanguage(bookLang);
            SettingsManager.SaveGenres(selectedGenres);
            SettingsManager.SaveMovieGenres(selectedMovieGenres);
            SettingsManager.SaveFlipSpeed(trackBarSpeed.Value);
            
            this.Close();
        }

        private void BtnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
