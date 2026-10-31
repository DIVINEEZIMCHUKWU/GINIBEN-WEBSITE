# GINIBEN & PARTNERS GEOSERVICES LTD
## Complete Truehost cPanel, MySQL & Email Integration Guide

**Production Domain:** `https://ginibengeoservices.com/`

---

### Why Data Appeared on Phone but Not Laptop (Root Cause Explained)

1. **Local Storage vs. MySQL Database**:
   - The consultation form handler previously saved submissions to the browser's local device memory (`localStorage`).
   - When you booked the consultation on your smartphone, it saved to your phone's browser cache. When you opened the Admin Dashboard on your phone, it read from your phone's local cache.
   - When you opened your laptop, the laptop's cache did not have it, and because the database endpoint had schema mismatches, it had not been written to Truehost MySQL.
2. **The 24 vs. 104 Images Mystery**:
   - The original `database.sql` seed script only contained 24 sample entries.
   - We have generated a comprehensive `database.sql` file containing all **104 verified fieldwork images**, all **14 project videos**, all **6 team member profiles**, and all **company settings**.
3. **Database Schema & Table Mismatches**:
   - The tables in `database.sql` and the PHP API endpoints (`enquiries.php`, `images.php`, `videos.php`, `team.php`, `settings.php`) now have matching columns (`id`, `reference_number`, `full_name`, `company`, `email`, `phone`, `service_of_interest`, `project_location`, `subject`, `message`, `status`, etc.).
   - All endpoints now have **self-healing table creation** (`CREATE TABLE IF NOT EXISTS ...`), so if a table is ever missing, the PHP script creates it on demand.

---

### Step 1: Import the Complete `database.sql` in cPanel (phpMyAdmin)

1. Log into your **Truehost cPanel**.
2. Under **Databases**, open **phpMyAdmin**.
3. Click your database name in the left sidebar (e.g. `yourcpaneluser_geoservices`).
4. Click the **Import** tab at the top.
5. Click **Choose File** and select the `/database.sql` (or `dist/database.sql`) from this project.
6. Click **Import** at the bottom.
7. Confirm that all tables are populated:
   - `gallery_images` &rarr; Contains **all 104 fieldwork images**
   - `project_videos` &rarr; Contains **all 14 field videos**
   - `team_members` &rarr; Contains **all 6 personnel profiles**
   - `enquiries` &rarr; Ready to receive consultation bookings
   - `company_settings` &rarr; Stores master password `Giniben123` & company coordinates
   - `administrators` &rarr; Admin credentials

---

### Step 2: Configure Database Credentials in `public_html/api/config.php`

In **cPanel File Manager**, open `public_html/api/config.php` and set your actual MySQL database credentials created in cPanel MySQL Database Wizard:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'xjtqwpkd_ginibeng_geoservices'); // Your Truehost cPanel database name
define('DB_USER', 'xjtqwpkd_ginibeng_dbuser');      // Your Truehost cPanel database user
define('DB_PASS', 'YourActualCpanelPassword!');     // Your database password created in cPanel
define('DB_CHARSET', 'utf8mb4');
```

Save the file.

---

### Step 3: How Consultation Enquiries & Email Alerts Work

The email destinations are configured in the live `.env` file, not in this guide or the compiled frontend. Create or update `/home/CPANEL_USER/.env` (outside `public_html`) with these notification settings:

```env
ADMIN_NOTIFICATION_EMAIL="info@ginibengeoservices.com"
ADMIN_FORWARD_EMAIL_1="benukwuteyinor@yahoomail.com"
ADMIN_FORWARD_EMAIL_2="gpgl.geoservices@gmail.com"
```

The same values are shown in the repository's `.env.example`. The `public/api/config.php` API loader reads the live `.env`, and `public/api/enquiries.php` uses these settings for notification delivery. Do not upload `.env.example` as the live `.env`; keep the live file private and retain the correct MySQL credentials there.

When a client books a consultation or submits an inquiry on the website:
1. **Database Capture**:
   - The inquiry is written to the `enquiries` MySQL database table on Truehost with a unique reference number (e.g., `GB-2026-4821`).
2. **Email Alerts to 3 Addresses**:
   - Professionally formatted HTML notification emails are queued for:
     - `info@ginibengeoservices.com`
     - `benukwuteyinor@yahoomail.com`
     - `gpgl.geoservices@gmail.com`
   - If the hosting server rejects a message, the API attempts its FormSubmit relay. The submission response and server error log indicate when delivery could not be queued.
   - For the relay to work, each destination must be activated with FormSubmit. A successful queue response does not guarantee inbox delivery; check spam/junk and confirm cPanel email routing or SMTP configuration with Truehost.
3. **Admin Dashboard Synchronization**:
   - Whenever any administrator accesses `/admin` (or `#admin`) from **any device** (smartphone, laptop, tablet, desktop) with password `Giniben123`:
     - The Admin Console fetches the live records from the MySQL database table.
     - You can review, mark status as **Reviewed** or **Resolved**, or delete inquiries.
     - Any edit or deletion done in the Admin Dashboard is written directly to the MySQL database and reflects across all devices.

---

### Step 4: Build and Deploy

In your local Visual Studio Code:
```bash
npm run build
git add .
git commit -m "Full MySQL database synchronization and multi-recipient email alert integration"
git push
```

On Truehost cPanel **Git™ Version Control**:
1. Click **UPDATE FROM REMOTE**.
2. Click **DEPLOY HEAD COMMIT**.
*(Or directly upload the contents of your local `dist/` folder into `public_html/` using cPanel File Manager).*
