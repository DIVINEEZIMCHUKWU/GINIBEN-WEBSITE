-- ============================================================================
-- GINIBEN & PARTNERS GEOSERVICES LTD
-- PRODUCTION DATABASE SCHEMA FOR CPANEL / MYSQL (PDO COMPATIBLE)
-- Domain: https://ginibengeoservices.com/
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `gallery_images`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `website_settings`;
DROP TABLE IF EXISTS `administrators`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. ADMINISTRATORS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `administrators` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'administrator',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` DATETIME NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_admin_username` (`username`),
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. WEBSITE SETTINGS TABLE (KEY-VALUE WITH DESCRIPTION)
-- ----------------------------------------------------------------------------
CREATE TABLE `website_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(80) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_settings_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. SERVICES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL UNIQUE,
  `numeric_code` VARCHAR(10) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `detailed_scope` JSON NULL,
  `methods_deliverables` JSON NULL,
  `target_sectors` JSON NULL,
  `featured_image` VARCHAR(255) NOT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_services_slug` (`slug`),
  INDEX `idx_services_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. GALLERY IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `gallery_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(255) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `caption` TEXT NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'geology',
  `alt_text` VARCHAR(255) NOT NULL,
  `is_hero` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_visible` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_gallery_category` (`category`),
  INDEX `idx_gallery_hero` (`is_hero`),
  INDEX `idx_gallery_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. PROJECTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `projects` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `category_key` VARCHAR(50) NOT NULL DEFAULT 'geology',
  `location` VARCHAR(150) NOT NULL,
  `project_date` VARCHAR(80) NOT NULL,
  `cover_image` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `methodology` TEXT NOT NULL,
  `key_deliverables` JSON NULL,
  `gallery_images` JSON NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('Published', 'Archived', 'Draft') NOT NULL DEFAULT 'Published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_projects_slug` (`slug`),
  INDEX `idx_projects_featured` (`is_featured`),
  INDEX `idx_projects_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. TEAM MEMBERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `team_members` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `credentials` VARCHAR(200) NOT NULL,
  `experience_years` VARCHAR(100) NOT NULL,
  `affiliations` JSON NULL,
  `bio` TEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `is_placeholder` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_team_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. ARTICLES & TECHNICAL INSIGHTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `articles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(140) NOT NULL UNIQUE,
  `title` VARCHAR(220) NOT NULL,
  `category` VARCHAR(80) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `author` VARCHAR(120) NOT NULL,
  `author_role` VARCHAR(120) NOT NULL,
  `published_at` VARCHAR(50) NOT NULL,
  `read_time` VARCHAR(30) NOT NULL DEFAULT '5 min read',
  `cover_image` VARCHAR(255) NOT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_articles_slug` (`slug`),
  INDEX `idx_articles_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. CONTACT ENQUIRIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `enquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_number` VARCHAR(30) NOT NULL UNIQUE,
  `full_name` VARCHAR(120) NOT NULL,
  `company` VARCHAR(150) NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `service_of_interest` VARCHAR(120) NOT NULL,
  `project_location` VARCHAR(150) NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'reviewed', 'resolved') NOT NULL DEFAULT 'new',
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_enquiries_status` (`status`),
  INDEX `idx_enquiries_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

INSERT INTO `website_settings` (`setting_key`, `setting_value`, `description`) VALUES
('company_name', 'GiniBen & Partners GEOSERVICES LTD', 'Official Corporate Brand Name'),
('tagline', 'Precision Beneath the Surface.', 'Primary Brand Positioning'),
('official_domain', 'https://ginibengeoservices.com/', 'Production Website URL'),
('whatsapp_number', '+234905680556', 'Verified WhatsApp Contact (Centrally Managed)'),
('phone_number', '+234905680556', 'Verified Telephone Line (Centrally Managed)'),
('official_email', 'info@ginibengeoservices.com', 'Corporate Inbound Contact Email'),
('facebook_url', 'https://web.facebook.com/profile.php?id=61585052773866', 'Official Facebook Brand Page'),
('founder_name', 'Dr. Benjamin Ukwuteyinor, PhD', 'Founder and Lead Consultant'),
('founder_title', 'Founder & Lead Consultant', 'Executive Designation'),
('brand_colors', 'LIGHT GREEN, CARTON BROWN & WHITE', 'Corporate Brand Palette Identity');
