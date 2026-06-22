using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace MoviePosterScreensaver
{
    public class SettingsForm : Form
    {
        private CheckedListBox checkedListBox;
        private Button btnSave;
        private Button btnCancel;
        private Label lblTitle;
        private Label lblDescription;
        private Label lblSpeed;
        private TrackBar trackBarSpeed;
        private Label lblSpeedLabels;

        public SettingsForm()
        {
            InitializeComponent();
            LoadSettings();
        }

        private void InitializeComponent()
        {
            this.Text = "Movie Poster Screensaver Settings";
            this.Size = new Size(350, 560);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.White;

            lblTitle = new Label();
            lblTitle.Text = "Movie Genres";
            lblTitle.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            lblTitle.Location = new Point(15, 15);
            lblTitle.AutoSize = true;

            lblDescription = new Label();
            lblDescription.Text = "Select the genres of movie posters you want to see. The screensaver will fetch beautiful high-res movie posters for these genres.";
            lblDescription.Location = new Point(15, 45);
            lblDescription.Size = new Size(300, 40);
            lblDescription.Font = new Font("Segoe UI", 9);

            checkedListBox = new CheckedListBox();
            checkedListBox.Location = new Point(15, 90);
            checkedListBox.Size = new Size(300, 220);
            checkedListBox.CheckOnClick = true;
            checkedListBox.Font = new Font("Segoe UI", 10);
            
            // Populate genres
            foreach (var genre in SettingsManager.AllGenres)
            {
                checkedListBox.Items.Add(genre);
            }

            lblSpeed = new Label();
            lblSpeed.Text = "Poster Flip Frequency";
            lblSpeed.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            lblSpeed.Location = new Point(15, 325);
            lblSpeed.AutoSize = true;

            trackBarSpeed = new TrackBar();
            trackBarSpeed.Location = new Point(15, 350);
            trackBarSpeed.Size = new Size(300, 45);
            trackBarSpeed.Minimum = 1;
            trackBarSpeed.Maximum = 5;
            trackBarSpeed.Value = 3;
            trackBarSpeed.TickStyle = TickStyle.BottomRight;
            trackBarSpeed.TickFrequency = 1;

            lblSpeedLabels = new Label();
            lblSpeedLabels.Text = "1 (Slowest)     2     3 (Normal)     4     5 (Fastest)";
            lblSpeedLabels.Font = new Font("Segoe UI", 8);
            lblSpeedLabels.Location = new Point(20, 395);
            lblSpeedLabels.Size = new Size(300, 20);
            lblSpeedLabels.ForeColor = Color.Gray;

            btnSave = new Button();
            btnSave.Text = "Save";
            btnSave.Location = new Point(140, 470);
            btnSave.Size = new Size(80, 30);
            btnSave.Font = new Font("Segoe UI", 9);
            btnSave.Click += BtnSave_Click;

            btnCancel = new Button();
            btnCancel.Text = "Cancel";
            btnCancel.Location = new Point(230, 470);
            btnCancel.Size = new Size(80, 30);
            btnCancel.Font = new Font("Segoe UI", 9);
            btnCancel.Click += BtnCancel_Click;

            this.Controls.Add(lblTitle);
            this.Controls.Add(lblDescription);
            this.Controls.Add(checkedListBox);
            this.Controls.Add(lblSpeed);
            this.Controls.Add(trackBarSpeed);
            this.Controls.Add(lblSpeedLabels);
            this.Controls.Add(btnSave);
            this.Controls.Add(btnCancel);
            
            this.AcceptButton = btnSave;
            this.CancelButton = btnCancel;
        }

        private void LoadSettings()
        {
            List<string> savedGenres = SettingsManager.LoadGenres();
            
            for (int i = 0; i < checkedListBox.Items.Count; i++)
            {
                string genre = checkedListBox.Items[i].ToString();
                if (savedGenres.Contains(genre))
                {
                    checkedListBox.SetItemChecked(i, true);
                }
            }

            int speed = SettingsManager.LoadFlipSpeed();
            trackBarSpeed.Value = speed;
        }

        private void BtnSave_Click(object sender, EventArgs e)
        {
            List<string> selectedGenres = new List<string>();
            foreach (var item in checkedListBox.CheckedItems)
            {
                selectedGenres.Add(item.ToString());
            }

            if (selectedGenres.Count == 0)
            {
                MessageBox.Show("Please select at least one genre.", "Settings", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            SettingsManager.SaveGenres(selectedGenres);
            SettingsManager.SaveFlipSpeed(trackBarSpeed.Value);
            this.Close();
        }

        private void BtnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
