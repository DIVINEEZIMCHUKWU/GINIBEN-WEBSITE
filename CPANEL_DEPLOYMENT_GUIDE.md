# GINIBEN & PARTNERS GEOSERVICES LTD
## Complete Truehost cPanel & Shared Hosting Deployment Guide

This guide provides step-by-step instructions for deploying the **GiniBen & Partners GEOSERVICES LTD** corporate website on Truehost shared hosting with cPanel (using standard PHP 8.x and MySQL/MariaDB).

**Production Domain:** `https://ginibengeoservices.com/`

---

### Step 1: Create the MySQL Database in cPanel

1. Log into your Truehost cPanel account.
2. Under the **Databases** section, click **MySQL® Database Wizard**.
3. **New Database**: Enter database name, for example: `ginibeng_geoservices` and click *Next Step*.
4. **Create Database Users**:
   - Username: `ginibeng_dbuser`
   - Password: Click *Password Generator* to generate a strong password (e.g. 16+ characters with symbols).
   - Save the password securely.
   - Click *Create User*.
5. **Add User to Database**:
   - Check **ALL PRIVILEGES**.
   - Click *Make Changes*.

---

### Step 2: Import `database.sql` via phpMyAdmin

1. In cPanel, navigate back to the main dashboard and click **phpMyAdmin**.
2. Select your newly created database (`ginibeng_geoservices`) from the left-hand navigation.
3. Click the **Import** tab at the top.
4. Under *File to import*, click **Choose File** and select the `/database.sql` file included in this project.
5. Ensure the character set is set to **utf-8** (or `utf8mb4`).
6. Scroll down and click **Import**.
7. Confirm that all 8 tables are created successfully:
   - `administrators`
   - `website_settings`
   - `services`
   - `gallery_images`
   - `projects`
   - `team_members`
   - `articles`
   - `enquiries`

---

### Step 3: Configure Database Credentials in PHP

1. In cPanel, open **File Manager** and locate your website directory (usually `public_html/` or a subdomain folder).
2. Inside `public_html/api/config.php`, edit the database constants to match your cPanel setup:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'ginibeng_geoservices');
define('DB_USER', 'ginibeng_dbuser');
define('DB_PASS', 'YourActualGeneratedPasswordHere');
define('DB_CHARSET', 'utf8mb4');
```

3. Save the file.

---

### Step 4: Build and Deploy the Frontend

1. Generate the optimized production build:
   ```bash
   npm run build
   ```
2. The compiled assets will be placed into the `dist/` directory.
3. Upload the contents of `dist/` into your cPanel `public_html/` directory:
   - `index.html`
   - `assets/` (CSS & JavaScript bundles)
   - `api/` (PHP endpoints)
   - `.htaccess` (Apache routing & compression)
4. Verify file permissions in cPanel File Manager:
   - Folders: `755`
   - Files: `644`

---

### Step 5: Verify SSL and HTTPS

1. In cPanel, navigate to **SSL/TLS Status**.
2. Click **Run AutoSSL** for `ginibengeoservices.com` and `www.ginibengeoservices.com`.
3. Verify that the `.htaccess` file automatically forces HTTPS.

---

### Step 6: Testing Checklist

- [ ] Load `https://ginibengeoservices.com/` in an incognito browser window.
- [ ] Verify the 15-image Hero Showcase cycles cleanly.
- [ ] Test the Signature Dual-Track Slider (continuous marquee on top, static interactive grid below).
- [ ] Test the Featured Project Film section (Video 01 & Video 02).
- [ ] Submit a test consultation enquiry and verify the generated reference code (`GB-2026-XXXX`).
- [ ] Test the floating WhatsApp and Telephone buttons.
- [ ] Access the Admin Portal (`/admin` or Admin button in header) to review recorded enquiries and system statistics.
