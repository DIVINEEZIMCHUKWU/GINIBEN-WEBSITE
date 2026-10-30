const fs = require('fs');
const path = require('path');

// Read updated companyData.ts
const content = fs.readFileSync(path.join(__dirname, '../src/data/companyData.ts'), 'utf8');

const matchImages = content.match(/export const INITIAL_GALLERY_IMAGES: MediaItem\[\] = (\[[\s\S]*?\n\];)/);
const images = eval(matchImages[1]);

const matchServices = content.match(/export const INITIAL_SERVICES: ServiceItem\[\] = (\[[\s\S]*?\n\];)/);
const services = eval(matchServices[1]);

const matchProjects = content.match(/export const INITIAL_PROJECTS: ProjectItem\[\] = (\[[\s\S]*?\n\];)/);
const projects = eval(matchProjects[1]);

const matchFeaturedVideos = content.match(/export const FEATURED_DRILLING_VIDEOS: ProjectVideo\[\] = (\[[\s\S]*?\n\];)/);
const FEATURED_DRILLING_VIDEOS = eval(matchFeaturedVideos[1]);

const matchVideos = content.match(/export const ALL_PROJECT_VIDEOS: ProjectVideo\[\] = (\[[\s\S]*?\n\];)/);
const videos = eval(matchVideos[1]);

const matchTeam = content.match(/export const INITIAL_TEAM_MEMBERS: TeamMember\[\] = (\[[\s\S]*?\n\];)/);
const team = eval(matchTeam[1]);

