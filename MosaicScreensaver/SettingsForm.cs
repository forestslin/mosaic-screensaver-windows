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
            this.ClientSize = new Size(640, 640);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;

            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.White;

            // Display Content Mode Selector
            grpDisplayMode = new GroupBox();
            grpDisplayMode.Text = "Display Content";
            grpDisplayMode.Location = new Point(15, 15);
            grpDisplayMode.Size = new Size(280, 140);
            grpDisplayMode.Font = new Font("Segoe UI", 9, FontStyle.Bold);

            rdoMusicOnly = new RadioButton();
            rdoMusicOnly.Text = "Music Albums only (1:1 Grid)";
            rdoMusicOnly.Location = new Point(15, 25);
            rdoMusicOnly.Size = new Size(250, 30);
            rdoMusicOnly.Font = new Font("Segoe UI", 9, FontStyle.Regular);
            rdoMusicOnly.Checked = true;
            rdoMusicOnly.CheckedChanged += (s, e) => UpdateControlStates();

            rdoMovieOnly = new RadioButton();
            rdoMovieOnly.Text = "Movie Posters only (2:3 Grid)";
            rdoMovieOnly.Location = new Point(15, 60);
            rdoMovieOnly.Size = new Size(250, 30);
            rdoMovieOnly.Font = new Font("Segoe UI", 9, FontStyle.Regular);
            rdoMovieOnly.CheckedChanged += (s, e) => UpdateControlStates();

            rdoMixed = new RadioButton();
            rdoMixed.Text = "Mixed (Alternating Columns)";
            rdoMixed.Location = new Point(15, 95);
            rdoMixed.Size = new Size(250, 30);
            rdoMixed.Font = new Font("Segoe UI", 9, FontStyle.Regular);
            rdoMixed.CheckedChanged += (s, e) => UpdateControlStates();

            grpDisplayMode.Controls.Add(rdoMusicOnly);
            grpDisplayMode.Controls.Add(rdoMovieOnly);
            grpDisplayMode.Controls.Add(rdoMixed);

            // Music Genres List
            lblMusicTitle = new Label();
            lblMusicTitle.Text = "Music Genres";
            lblMusicTitle.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            lblMusicTitle.Location = new Point(15, 175);
            lblMusicTitle.AutoSize = true;

            lstMusicGenres = new CheckedListBox();
            lstMusicGenres.Location = new Point(15, 200);
            lstMusicGenres.Size = new Size(280, 270);
            lstMusicGenres.CheckOnClick = true;
            lstMusicGenres.Font = new Font("Segoe UI", 9);

            foreach (var genre in SettingsManager.AllGenres)
            {
                lstMusicGenres.Items.Add(genre);
            }

            // Movie Genres List
            lblMovieTitle = new Label();
            lblMovieTitle.Text = "Movie Genres";
            lblMovieTitle.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            lblMovieTitle.Location = new Point(325, 15);
            lblMovieTitle.AutoSize = true;

            lstMovieGenres = new CheckedListBox();
            lstMovieGenres.Location = new Point(325, 40);
            lstMovieGenres.Size = new Size(280, 430);
            lstMovieGenres.CheckOnClick = true;
            lstMovieGenres.Font = new Font("Segoe UI", 9);

            foreach (var genre in SettingsManager.AllMovieGenres)
            {
                lstMovieGenres.Items.Add(genre);
            }

            // Speed Control
            lblSpeed = new Label();
            lblSpeed.Text = "Cover / Poster Flip Frequency";
            lblSpeed.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            lblSpeed.Location = new Point(15, 490);
            lblSpeed.AutoSize = true;

            trackBarSpeed = new TrackBar();
            trackBarSpeed.Location = new Point(15, 515);
            trackBarSpeed.Size = new Size(590, 45);
            trackBarSpeed.Minimum = 1;
            trackBarSpeed.Maximum = 5;
            trackBarSpeed.Value = 3;
            trackBarSpeed.TickStyle = TickStyle.BottomRight;
            trackBarSpeed.TickFrequency = 1;

            lblSpeedLabels = new Label();
            lblSpeedLabels.Text = "1 (Slowest)                         2                         3 (Normal)                         4                         5 (Fastest)";
            lblSpeedLabels.Font = new Font("Segoe UI", 8);
            lblSpeedLabels.Location = new Point(20, 560);
            lblSpeedLabels.Size = new Size(580, 20);
            lblSpeedLabels.ForeColor = Color.Gray;

            // Buttons
            btnSave = new Button();
            btnSave.Text = "Save";
            btnSave.Location = new Point(440, 595);
            btnSave.Size = new Size(80, 30);
            btnSave.Font = new Font("Segoe UI", 9);
            btnSave.Click += BtnSave_Click;

            btnCancel = new Button();
            btnCancel.Text = "Cancel";
            btnCancel.Location = new Point(530, 595);
            btnCancel.Size = new Size(80, 30);
            btnCancel.Font = new Font("Segoe UI", 9);
            btnCancel.Click += BtnCancel_Click;

            this.Controls.Add(grpDisplayMode);
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
            if (rdoMusicOnly.Checked)
            {
                lstMusicGenres.Enabled = true;
                lstMovieGenres.Enabled = false;
                lblMusicTitle.ForeColor = Color.Black;
                lblMovieTitle.ForeColor = Color.Gray;
            }
            else if (rdoMovieOnly.Checked)
            {
                lstMusicGenres.Enabled = false;
                lstMovieGenres.Enabled = true;
                lblMusicTitle.ForeColor = Color.Gray;
                lblMovieTitle.ForeColor = Color.Black;
            }
            else // Mixed
            {
                lstMusicGenres.Enabled = true;
                lstMovieGenres.Enabled = true;
                lblMusicTitle.ForeColor = Color.Black;
                lblMovieTitle.ForeColor = Color.Black;
            }
        }

        private void LoadSettings()
        {
            // Load display mode
            int mode = SettingsManager.LoadDisplayMode();
            if (mode == 0) rdoMusicOnly.Checked = true;
            else if (mode == 1) rdoMovieOnly.Checked = true;
            else rdoMixed.Checked = true;

            // Load music genres
            List<string> savedGenres = SettingsManager.LoadGenres();
            for (int i = 0; i < lstMusicGenres.Items.Count; i++)
            {
                string genre = lstMusicGenres.Items[i].ToString();
                if (savedGenres.Contains(genre))
                {
                    lstMusicGenres.SetItemChecked(i, true);
                }
            }

            // Load movie genres
            List<string> savedMovieGenres = SettingsManager.LoadMovieGenres();
            for (int i = 0; i < lstMovieGenres.Items.Count; i++)
            {
                string genre = lstMovieGenres.Items[i].ToString();
                if (savedMovieGenres.Contains(genre))
                {
                    lstMovieGenres.SetItemChecked(i, true);
                }
            }

            // Load flip speed
            int speed = SettingsManager.LoadFlipSpeed();
            trackBarSpeed.Value = speed;
        }

        private void BtnSave_Click(object sender, EventArgs e)
        {
            List<string> selectedGenres = new List<string>();
            foreach (var item in lstMusicGenres.CheckedItems)
            {
                selectedGenres.Add(item.ToString());
            }

            List<string> selectedMovieGenres = new List<string>();
            foreach (var item in lstMovieGenres.CheckedItems)
            {
                selectedMovieGenres.Add(item.ToString());
            }

            // Validation
            if (rdoMusicOnly.Checked && selectedGenres.Count == 0)
            {
                MessageBox.Show("Please select at least one music genre.", "Settings", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            if (rdoMovieOnly.Checked && selectedMovieGenres.Count == 0)
            {
                MessageBox.Show("Please select at least one movie genre.", "Settings", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            if (rdoMixed.Checked && (selectedGenres.Count == 0 || selectedMovieGenres.Count == 0))
            {
                MessageBox.Show("Please select at least one music genre and one movie genre for Mixed mode.", "Settings", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            // Save display mode
            int mode = 0;
            if (rdoMusicOnly.Checked) mode = 0;
            else if (rdoMovieOnly.Checked) mode = 1;
            else mode = 2;

            SettingsManager.SaveDisplayMode(mode);
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