function escapeSql(str) {
  if (str === null || str === undefined) return "NULL";
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

let sql = `-- ============================================================================
-- GiniBen & Partners GEOSERVICES LTD (ginibengeoservices.com)
-- Comprehensive Truehost cPanel MySQL Production Database Schema & Seed Data
-- Automatically generated on: ${new Date().toISOString()}
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ----------------------------------------------------------------------------
-- 1. GALLERY IMAGES TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS \`gallery_images\`;
CREATE TABLE \`gallery_images\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`url\` TEXT NOT NULL,
  \`caption\` TEXT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`alt\` VARCHAR(255) NULL,
  \`is_hero\` TINYINT(1) NOT NULL DEFAULT 0,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`location\` VARCHAR(255) NULL,
  \`date\` VARCHAR(50) NULL,
  \`show_on_homepage\` TINYINT(1) NOT NULL DEFAULT 1,
  \`show_on_projects\` TINYINT(1) NOT NULL DEFAULT 1,
  \`show_on_gallery\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_img_category\` (\`category\`),
  INDEX \`idx_img_order\` (\`sort_order\`),
  INDEX \`idx_img_gallery\` (\`show_on_gallery\`),
  INDEX \`idx_img_projects\` (\`show_on_projects\`),
  INDEX \`idx_img_home\` (\`show_on_homepage\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. SERVICES TABLE (8 Official Practice Areas)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS \`services\`;
CREATE TABLE \`services\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`slug\` VARCHAR(150) NOT NULL UNIQUE,
  \`numeric_code\` VARCHAR(20) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`tagline\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`detailed_scope\` TEXT NOT NULL,
  \`methods_deliverables\` TEXT NOT NULL,
  \`target_sectors\` TEXT NOT NULL,
  \`featured_image\` TEXT NOT NULL,
  \`is_published\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. PROJECTS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS \`projects\`;
CREATE TABLE \`projects\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`slug\` VARCHAR(150) NOT NULL UNIQUE,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`category_key\` VARCHAR(100) NOT NULL,
  \`location\` VARCHAR(255) NOT NULL,
  \`date\` VARCHAR(50) NOT NULL,
  \`cover_image\` TEXT NOT NULL,
  \`summary\` TEXT NOT NULL,
  \`methodology\` TEXT NOT NULL,
  \`key_deliverables\` TEXT NOT NULL,
  \`gallery_images\` TEXT NOT NULL,
  \`featured\` TINYINT(1) NOT NULL DEFAULT 0,
  \`status\` ENUM('Published', 'Archived', 'Draft') NOT NULL DEFAULT 'Published',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. PROJECT VIDEOS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS \`project_videos\`;
CREATE TABLE \`project_videos\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` VARCHAR(255) NOT NULL,
  \`drive_view_url\` TEXT NOT NULL,
  \`drive_preview_url\` TEXT NOT NULL,
  \`thumbnail\` TEXT NOT NULL,
  \`description\` TEXT NOT NULL,
  \`is_vertical\` TINYINT(1) NOT NULL DEFAULT 1,
  \`orientation\` ENUM('vertical', 'horizontal') NOT NULL DEFAULT 'vertical',
  \`show_on_homepage\` TINYINT(1) NOT NULL DEFAULT 1,
  \`show_on_projects\` TINYINT(1) NOT NULL DEFAULT 1,
  \`show_on_gallery\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TEAM MEMBERS TABLE (Supports both affiliations and affiliations_json)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS \`team_members\`;
CREATE TABLE \`team_members\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`role\` VARCHAR(150) NOT NULL,
  \`credentials\` VARCHAR(255) NOT NULL,
  \`experience_years\` VARCHAR(50) NOT NULL,
  \`affiliations\` TEXT NULL,
  \`affiliations_json\` TEXT NULL,
  \`bio\` TEXT NOT NULL,
  \`image\` TEXT NOT NULL,
  \`is_placeholder\` TINYINT(1) NOT NULL DEFAULT 0,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_team_sort\` (\`sort_order\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. CONSULTATION ENQUIRIES TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS \`enquiries\`;
CREATE TABLE \`enquiries\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`reference_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`company\` VARCHAR(180) NULL,
  \`email\` VARCHAR(180) NOT NULL,
  \`phone\` VARCHAR(60) NULL,
  \`service_of_interest\` VARCHAR(150) NOT NULL,
  \`project_location\` VARCHAR(180) NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`status\` ENUM('new', 'reviewed', 'resolved') NOT NULL DEFAULT 'new',
  \`ip_address\` VARCHAR(50) NULL,
  \`user_agent\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_enq_status\` (\`status\`),
  INDEX \`idx_enq_ref\` (\`reference_number\`),
  INDEX \`idx_enq_created\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. COMPANY SETTINGS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS \`settings\`;
CREATE TABLE \`settings\` (
  \`setting_key\` VARCHAR(100) NOT NULL,
  \`setting_value\` TEXT NOT NULL,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED GALLERY IMAGES (${images.length} Verified Field Records)
-- ============================================================================
`;

images.forEach((img, idx) => {
  sql += `INSERT INTO \`gallery_images\` (\`id\`, \`title\`, \`url\`, \`caption\`, \`category\`, \`alt\`, \`is_hero\`, \`sort_order\`, \`location\`, \`show_on_homepage\`, \`show_on_projects\`, \`show_on_gallery\`) VALUES (\n`
    + `  ${escapeSql(img.id)},\n`
    + `  ${escapeSql(img.title)},\n`
    + `  ${escapeSql(img.url)},\n`
    + `  ${escapeSql(img.caption)},\n`
    + `  ${escapeSql(img.category)},\n`
    + `  ${escapeSql(img.alt || img.title)},\n`
    + `  ${img.isHero ? 1 : 0},\n`
    + `  ${idx + 1},\n`
    + `  ${escapeSql(img.location || 'Mineral Concession, Nigeria')},\n`
    + `  ${img.showOnHomepage !== false ? 1 : 0}, ${img.showOnProjects !== false ? 1 : 0}, ${img.showOnGallery !== false ? 1 : 0}\n`
    + `);\n`;
});

sql += `\n-- ============================================================================
-- SEED SERVICES (${services.length} Official Practice Areas)
-- ============================================================================
`;

services.forEach((srv) => {
  sql += `INSERT INTO \`services\` (\`id\`, \`slug\`, \`numeric_code\`, \`title\`, \`tagline\`, \`description\`, \`detailed_scope\`, \`methods_deliverables\`, \`target_sectors\`, \`featured_image\`, \`is_published\`) VALUES (\n`
    + `  ${escapeSql(srv.id)},\n`
    + `  ${escapeSql(srv.slug)},\n`
    + `  ${escapeSql(srv.numericCode)},\n`
    + `  ${escapeSql(srv.title)},\n`
    + `  ${escapeSql(srv.tagline)},\n`
    + `  ${escapeSql(srv.description)},\n`
    + `  ${escapeSql(JSON.stringify(srv.detailedScope))},\n`
    + `  ${escapeSql(JSON.stringify(srv.methodsAndDeliverables))},\n`
    + `  ${escapeSql(JSON.stringify(srv.targetSectors))},\n`
    + `  ${escapeSql(srv.featuredImage)},\n`
    + `  ${srv.isPublished ? 1 : 0}\n`
    + `);\n`;
});

sql += `\n-- ============================================================================
-- SEED PROJECTS (${projects.length} Verified Field Assignments)
-- ============================================================================
`;

projects.forEach((prj) => {
  sql += `INSERT INTO \`projects\` (\`id\`, \`slug\`, \`title\`, \`category\`, \`category_key\`, \`location\`, \`date\`, \`cover_image\`, \`summary\`, \`methodology\`, \`key_deliverables\`, \`gallery_images\`, \`featured\`, \`status\`) VALUES (\n`
    + `  ${escapeSql(prj.id)},\n`
    + `  ${escapeSql(prj.slug)},\n`
    + `  ${escapeSql(prj.title)},\n`
    + `  ${escapeSql(prj.category)},\n`
    + `  ${escapeSql(prj.categoryKey)},\n`
    + `  ${escapeSql(prj.location)},\n`
    + `  ${escapeSql(prj.date)},\n`
    + `  ${escapeSql(prj.coverImage)},\n`
    + `  ${escapeSql(prj.summary)},\n`
    + `  ${escapeSql(prj.methodology)},\n`
    + `  ${escapeSql(JSON.stringify(prj.keyDeliverables))},\n`
    + `  ${escapeSql(JSON.stringify(prj.galleryImages))},\n`
    + `  ${prj.featured ? 1 : 0},\n`
    + `  ${escapeSql(prj.status)}\n`
    + `);\n`;
});

sql += `\n-- ============================================================================
-- SEED VIDEOS (${videos.length} Verified Field Operations Footage)
-- ============================================================================
`;

videos.forEach((vid) => {
  sql += `INSERT INTO \`project_videos\` (\`id\`, \`title\`, \`subtitle\`, \`drive_view_url\`, \`drive_preview_url\`, \`thumbnail\`, \`description\`, \`is_vertical\`, \`orientation\`, \`show_on_homepage\`, \`show_on_projects\`, \`show_on_gallery\`) VALUES (\n`
    + `  ${escapeSql(vid.id)},\n`
    + `  ${escapeSql(vid.title)},\n`
    + `  ${escapeSql(vid.subtitle)},\n`
    + `  ${escapeSql(vid.driveViewUrl)},\n`
    + `  ${escapeSql(vid.drivePreviewUrl)},\n`
    + `  ${escapeSql(vid.thumbnail)},\n`
    + `  ${escapeSql(vid.description)},\n`
    + `  ${vid.isVertical ? 1 : 0},\n`
    + `  ${escapeSql(vid.orientation || 'vertical')},\n`
    + `  1, 1, 1\n`
    + `);\n`;
});

sql += `\n-- ============================================================================
-- SEED TEAM MEMBERS (${team.length} Core Leadership & Technical Consultants)
-- ============================================================================
`;

team.forEach((m) => {
  sql += `INSERT INTO \`team_members\` (\`id\`, \`name\`, \`title\`, \`role\`, \`credentials\`, \`experience_years\`, \`affiliations\`, \`affiliations_json\`, \`bio\`, \`image\`, \`is_placeholder\`, \`sort_order\`) VALUES (\n`
    + `  ${escapeSql(m.id)},\n`
    + `  ${escapeSql(m.name)},\n`
    + `  ${escapeSql(m.title)},\n`
    + `  ${escapeSql(m.role)},\n`
    + `  ${escapeSql(m.credentials)},\n`
    + `  ${escapeSql(m.experienceYears)},\n`
    + `  ${escapeSql(JSON.stringify(m.affiliations))},\n`
    + `  ${escapeSql(JSON.stringify(m.affiliations))},\n`
    + `  ${escapeSql(m.bio)},\n`
    + `  ${escapeSql(m.image)},\n`
    + `  ${m.isPlaceholder ? 1 : 0},\n`
    + `  ${m.order || 0}\n`
    + `);\n`;
});

sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;

fs.writeFileSync(path.join(__dirname, '../database.sql'), sql, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/database.sql'), sql, 'utf8');
console.log(`Generated database.sql and public/database.sql successfully with:`);
console.log(`- ${images.length} gallery images`);
console.log(`- ${services.length} services`);
console.log(`- ${projects.length} projects`);
console.log(`- ${videos.length} videos`);
console.log(`- ${team.length} team members`);
