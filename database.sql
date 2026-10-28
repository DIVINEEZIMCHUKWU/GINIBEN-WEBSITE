-- ============================================================================
-- GINIBEN & PARTNERS GEOSERVICES LTD
-- PRODUCTION DATABASE SCHEMA & INITIAL DATA (CPANEL / MYSQL / PHPMYADMIN)
-- Domain: https://ginibengeoservices.com/
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- Total Fieldwork Images: 104
-- Total Field Videos: 14
-- Total Personnel: 6
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `consultation_enquiries`;
DROP TABLE IF EXISTS `gallery_images`;
DROP TABLE IF EXISTS `project_videos`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `company_settings`;
DROP TABLE IF EXISTS `website_settings`;
DROP TABLE IF EXISTS `administrators`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. COMPANY SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `company_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. ADMINISTRATORS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `administrators` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'administrator',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. GALLERY IMAGES TABLE (104 VERIFIED FIELDWORK RECORDS)
-- ----------------------------------------------------------------------------
CREATE TABLE `gallery_images` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `url` TEXT NOT NULL,
  `caption` TEXT NULL,
  `category` VARCHAR(60) NOT NULL DEFAULT 'geology',
  `alt` VARCHAR(255) NULL,
  `is_hero` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `location` VARCHAR(150) NULL,
  `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_img_cat` (`category`),
  INDEX `idx_img_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. PROJECT VIDEOS TABLE (PORTRAIT FIELD EXPLORATION RECORDINGS)
-- ----------------------------------------------------------------------------
CREATE TABLE `project_videos` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `drive_view_url` TEXT NOT NULL,
  `drive_preview_url` TEXT NOT NULL,
  `thumbnail` TEXT NOT NULL,
  `description` TEXT NULL,
  `is_vertical` TINYINT(1) NOT NULL DEFAULT 1,
  `orientation` VARCHAR(20) NOT NULL DEFAULT 'vertical',
  `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TEAM MEMBERS TABLE (LEADERSHIP & GEOSCIENCE CONSULTANTS)
-- ----------------------------------------------------------------------------
CREATE TABLE `team_members` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `role` VARCHAR(150) NOT NULL,
  `credentials` VARCHAR(255) NULL,
  `experience_years` VARCHAR(100) NULL,
  `affiliations_json` TEXT NULL,
  `bio` TEXT NOT NULL,
  `image` TEXT NOT NULL,
  `is_placeholder` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_team_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. CLIENT ENQUIRIES TABLE (FORM SUBMISSIONS & REFERENCE CODES)
-- ----------------------------------------------------------------------------
CREATE TABLE `enquiries` (
  `id` VARCHAR(64) NOT NULL,
  `reference_number` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `company` VARCHAR(180) NULL,
  `email` VARCHAR(180) NOT NULL,
  `phone` VARCHAR(60) NULL,
  `service_of_interest` VARCHAR(150) NOT NULL,
  `project_location` VARCHAR(180) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'reviewed', 'resolved') NOT NULL DEFAULT 'new',
  `ip_address` VARCHAR(50) NULL,
  `user_agent` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_enq_status` (`status`),
  INDEX `idx_enq_ref` (`reference_number`),
  INDEX `idx_enq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA INSERTIONS
-- ============================================================================

-- 1. Company Settings
INSERT INTO `company_settings` (`setting_key`, `setting_value`) VALUES
('admin_password', 'Giniben123'),
('company_name', 'GiniBen & Partners GEOSERVICES LTD'),
('tagline', 'Precision Beneath the Surface.'),
('domain', 'https://ginibengeoservices.com/'),
('phone', '+234 803 625 1405'),
('whatsappNumber', '+234 803 625 1405'),
('email', 'info@ginibengeoservices.com / benukwutevinor@yahoo.com / gpg1.geoservices@gmail.com'),
('facebookUrl', 'https://www.facebook.com/share/19rQDUYSmo/?mibextid=wwXIfr'),
('linkedinUrl', 'https://www.linkedin.com/company/giniben-geoservices/'),
('founderName', 'Dr. Benjamin Ukwuteyinor, PhD'),
('founderTitle', 'Founder & Lead Consultant');

-- 2. Administrators
INSERT INTO `administrators` (`username`, `email`, `password_hash`, `full_name`, `role`) VALUES
('admin', 'info@ginibengeoservices.com', '$2y$10$abcdefghijklmnopqrstuv', 'GiniBen Administrator', 'superadmin');

-- 3. Team Members (6 Records)
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-01',
  'Dr. Benjamin Ukwuteyinor, PhD',
  'Founder & Lead Consultant',
  'Founder & Lead Consultant',
  'PhD Applied Geophysics, COMEG, NMGS, IAIA certified',
  '25+ years of professional practice',
  '["Council of Mining Engineers and Geoscientists (COMEG)","Nigerian Mining and Geosciences Society (NMGS)","International Association for Impact Assessment (IAIA)"]',
  'Dr. Benjamin Ukwuteyinor is an accomplished exploration geophysicist directing integrated mineral resource evaluations, hydrogeological investigations, deep industrial borehole engineering, and infrastructure geophysics across Nigeria and West Africa.',
  'https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg',
  0,
  1
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-02',
  'Dr. Ezeugwu Innocent (Ph.D)',
  'Principal Partner',
  'Principal Partner',
  'Ph.D, Principal Partner, Groundwater & Mineral Resources',
  '20+ years of professional practice',
  '["Principal Partner, Applied Geophysics & Groundwater Resources","COMEG Registered Geoscientist"]',
  'Principal Partner overseeing high-volume groundwater engineering, subsurface characterization, and large-scale water treatment facility development across regional states.',
  'https://i.ibb.co/0xNFG2Z/Whats-App-Image-2026-10-23-at-9-04-07-PM.jpg',
  0,
  2
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-03',
  'Ogechukwu Maryann Okeke',
  'Geologist',
  'Geologist',
  'Geologist, Exploration & Structural Mapping',
  'Active Field Exploration Geologist',
  '["Nigerian Mining and Geosciences Society (NMGS)","Field Exploration & Stratigraphy Specialist"]',
  'Field geologist specializing in geological mapping, structural interpretation, mineral prospect evaluation, and sample recovery protocols.',
  'https://i.ibb.co/vx8ytQDy/Whats-App-Image-2026-10-23-at-9-04-06-PM-1.jpg',
  0,
  3
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-04',
  'Alichi U. (Ph.D)',
  'Senior Partner / Co-Developer',
  'Senior Partner / Co-Developer',
  'Ph.D, Environmental Hydrogeology & Co-Developer',
  'Senior Partner Level',
  '["Environmental Management & Hydrogeology Specialist","Subsurface Hydrodynamics & Resource Evaluation"]',
  'Senior Partner & Co-Developer leading environmental management planning, hydrodynamics, and sustainable water resources development.',
  'https://i.ibb.co/XxpMK4xQ/Whats-App-Image-2026-10-23-at-9-04-06-PM.jpg',
  0,
  4
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-05',
  'Ekechi Mmaduabuchi',
  'Geophysicist and Logistics Officer',
  'Geophysicist and Logistics Officer',
  'Exploration Geophysics & Field Logistics Operations',
  'Field Operations & Logistics',
  '["Nigerian Mining and Geosciences Society (NMGS)","Applied Geophysics & Technical Logistics Lead"]',
  'Exploration geophysicist directing logistical coordination, vertical electrical sounding (VES) data collection, equipment mobilization, and field operations safety.',
  'https://i.ibb.co/1YhTdZ6w/IMG-20261023-WA0146.jpg',
  0,
  5
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-06',
  'Ama Agwu',
  'Geologist / Field Coordinator',
  'Geologist / Field Coordinator',
  'Field Geology & Exploration Coordination',
  'Field Geological Operations',
  '["Nigerian Mining and Geosciences Society (NMGS)","Structural Mapping & Field Oversight"]',
  'Field geologist coordinating on-site exploration operations, structural geological logging, stratigraphic correlation, and technical field team management.',
  'https://i.ibb.co/WvPD8W2S/IMG-20261023-WA0149.jpg',
  0,
  6
);

-- 4. Project Videos (14 Records)
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-01',
  'Rotary Borehole Drilling Operations',
  'Deep Aquifer Siting & Continuous Mast Rotation',
  'https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/view?usp=drive_link',
  'https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/preview',
  'https://i.ibb.co/fdkK6DqF/Whats-App-Image-2026-10-23-at-9-04-53-PM.jpg',
  'Real-time field footage documenting heavy rotary drilling mast operation, hydraulic feed control, and borehole mud circulation on high-elevation concession.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-02',
  'Exploration Trenching & Saprolite Profiling',
  'CAT Excavator Cutting Geological Trial Trench',
  'https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/view?usp=drive_link',
  'https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/preview',
  'https://i.ibb.co/bVLyVQK/Whats-App-Image-2026-10-23-at-9-05-15-PM.jpg',
  'Direct operational footage of heavy tracked excavator profiling lateritic overburden and exposing underlying weathered saprolite bedrock.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-03',
  'Downhole Drill Stem & Casing Installation',
  'Rotary Mast Coupling & Hydrogeological Advancement',
  'https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/view?usp=drive_link',
  'https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/preview',
  'https://i.ibb.co/HDg6v6dn/Whats-App-Image-2026-10-23-at-9-05-42-PM.jpg',
  'On-site drilling personnel managing high-torque drill pipe couplings, casing shoe positioning, and downhole penetration monitoring.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-04',
  'High-Yield Borehole Pumping & Flow Testing',
  'Aquifer Productivity & Transmissivity Validation',
  'https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/view?usp=drive_link',
  'https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/preview',
  'https://i.ibb.co/spHX4r3b/Whats-App-Image-2026-10-23-at-9-04-48-PM.jpg',
  'Field testing and step-drawdown pumping test verifying commercial water yield and clean discharge rate from industrial production borehole.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-05',
  'Geological Outcrop Structural Assessment',
  'Highland Ridge Lithological & Joint Mapping',
  'https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/view?usp=drive_link',
  'https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/preview',
  'https://i.ibb.co/TB2BV6QR/Whats-App-Image-2026-10-23-at-9-04-55-PM.jpg',
  'Dr. Ben Ukwuteyinor directing technical field team during structural strike, dip measurement, and mineral vein logging across highland escarpment.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-06',
  'Geophysical Electrical Resistivity Survey',
  'Multi-Electrode Vertical Electrical Sounding (VES)',
  'https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/view?usp=drive_link',
  'https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/preview',
  'https://i.ibb.co/604pqSkJ/Whats-App-Image-2026-10-23-at-9-22-54-PM-1.jpg',
  'Field geophysicists operating terrameter instrumentation to delineate subsurface resistivity layers and fracture corridors for deep borehole siting.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-07',
  'Geotechnical Trial Pit Profile Logging',
  'In-Situ Soil Stratigraphy & Infiltration Evaluation',
  'https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/view?usp=drive_link',
  'https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/preview',
  'https://i.ibb.co/yBbWDvCR/Whats-App-Image-2026-10-23-at-9-04-58-PM-1.jpg',
  'Manual excavation of deep geotechnical trial pits to inspect layer cohesion, density, and depth to bedrock ahead of drilling and foundation works.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-08',
  'Subsurface Core Logging & Drilling Operations Archive',
  'Comprehensive Subsurface Exploration Documentation',
  'https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/view?usp=drive_link',
  'https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/preview',
  'https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg',
  'Detailed operational capture of drilling rig logistics, diamond core recovery, ground validation, and engineering fieldwork executed by GiniBen personnel.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-09',
  'Turnkey Solar Water Scheme Infrastructure',
  'Elevated Storage Tank & Public Water Dispenser',
  'https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/view?usp=drive_link',
  'https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/preview',
  'https://i.ibb.co/chxd1T9M/Whats-App-Image-2026-10-23-at-9-04-40-PM.jpg',
  'Operational inspection of completed solar-powered water scheme delivering potable water to local community.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-10',
  'Geochemical Stream Sediment Sieving & Sampling',
  'Fractionation & Sample Envelope Verification',
  'https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/view?usp=drive_link',
  'https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/preview',
  'https://i.ibb.co/d0grTtvr/Whats-App-Image-2026-10-23-at-9-05-31-PM.jpg',
  'Standardized -80 mesh sieving of stream sediments along drainage channels for trace element pathfinder exploration.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-11',
  'Industrial Quarry Crushing & Conveyor Transport',
  'Aggregate Plant Primary Jaw & Screening Circuit',
  'https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/view?usp=drive_link',
  'https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/preview',
  'https://i.ibb.co/YTP1ZrMT/Whats-App-Image-2026-10-23-at-9-23-03-PM.jpg',
  'Mechanical reduction of solid rock in primary jaw crusher and transfer via heavy-duty inclined conveyor gantries.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-12',
  'Alluvial Gold & Heavy Mineral Gravity Panning',
  'Stream Bed Alluvial Sampling Protocol',
  'https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/view?usp=drive_link',
  'https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/preview',
  'https://i.ibb.co/fdX9gcH5/Whats-App-Image-2026-10-23-at-9-05-20-PM-1.jpg',
  'Sediment panning and recovery of heavy mineral concentrates in river gravels for mineral prospectivity analysis.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-13',
  'Exploration Concession Boundary Differential GPS Survey',
  'Precision Perimeter Verification & Staking',
  'https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/view?usp=drive_link',
  'https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/preview',
  'https://i.ibb.co/G45M6D4f/Whats-App-Image-2026-10-23-at-9-22-51-PM-1.jpg',
  'Traversing boundary corner beacons with differential GPS to calibrate concession borders and survey transects.',
  1,
  'vertical',
  1,
  1,
  1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-14',
  'Highland Escarpment Geological Reconnaissance',
  'Topographical Elevation & Lithology Survey',
  'https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/view?usp=drive_link',
  'https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/preview',
  'https://i.ibb.co/zh3C9tbT/Whats-App-Image-2026-10-23-at-9-04-56-PM.jpg',
  'Comprehensive mapping of highland sandstone ridges and mineral contact zones across Udi plateau.',
  1,
  'vertical',
  1,
  1,
  1
);

-- 5. Fieldwork & Equipment Images (104 Complete Records)
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-01',
  'Exploration Trenching & Trial Pit Excavation',
  'https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg',
  'Tracked CAT excavator cutting deep exploration trench for stratigraphic profiling and mineral vein exposure.',
  'geology',
  'Tracked hydraulic excavator digging deep trench in lateritic terrain',
  1,
  1,
  'Mineral Exploration Corridor',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-02',
  'Stratigraphic Horizon & Soil Profile Inspection',
  'https://i.ibb.co/yngMcXWr/Whats-App-Image-2026-10-23-at-6-39-30-PM.jpg',
  'Excavated trial trench exposing undisturbed vertical soil horizons and weathered basement contact.',
  'geology',
  'Undisturbed trial trench showing stratigraphical soil layers and basement contact',
  1,
  2,
  'Concession Exploration Sector',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-03',
  'CAT 225DLC Heavy Excavator in Trenching Operation',
  'https://i.ibb.co/JFpB1MRs/Whats-App-Image-2026-10-23-at-6-39-31-PM-1.jpg',
  'Hydraulic crawler excavator scooping laterite soil and weathered rock overburden along survey transect.',
  'geology',
  'CAT 225DLC excavator bucket scooping lateritic soil trench',
  1,
  3,
  'Fieldwork Trenching Transect',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-04',
  'Geotechnical Trial Pit Depth & Soil Logging',
  'https://i.ibb.co/tp4Sj6hz/Whats-App-Image-2026-10-23-at-6-39-31-PM-2.jpg',
  'Field technician using calibrated yellow tape measure to record precise depth intervals of excavated test pit.',
  'geophysics',
  'Square test pit with yellow measuring tape recording excavation depth',
  1,
  4,
  'Geotechnical Investigation Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-05',
  'Excavation Pit Hardpan & Boulder Penetration',
  'https://i.ibb.co/h1gTzjgy/Whats-App-Image-2026-10-23-at-6-39-31-PM.jpg',
  'Excavator bucket breaking through compact lateritic hardpan and boulder horizons during trial pit advance.',
  'geology',
  'Hydraulic excavator bucket lifting boulder laterite from exploration trench',
  1,
  5,
  'Trial Pit Section',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-06',
  'Stream Sediment & Mineral Panning Sample Recovery',
  'https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg',
  'Geoscientist in safety gloves and gumboots pouring panned heavy mineral concentrates through funnel into sample packet for geochemical assay.',
  'geology',
  'Geoscientist bagging panned heavy mineral concentrates with GPS coordinates',
  1,
  6,
  '5°57\'15.792"N, 7°42\'45.798"E (Alt: 62.6m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-07',
  'Exploration Trenching & Field Security Logistics',
  'https://i.ibb.co/Cp1BZXSK/Whats-App-Image-2026-10-23-at-6-39-32-PM.jpg',
  'Continuous trial trench excavation in lateritic terrain with operational field security monitoring project perimeter.',
  'geology',
  'Heavy excavator cutting trench with field security personnel monitoring site',
  1,
  7,
  'Exploration Concession Perimeter',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-08',
  'Undisturbed Rectangular Trial Pit Profile',
  'https://i.ibb.co/sdPT6Zxq/Whats-App-Image-2026-10-23-at-6-39-33-PM-1.jpg',
  'Deep test pit exposing stable sidewall lithology, soil moisture transitions, and rock competence for engineering foundation evaluation.',
  'geophysics',
  'Deep rectangular trial pit showing vertical soil profile',
  1,
  8,
  'Foundation Feasibility Zone',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-09',
  'Geochemical Sample Bagging & QA/QC Identification',
  'https://i.ibb.co/WvGQMHmf/Whats-App-Image-2026-10-23-at-6-39-33-PM-2.jpg',
  'Field geologists bagging and labelling stream sediment sample SP-014 with precise geostamped satellite coordinates.',
  'geology',
  'Field geologists packaging sample SP-014 through funnel',
  1,
  9,
  '5°57\'19.662"N, 7°42\'22.17"E (Alt: 60.1m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-10',
  'Stream Alluvium Wet-Sieving & Mineral Separation',
  'https://i.ibb.co/gLFDJ8yH/Whats-App-Image-2026-10-23-at-6-39-33-PM.jpg',
  'Geoscientist wet-sieving alluvium through nested mesh screens in bamboo drainage creek to isolate target heavy minerals.',
  'geology',
  'Geoscientist wet-sieving stream sediment samples in field',
  1,
  10,
  '5°57\'15.69"N, 7°42\'45.852"E (Alt: 57.5m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-11',
  'Geotechnical Soil Pit Depth Measurement: Ishiagu',
  'https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg',
  'Measuring depth and logging lithological boundary of trial pit along Amokwe Road, Ishiagu, Ivo LGA, Ebonyi State.',
  'geophysics',
  'Measuring tape inside trial pit in Ishiagu, Ebonyi State',
  1,
  11,
  'Amokwe Road, Ishiagu, Ivo LGA, Ebonyi (Alt: 78.2m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-12',
  'Sealed Geochemical Sample Pouch (OKP-SD-013)',
  'https://i.ibb.co/XrttsZQL/Whats-App-Image-2026-10-23-at-6-39-34-PM.jpg',
  'Lead geologist displaying sealed and verified stream sediment geochemical sample packet OKP-SD-013 with GPS documentation.',
  'geology',
  'Lead geologist holding sealed sample packet OKP-SD-013',
  1,
  12,
  '5°57\'15.666"N, 7°42\'45.804"E (Alt: 61.9m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-13',
  'Rehabilitation of Onuagu Water Scheme: Project Signboard',
  'https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg',
  'Official project board confirming GiniBen & Partners Geoservices Ltd as contractor for Enugu State Ministry of Water Resources.',
  'groundwater',
  'Project signboard for Rehabilitation of Onuagu Water Scheme with elevated water tank',
  1,
  13,
  'Oyofo Oghe, Ezeagu LGA, Enugu State',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-14',
  'MWF GF-1000 33-Elements Long Range Locator System',
  'https://i.ibb.co/b5V0nds7/Whats-App-Image-2026-10-23-at-6-39-35-PM-2.jpg',
  'Specialized geophysical sensor system featuring ground reinforcement transmitter, directional antenna locator, and acoustic receiver console.',
  'instruments',
  'MWF GF-1000 33-element long range detector instrumentation',
  1,
  14,
  'Geophysical Instrumentation Inventory',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-15',
  'Trial Pit Manual Excavation & In-Situ Density Check',
  'https://i.ibb.co/1J6tGDFq/Whats-App-Image-2026-10-23-at-6-39-35-PM.jpg',
  'Field technician demonstrating depth within hand-dug trial pit prior to undisturbed soil core sampling.',
  'geophysics',
  'Field technician inside deep trial pit with spade',
  1,
  15,
  'Soil Mechanics Test Sector',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-16',
  'Stream Bed Alluvial Sampling & Trench Digging',
  'https://i.ibb.co/HpT9hCQ3/Whats-App-Image-2026-10-23-at-6-39-36-PM-1.jpg',
  'Geoscientist digging alluvial sediment from creek bed into panning trays for heavy mineral concentrate isolation.',
  'geology',
  'Geoscientist digging stream bed gravels with spade',
  1,
  16,
  '5°57\'15.762"N, 7°42\'45.846"E (Alt: 67.9m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-17',
  'Dr. Benjamin Ukwuteyinor & Team Outcrop Mapping: Nsude',
  'https://i.ibb.co/DHP3RGM0/Whats-App-Image-2026-10-23-at-6-39-36-PM-2.jpg',
  'Dr. Ben Ukwuteyinor directing GPG geological team during structural outcrop investigation on Udi ridge, Nsude, Enugu.',
  'team',
  'Dr. Benjamin Ukwuteyinor and GPG field team mapping outcrop on hillside in Nsude',
  1,
  17,
  'Nsude, Udi LGA, Enugu State (Alt: 487.5m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-18',
  'Deep Geotechnical Trial Pit in Sandstone Horizon',
  'https://i.ibb.co/HLPjmqyK/Whats-App-Image-2026-10-23-at-6-39-37-PM-1.jpg',
  'Vertical shaft test pit excavated into weathered sandstone and clay stratum for bearing capacity and foundation assessment.',
  'geophysics',
  'Deep square test pit in sandstone stratum',
  0,
  18,
  'Foundation Feasibility Transect',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-19',
  'Heavy 6x6 Truck-Mounted Rotary Drilling Rig',
  'https://i.ibb.co/Y4p0qFvG/Whats-App-Image-2026-10-23-at-6-39-37-PM-2.jpg',
  'High-capacity heavy drilling rig equipped with lattice folding mast, mud circulation pump, and high-pressure compressor for deep water wells and mineral core holes.',
  'drilling',
  'Heavy 6x6 truck-mounted rotary drilling rig with lattice mast',
  1,
  19,
  'Heavy Equipment Mobilization Depot',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-20',
  'Stream Sediment Fractionation & Fine Recovery',
  'https://i.ibb.co/DHnrs3Hg/Whats-App-Image-2026-10-23-at-6-39-37-PM.jpg',
  'Controlled funnel transfer of sieved heavy fraction into moisture-resistant paper envelope for laboratory XRF/ICP-MS analysis.',
  'geology',
  'Pouring sieved mineral fraction through funnel into sample packet',
  0,
  20,
  '5°57\'15.696"N, 7°42\'45.78"E (Alt: 60.9m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-21',
  'Field Panning Heavy Mineral Concentrate Transfer',
  'https://i.ibb.co/0psMBYqs/Whats-App-Image-2026-10-23-at-6-39-38-PM-1.jpg',
  'Dual geoscientist team pouring concentrated stream sediment from wooden batea gold pan into sample cone funnel.',
  'geology',
  'Geologists pouring concentrated mineral samples into sample envelope',
  0,
  21,
  '5°57\'21.432"N, 7°42\'9.486"E (Alt: 64.6m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-22',
  'Community Water Scheme Wellhead & Dispensing Standpipes',
  'https://i.ibb.co/ccsDQjRW/Whats-App-Image-2026-10-23-at-6-39-38-PM.jpg',
  'GiniBen engineers and community leaders standing around newly cast concrete apron with twin water dispensing standpipes, Hilux 4x4 in background.',
  'groundwater',
  'Engineers and community leaders inspecting newly cast water tap apron and standpipes',
  1,
  22,
  'Community Water Project Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-23',
  'Geochemical Sample Batch Cataloging (OKP-SD-001 to 015)',
  'https://i.ibb.co/VYCKFqT7/Whats-App-Image-2026-10-23-at-6-39-39-PM-1.jpg',
  'Numbered stream sediment sample pouches organized sequentially on field table for chain-of-custody laboratory dispatch.',
  'geology',
  '15 labeled geochemical sample packets laid out on blue table',
  0,
  23,
  'Field Basecamp Laboratory',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-24',
  'Galvanized Steel Overhead Water Storage Tower & Scheme',
  'https://i.ibb.co/ksFt40BR/Whats-App-Image-2026-10-23-at-6-39-39-PM-2.jpg',
  'High-elevation steel water tank tower with cat ladder, security fence, and project billboard constructed for Oyoho Health Center by GiniBen.',
  'groundwater',
  'Galvanized steel overhead water tank tower with security perimeter',
  0,
  24,
  'Oyoho Health Center, Ezeagu LGA, Enugu',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-25',
  'Multi-Tap Potable Water Dispensing Point Commissioning',
  'https://i.ibb.co/JwcM61yS/Whats-App-Image-2026-10-23-at-6-39-39-PM.jpg',
  'Four active taps discharging pure borehole water simultaneously onto tiled apron while project supervisor inspects flow rate.',
  'groundwater',
  'Four water taps flowing on brick-tiled apron with inspector washing hands',
  1,
  25,
  'Completed Water Dispensing Facility',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-26',
  'Geochemical Mineral Fraction Bagging in Drainage Basin',
  'https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg',
  'Field samplers transferring washed sediment grains from pan into field sampling packet with precise GPS satellite location.',
  'geology',
  'Transferring mineral grains into funnel at creek drainage basin',
  0,
  26,
  '5°57\'21.45"N, 7°42\'9.45"E (Alt: 63.6m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-27',
  'Wet-Sieving & Mineral Fractionation in Sieve Drum',
  'https://i.ibb.co/9kHrKR7Q/Whats-App-Image-2026-10-23-at-6-39-40-PM.jpg',
  'Geoscientist in safety gloves manually agitating sediment slurry in sieve drum to remove oversized gravel and retain target fractions.',
  'geology',
  'Geoscientist agitating sediment inside nested sieve drum',
  0,
  27,
  '5°57\'21.486"N, 7°42\'9.504"E (Alt: 63.7m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-28',
  'Continuous Exploration Trench Excavation to Water Seepage',
  'https://i.ibb.co/CpQtM2RW/Whats-App-Image-2026-10-23-at-6-39-41-PM-1.jpg',
  'Deep trial trench excavated through laterite soil down to groundwater table showing active water pooling and stratum contact.',
  'geology',
  'Long exploration trench with water pooling at bottom excavated by CAT machine',
  1,
  28,
  'Exploration Trenching Corridor',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-29',
  'Alluvial Mineral Panning in Creek Drainage Channel',
  'https://i.ibb.co/0yWdwfj5/Whats-App-Image-2026-10-23-at-6-39-41-PM.jpg',
  'Field sampling crew panning creek alluvium under senior consultant supervision in agricultural basin.',
  'geology',
  'Field crew panning sediment in creek channel with supervisor observing',
  0,
  29,
  'Alluvial Sampling Basin',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-30',
  'Stream Sediment Mesh Sieving in Bamboo Riparian Zone',
  'https://i.ibb.co/KpTSkxn0/Whats-App-Image-2026-10-23-at-6-39-42-PM-1.jpg',
  'Sediment preparation and classification using metallurgical sieves in bamboo canopy with satellite positioning stamp.',
  'geology',
  'Sieving sediment samples with nested sieves in bamboo riparian grove',
  0,
  30,
  '5°57\'15.654"N, 7°42\'45.846"E (Alt: 58.6m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-31',
  'Dr. Benjamin Ukwuteyinor Structural Geological Traverse',
  'https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg',
  'Lead consultant Dr. Ben Ukwuteyinor and GPG field geologists logging outcrop strike, dip, and lithology in Nsude, Udi LGA, Enugu.',
  'team',
  'Dr. Ben Ukwuteyinor pointing to outcrop with geologists taking notes on hillside in Nsude',
  1,
  31,
  'Nsude, Udi LGA, Enugu (Alt: 487.5m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-32',
  'Alluvial Panning Samplers in Stream Bed',
  'https://i.ibb.co/nNRMvYfy/Whats-App-Image-2026-10-23-at-6-39-42-PM.jpg',
  'Field technicians in high-visibility safety vests washing and swirling heavy gravels in panning pans to detect indicator minerals.',
  'geology',
  'Two field samplers wearing hi-vis vests panning stream gravels',
  0,
  32,
  'Alluvial Exploration Transect',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-33',
  'Highland Geological Reconnaissance Team: Nsude Ridge',
  'https://i.ibb.co/6J15k85w/Whats-App-Image-2026-10-23-at-6-39-43-PM-1.jpg',
  'Consulting geologists recording GPS coordinates, elevation, and structural lithology on scenic highland ridge overlooking Enugu valley.',
  'team',
  'GPG geoscience crew recording structural data on Nsude ridge elevation 487.5m',
  0,
  33,
  'Nsude Ridge, Udi LGA, Enugu State',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-34',
  'Active Rotary Borehole Drilling Rig & Pipe Assembly',
  'https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg',
  'Drilling crew in hardhats and protective gear managing drill pipe couplings and hydraulic rotary mast on a deep water well.',
  'drilling',
  'Drilling crew operating rotary drill rig with drill pipes on racks in foreground',
  1,
  34,
  'Deep Groundwater Drilling Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-35',
  'Cataloged Geochemical Assay Sample Envelopes',
  'https://i.ibb.co/ZzXJCFKM/Whats-App-Image-2026-10-23-at-6-39-43-PM.jpg',
  'Overhead view of labeled stream sediment geochemical sample envelopes (OKP-SD-001 to 015) ready for dispatch.',
  'geology',
  'Overhead view of labeled sample bags organized on field table',
  0,
  35,
  'Field Laboratory Processing',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-36',
  'Open-Cast Coal Seam & Mineral Quarry Stratigraphy',
  'https://i.ibb.co/4nK4wrRQ/Whats-App-Image-2026-10-23-at-6-39-44-PM-1.jpg',
  'Tracked green excavator exposing thick black bituminous coal / carbonaceous shale bed beneath reddish overburden in Enugu basin.',
  'geology',
  'Excavator digging into exposed black coal seam beneath red overburden in Enugu quarry',
  0,
  36,
  'Enugu Solid Minerals Quarry',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-37',
  'Turnkey Solar-Powered Community Water Scheme',
  'https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg',
  'Commissioned solar-powered water facility featuring elevated steel storage tank with rooftop solar array, pump house, and 4-tap brick dispensing station.',
  'groundwater',
  'Turnkey solar borehole water scheme with elevated tank and brick tap dispenser',
  1,
  37,
  'Rural Water Supply Scheme, Enugu',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-38',
  'Open-Pit Mine Face & Overburden Stripping',
  'https://i.ibb.co/wN8RhZQm/Whats-App-Image-2026-10-23-at-6-39-45-PM.jpg',
  'Heavy excavators bench-stripping red weathered overburden to expose commercial solid mineral and coal horizons.',
  'geology',
  'Excavators stripping red overburden above thick dark mineral seam',
  0,
  38,
  'Open-Pit Mineral Extraction Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-39',
  'Geophysical Resistivity Survey & Subsurface Imaging',
  'https://i.ibb.co/GvWdkt9q/Whats-App-Image-2026-10-23-at-6-39-46-PM-1.jpg',
  'GiniBen geophysicists operating portable electrical resistivity terrameter console in field for vertical electrical sounding (VES) and aquifer siting.',
  'geophysics',
  'Geophysicists in field with instrument flight case and portable resistivity meter',
  0,
  39,
  'Geophysical Exploration Grid',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-40',
  'Outcrop Strike & Dip Structural Logging: Ngwo Uno',
  'https://i.ibb.co/Vcj2KcYL/Whats-App-Image-2026-10-23-at-6-39-46-PM-2.jpg',
  'Field geologists logging structural attitude and dip angles along Asaba-Onitsha-Enugu Road escarpment, Ngwo Uno, Udi LGA, Enugu.',
  'team',
  'Geologists with GPG vest logging rock outcrop in Ngwo Uno, Udi LGA',
  1,
  40,
  'Asaba-Onitsha-Enugu Rd, Ngwo Uno, Udi, Enugu (Alt: 487.5m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-41',
  'Geochemical Field Geologist with Sample Packet (OKP-SD-015)',
  'https://i.ibb.co/27DRRcpd/Whats-App-Image-2026-10-23-at-6-39-46-PM.jpg',
  'Field geologist holding verified sample packet OKP-SD-015 with collection shovel and sieve pans in stream channel.',
  'geology',
  'Geologist holding sample packet OKP-SD-015 in stream trench',
  0,
  41,
  '5°57\'21.486"N, 7°42\'9.51"E (Alt: 65.4m)',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-42',
  'Stream Sediment Sieving and Heavy Mineral Panning',
  'https://i.ibb.co/rRbhQSZn/Whats-App-Image-2026-10-23-at-9-22-56-PM-2.jpg',
  'Field geoscientist processing stream gravels using standardized brass sieves along active drainage channels.',
  'geology',
  'Field geologist sieving stream sediment into basin along river bank',
  0,
  42,
  'Drainage Catchment Exploration Transect',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-43',
  'Riverbed Bedrock Exposure and Lithological Logging',
  'https://i.ibb.co/4wwZKF6J/Whats-App-Image-2026-10-23-at-9-23-06-PM-2.jpg',
  'Geoscientist conducting in-situ lithological inspection and sampling of crystalline riverbed rock outcrops.',
  'geology',
  'Geoscientist inspecting water-washed bedrock exposures in riverbed',
  0,
  43,
  'River Valley Geological Traverse',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-44',
  'Quartz Vein Mineralization and Host Rock Contact',
  'https://i.ibb.co/bM2PDHmB/Whats-App-Image-2026-10-23-at-9-23-06-PM-1.jpg',
  'Close-up structural investigation of hydrothermal quartz veining cutting across crystalline basement rock.',
  'geology',
  'Hydrothermal quartz vein intruding weathered crystalline bedrock',
  0,
  44,
  'Basement Complex Structural Horizon',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-45',
  'Highland Ridge Escarpment Geological Reconnaissance',
  'https://i.ibb.co/hJcMQC2n/Whats-App-Image-2026-10-23-at-9-23-06-PM.jpg',
  'GiniBen exploration team traversing high-elevation sandstone ridges to delineate regional lineaments.',
  'team',
  'Geologists standing on high plateau ridge overlooking forested valley',
  1,
  45,
  'Udi Plateau Escarpment, Enugu',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-46',
  'Deep Rotary Borehole Rig Mobilization and Setup',
  'https://i.ibb.co/qL79gVKY/Whats-App-Image-2026-10-23-at-9-23-05-PM-2.jpg',
  'Hydraulic heavy rotary drill rig mast raised and stabilized with hydraulic outriggers on production drilling pad.',
  'groundwater',
  'Heavy-duty truck-mounted rotary drill rig mast erect on drilling site',
  0,
  46,
  'Industrial Groundwater Wellfield, Enugu',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-47',
  'Borehole Steel Casing and Drill Stem Handling',
  'https://i.ibb.co/N601b26D/Whats-App-Image-2026-10-23-at-9-23-05-PM.jpg',
  'Drilling crew guiding heavy gauge casing pipes into borehole collar to secure unstable upper formation.',
  'groundwater',
  'Drilling crew positioning heavy steel borehole casing section',
  0,
  47,
  'Community Water Production Well',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-48',
  'Structural Strike and Dip Measurement with Clinometer',
  'https://i.ibb.co/JhNfBJ5/Whats-App-Image-2026-10-23-at-9-23-04-PM-1.jpg',
  'Precision measurement of bedding attitude and foliation dip angles using geological compass-clinometer.',
  'geology',
  'Geologist using compass-clinometer on inclined bedding plane',
  0,
  48,
  'Outcrop Exposure, Ngwo Uno, Enugu',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-49',
  'Digital Resistivity Terrameter Instrument Display',
  'https://i.ibb.co/Gvzm0rkf/Whats-App-Image-2026-10-23-at-9-23-04-PM.jpg',
  'Field calibration and real-time resistance monitoring on digital terrameter console during VES survey.',
  'instruments',
  'Digital terrameter instrumentation screen showing resistivity metrics',
  0,
  49,
  'Geophysical Calibration Station',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-50',
  'Multicore Cable Deployment for Resistivity Sounding',
  'https://i.ibb.co/qYjw7Vqq/Whats-App-Image-2026-10-23-at-9-23-03-PM-1.jpg',
  'Technical crew deploying multicore survey cables across exploration profile line for electrical resistivity tomography.',
  'geophysics',
  'Field team rolling out high-visibility multicore geophysics cables',
  0,
  50,
  'Aquifer Delineation Grid',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-51',
  'Quarry Primary Jaw Crusher and Sizing Conveyor',
  'https://i.ibb.co/YTP1ZrMT/Whats-App-Image-2026-10-23-at-9-23-03-PM.jpg',
  'Heavy industrial aggregate plant crushing blasted granite rock and sorting into specified commercial fractions.',
  'geology',
  'Heavy-duty jaw crusher and inclined conveyor belt at granite quarry',
  0,
  51,
  'Commercial Aggregate Quarry, Ebonyi State',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-52',
  'Trial Pit Regolith Sampling and Documentation',
  'https://i.ibb.co/ZvL8Qxs/Whats-App-Image-2026-10-23-at-9-23-02-PM-2.jpg',
  'Geologist logging vertical saprolite horizons and bagging geochemical samples from exploratory trial pit.',
  'geology',
  'Geologist standing in trial pit inspecting soil horizons and sample bag',
  0,
  52,
  'Lateritic Regolith Trial Pit Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-53',
  'Hydraulic Excavator Cutting Deep Geotechnical Trench',
  'https://i.ibb.co/4gmXj1Kp/Whats-App-Image-2026-10-23-at-9-23-02-PM-1.jpg',
  'Tracked CAT excavator trenching through consolidated laterite to expose sub-surface weathering profile.',
  'geology',
  'Hydraulic excavator bucket excavating deep geotechnical exploration trench',
  0,
  53,
  'Infrastructure Ground Investigation Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-54',
  'High-Yield Borehole Production Flow Testing',
  'https://i.ibb.co/bMq25Shw/Whats-App-Image-2026-10-23-at-9-23-02-PM.jpg',
  'Continuous high-volume discharge during constant rate pumping test to determine aquifer transmissivity.',
  'groundwater',
  'Clean groundwater pouring heavily from high-capacity borehole pipe',
  1,
  54,
  'Commercial Water Supply Well',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-55',
  'Reinforced Steel Overhead Water Storage Tower',
  'https://i.ibb.co/vvdBgxtw/Whats-App-Image-2026-10-23-at-9-23-01-PM-2.jpg',
  'Elevated galvanized steel water storage tank constructed by GiniBen engineering division for gravity reticulation.',
  'groundwater',
  'Elevated galvanized steel water tank tower against clear blue sky',
  0,
  55,
  'Public Water Scheme Installation',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-56',
  'Community Water Dispensing Station and Apron',
  'https://i.ibb.co/XZQQDvBw/Whats-App-Image-2026-10-23-at-9-23-01-PM-1.jpg',
  'Commissioned multi-tap potable water dispensing point featuring tiled hygiene apron and continuous gravity feed.',
  'groundwater',
  'Completed multi-tap water collection station with flowing brass taps',
  0,
  56,
  'Rural Community Water Scheme',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-57',
  'Hand Lens Mineralogical Inspection of Rock Specimen',
  'https://i.ibb.co/Q3qcq22f/Whats-App-Image-2026-10-23-at-9-23-01-PM.jpg',
  'Geoscientist using 10x achromatic hand lens to identify accessory mineral grains and texture on fresh rock split.',
  'geology',
  'Geoscientist inspecting fresh crystalline rock specimen using hand lens',
  0,
  57,
  'Outcrop Mineral Mapping Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-58',
  'Dynamic Cone Penetrometer (DCP) In-Situ Soil Testing',
  'https://i.ibb.co/PvsXmSWQ/Whats-App-Image-2026-10-23-at-9-23-00-PM-1.jpg',
  'Geotechnical engineer performing DCP test to determine structural bearing capacity and soil compaction gradient.',
  'geophysics',
  'Geotechnical engineer conducting dynamic cone penetrometer test on foundation pad',
  0,
  58,
  'Civil Infrastructure Foundation Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-59',
  'Systematic Drill Core Tray Logging and Preservation',
  'https://i.ibb.co/C3YKbKTX/Whats-App-Image-2026-10-23-at-9-23-00-PM.jpg',
  'Drill core specimens arranged systematically in wooden core boxes with depth tags and lithology markers.',
  'geology',
  'Wooden core boxes displaying recovered diamond drill core cylinders',
  0,
  59,
  'Field Base Core Logging Facility',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-60',
  'Differential GPS Concession Boundary Verification',
  'https://i.ibb.co/G45M6D4f/Whats-App-Image-2026-10-23-at-9-22-51-PM-1.jpg',
  'High-precision GNSS receiver deployed over legal survey monument to calibrate mineral concession limits.',
  'geology',
  'Differential GPS receiver mounted on survey bipod over boundary beacon',
  0,
  60,
  'Mining Concession Perimeter',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-61',
  'Precision Field Balance Sample Mass Determination',
  'https://i.ibb.co/r2cM80n5/Whats-App-Image-2026-10-23-at-9-22-58-PM-1.jpg',
  'Accurate gravimetric weighing of geochemical sieve splits using digital balance inside field mobile laboratory.',
  'instruments',
  'Digital precision balance weighing geochemical sample pouch',
  0,
  61,
  'Mobile Exploration Laboratory',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-62',
  'Field Notebook Structural Data Entry at Outcrop',
  'https://i.ibb.co/S4dscbry/Whats-App-Image-2026-10-23-at-9-22-57-PM-3.jpg',
  'Field geologist recording joint orientations, dip measurements, and stratigraphic descriptions at rock cut.',
  'team',
  'Geologist writing structural field data into waterproof geological field book',
  0,
  62,
  'Road Cutting Structural Profile',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-63',
  'Borehole Rotary Bit Rotation and Mud Circulation Pit',
  'https://i.ibb.co/N2ZRSH97/Whats-App-Image-2026-10-23-at-9-22-57-PM-1.jpg',
  'Mud rotary drilling in progress with circulating bentonite drilling fluids cooling the tricone bit and removing cuttings.',
  'groundwater',
  'Drilling fluid circulation pit with rock cuttings beside rotary drilling rig',
  1,
  63,
  'Deep Aquifer Hydrogeological Well',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-64',
  'Resistivity Electrode Layout and Ground Contact Inspection',
  'https://i.ibb.co/Df0n9KMq/Whats-App-Image-2026-10-23-at-9-22-57-PM.jpg',
  'Geophysicist verifying stainless steel current electrodes and contact resistance along sounding traverse line.',
  'geophysics',
  'Field geophysicist checking steel electrode ground contact in survey layout',
  0,
  64,
  'Groundwater Siting Traverse Grid',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-65',
  'Geological Field Map Review and Traverse Planning',
  'https://i.ibb.co/v47tFNKL/Whats-App-Image-2026-10-23-at-9-22-56-PM.jpg',
  'Senior consultants and field crew reviewing regional geological sheet and satellite maps on vehicle hood.',
  'team',
  'Geologists gathering around topographic map spread on vehicle hood',
  0,
  65,
  'Regional Reconnaissance Basepoint',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-66',
  'River Alluvial Gravel Bed Stratification Inspection',
  'https://i.ibb.co/0pBVYpkN/Whats-App-Image-2026-10-23-at-9-22-54-PM-2.jpg',
  'Inspection of active alluvial gravel layers to target prospective heavy mineral and placer accumulations.',
  'geology',
  'Layered alluvial gravels and river sediments along active watercourse',
  0,
  66,
  'Placer Mineral Exploration Sector',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-67',
  'Schlumberger Array Vertical Electrical Sounding (VES)',
  'https://i.ibb.co/604pqSkJ/Whats-App-Image-2026-10-23-at-9-22-54-PM-1.jpg',
  'GiniBen geophysical team operating Schlumberger configuration to map deep weathered zone and fractured bedrock.',
  'geophysics',
  'Geophysicists taking sounding measurements with terrameter along survey line',
  0,
  67,
  'Hydrogeological Exploration Corridor',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-68',
  'High-Pressure Airlift Well Development Operation',
  'https://i.ibb.co/qFCmTfKp/Whats-App-Image-2026-10-23-at-9-22-54-PM.jpg',
  'Compressed air surging surging fine sands and rock flour from drilled borehole to maximize aquifer yield.',
  'groundwater',
  'Violent air and water surge emerging from borehole casing during airlift development',
  0,
  68,
  'Community Water Project Borehole',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-69',
  'Benched Granite Quarry Face and Joint Evaluation',
  'https://i.ibb.co/Jjr33Smf/Whats-App-Image-2026-10-23-at-9-22-53-PM-1.jpg',
  'Engineered multi-level quarry benching demonstrating stable slope geometry and massive granitic formation.',
  'geology',
  'Stepped quarry rock benches exposing solid crystalline granite deposit',
  0,
  69,
  'Commercial Granite Quarry Face',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-70',
  'Standardized Brass Sieve Stack for Sediment Sizing',
  'https://i.ibb.co/xtdwjZbK/Whats-App-Image-2026-10-23-at-9-22-53-PM.jpg',
  'Laboratory grade stacked brass sieves used in field base to partition stream sediments into analytical fractions.',
  'instruments',
  'Stack of circular brass sieves on field table for grain size fractionation',
  0,
  70,
  'Basecamp Sample Processing Station',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-71',
  'Multi-Parameter Water Quality Tester Calibration',
  'https://i.ibb.co/Fq59dqMT/Whats-App-Image-2026-10-23-at-9-22-52-PM-1.jpg',
  'Digital multiparameter sensor calibrating pH, electrical conductivity (EC), and TDS for groundwater baseline data.',
  'instruments',
  'Handheld water quality tester with probe immersed in test solution',
  0,
  71,
  'Water Scheme Quality Assurance Station',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-72',
  'Fault Contact and Stratigraphic Displacement Analysis',
  'https://i.ibb.co/RTyj3sr8/Whats-App-Image-2026-10-23-at-9-22-52-PM.jpg',
  'Field geologist detailing brittle fault zone causing displacement between sedimentary lithologic units.',
  'geology',
  'Geologist pointing to sharp structural fault line in layered rock wall',
  1,
  72,
  'Sedimentary Basin Structural Outcrop',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-73',
  'Optical Level and Survey Prism Elevation Traversing',
  'https://i.ibb.co/G45M6D4f/Whats-App-Image-2026-10-23-at-9-22-51-PM-1.jpg',
  'Survey technician leveling instrument along boreline to establish precise topographic elevations for hydraulic modeling.',
  'team',
  'Survey technician with leveling staff and prism in open survey field',
  0,
  73,
  'Water Transmission Line Corridor',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-74',
  'Heavy-Duty Reticulation Valve Chamber and Manifold',
  'https://i.ibb.co/Fqytr3Dp/Whats-App-Image-2026-10-23-at-9-22-51-PM.jpg',
  'Underground valve pit installation with gate valves, non-return valves, and distribution headers for municipal water flow.',
  'groundwater',
  'Engineered concrete valve chamber with high-pressure water distribution pipework',
  0,
  74,
  'Municipal Water Reticulation Scheme',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-75',
  'Twilight Rig Operations on Deep Hydrogeological Well',
  'https://i.ibb.co/nMbp0RQq/Whats-App-Image-2026-10-23-at-9-22-50-PM.jpg',
  'Continuous 24-hour rotary drilling operation advancing downhole drill string into deep artesian aquifer.',
  'groundwater',
  'Rotary drilling rig operating under evening sky with floodlights active',
  0,
  75,
  'Deep Artesian Exploration Wellfield',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-76',
  'Undisturbed Soil Profile Logging in Deep Trial Pit',
  'https://i.ibb.co/rRmjCdW6/Whats-App-Image-2026-10-23-at-9-22-47-PM.jpg',
  'Detailed pedological horizon logging documenting soil cohesion, gravel content, and plasticity down to bedrock.',
  'geology',
  'Vertical walls of deep trial pit showing distinct stratigraphic soil layers',
  0,
  76,
  'Geotechnical Foundation Exploration Pit',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-77',
  'Wireline Core Barrel Retrieval and Rock Core Recovery',
  'https://i.ibb.co/N60pM2wF/Whats-App-Image-2026-10-23-at-9-22-41-PM.jpg',
  'Drill crew extracting core barrel from borehole containing pristine cylindrical rock core for laboratory testing.',
  'groundwater',
  'Drilling crew hoisting wireline core barrel containing intact rock core sample',
  0,
  77,
  'Mineral Exploration Core Drilling Rig',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-78',
  'Geochemical Sample Batch Air-Drying and Cataloging',
  'https://i.ibb.co/xqvR4q7W/Whats-App-Image-2026-10-23-at-9-22-40-PM.jpg',
  'Systematic air-drying of sealed geochemical sample envelopes under camp awning prior to laboratory pulverization.',
  'geology',
  'Labeled geochem sample envelopes laid out uniformly on drying racks',
  0,
  78,
  'Exploration Basecamp QA/QC Yard',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-79',
  'Field Sediment Preparation and Mesh Fractionation',
  'https://i.ibb.co/xtdwjZbK/Whats-App-Image-2026-10-23-at-9-22-53-PM.jpg',
  'Controlled particle size grading of bulk stream gravels using nesting screens to isolate heavy pathfinder minerals.',
  'instruments',
  'Sieving equipment and pans used for granulometric mineral separation',
  0,
  79,
  'Fieldwork Geochemical Station',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-80',
  'Outcrop Examination and Vein Structure Correlation',
  'https://i.ibb.co/RTt4xdhN/Whats-App-Image-2026-10-23-at-9-06-28-PM.jpg',
  'Geoscientists evaluating structural trends, mineralized shears, and fault kinematics on exposed hillside outcrop.',
  'team',
  'Field team inspecting fractured bedrock outcrop with geological equipment',
  0,
  80,
  'Highland Geological Contact Zone',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-81',
  'Heavy-Duty Drill Rig Transportation and Pad Access',
  'https://i.ibb.co/VpJyn1Kd/Whats-App-Image-2026-10-23-at-9-05-54-PM.jpg',
  'Mobilization of all-wheel-drive drilling rig transporter negotiating rugged terrain to reach remote exploration location.',
  'groundwater',
  'Heavy exploration drilling truck parked on prepared remote well pad',
  0,
  81,
  'Remote Hydrogeological Exploration Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-82',
  'High-Torque Hydraulic Breakout Wrench Coupling',
  'https://i.ibb.co/HDg6v6dn/Whats-App-Image-2026-10-23-at-9-05-42-PM.jpg',
  'Rig operators utilizing hydraulic breakout wrenches to tighten heavy drill string couplings under high pressure.',
  'groundwater',
  'Hydraulic breakout wrench mechanism securing drill stem on rig deck',
  0,
  82,
  'Production Borehole Drilling Operations',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-83',
  'Standard Penetration Test (SPT) Sampler Preparation',
  'https://i.ibb.co/y1XKPqv/Whats-App-Image-2026-10-23-at-9-05-41-PM.jpg',
  'Geotechnical team assembling split-barrel sampler and drive rods for standard penetration testing in boreholes.',
  'geophysics',
  'Geotechnical technician inspecting split spoon sampler for in-situ soil density',
  0,
  83,
  'Infrastructure Geotechnical Investigation Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-84',
  'Wet Sieve Processing of Stream Sediments',
  'https://i.ibb.co/d0grTtvr/Whats-App-Image-2026-10-23-at-9-05-31-PM.jpg',
  'Field geologist washing and sizing coarse sediment in running water to concentrate high-density mineral fractions.',
  'geology',
  'Geologist washing stream sediments through sieve pan in flowing river',
  0,
  84,
  'Drainage Basin Geochemical Traverse',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-85',
  'Schistosity and Mineral Vein Orientation Mapping',
  'https://i.ibb.co/h1YdYYSv/Whats-App-Image-2026-10-23-at-9-05-26-PM.jpg',
  'Close geological mapping of foliation trends, crenulation cleavage, and quartz ribbons in metamorphic basement.',
  'geology',
  'Metamorphic rock face exhibiting foliation and folded quartz veinlets',
  1,
  85,
  'Metamorphic Basement Complex Zone',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-86',
  'High-Capacity Air Compressor Rig Hookup',
  'https://i.ibb.co/8gv2QFC1/Whats-App-Image-2026-10-23-at-9-05-25-PM.jpg',
  'Industrial high-CFM screw compressor feeding continuous high-pressure air for Down-The-Hole (DTH) percussion drilling.',
  'groundwater',
  'High pressure mobile compressor supplying air lines to drilling rig',
  0,
  86,
  'Hard Rock Drilling Well Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-87',
  'Heavy Mineral Concentrate Recovery in Gold Pan',
  'https://i.ibb.co/fdX9gcH5/Whats-App-Image-2026-10-23-at-9-05-20-PM-1.jpg',
  'Dense black mineral concentrate and heavy oxides separated from river sands using traditional gravitational panning.',
  'geology',
  'Heavy mineral black sands concentrated in the rim of panning basin',
  0,
  87,
  'Placer Heavy Mineral Stream Survey',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-88',
  'Geophysical Sounding Cable Reel and Connector Box',
  'https://i.ibb.co/ksTNqDv9/Whats-App-Image-2026-10-23-at-9-05-20-PM.jpg',
  'High-durability cable spools and multi-pin connector harness deployed for high-density 2D resistivity imaging.',
  'geophysics',
  'Cable reels and electrical connector box set up for resistivity survey',
  0,
  88,
  'Geophysical Siting Grid',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-89',
  'Solar Photovoltaic Array on Pump House Structure',
  'https://i.ibb.co/bRLKqB3b/Whats-App-Image-2026-10-23-at-9-05-19-PM.jpg',
  'High-efficiency monocrystalline solar panels mounted on security pump shelter powering submersible borehole pump.',
  'groundwater',
  'Solar panel array mounted securely atop reinforced concrete pump house',
  0,
  89,
  'Off-Grid Turnkey Water Facility',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-90',
  'Excavator Access Road Construction and Bench Cut',
  'https://i.ibb.co/bVLyVQK/Whats-App-Image-2026-10-23-at-9-05-15-PM.jpg',
  'Tracked heavy excavator clearing steep access road and grading benches on remote exploration concession.',
  'geology',
  'Excavator cutting slope bench along hillside access road',
  0,
  90,
  'Concession Infrastructure Access Road',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-91',
  'GPS Coordinate Acquisition and Waypoint Cataloging',
  'https://i.ibb.co/KxCZJ6qs/Whats-App-Image-2026-10-23-at-9-05-14-PM-1.jpg',
  'Field geologist capturing high-accuracy geographic coordinates at strategic geochemical sample location.',
  'team',
  'Geologist using GPS receiver and entering waypoint data in field',
  0,
  91,
  'Exploration Traverse Checkpoint',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-92',
  'Sedimentary Cross-Bedding and Sandstone Cliff Face',
  'https://i.ibb.co/Pv3MXSbC/Whats-App-Image-2026-10-23-at-9-05-14-PM.jpg',
  'Prominent planar cross-bedding and depositional structures exposed on steep sandstone escarpment.',
  'geology',
  'Massive sandstone cliff wall showing detailed depositional cross-bedding',
  0,
  92,
  'Sedimentary Formation Escarpment',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-93',
  'Field Electrical Resistivity Data Quality Audit',
  'https://i.ibb.co/JjNdP9WN/Whats-App-Image-2026-10-23-at-9-05-12-PM-1.jpg',
  'Geophysicist verifying apparent resistivity curves and repeatability metrics in the field to eliminate noise.',
  'geophysics',
  'Geophysicist analyzing sounding curves on field clipboard',
  0,
  93,
  'Resistivity Quality Control Point',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-94',
  'Heavy-Duty Submersible Pump Lowering and Setting',
  'https://i.ibb.co/DgkdL29c/Whats-App-Image-2026-10-23-at-9-05-11-PM.jpg',
  'Installation of multi-stage stainless steel submersible pump and drop pipes into production borehole casing.',
  'groundwater',
  'Field team lowering stainless steel submersible pump into borehole',
  0,
  94,
  'Water Scheme Production Well',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-95',
  'Four-Wheel-Drive Field Vehicle on Regional Traverse',
  'https://i.ibb.co/0ytGqZM4/Whats-App-Image-2026-10-23-at-9-05-10-PM.jpg',
  'All-terrain field logistics vehicle transporting specialized sampling gear across rugged mineral concession corridors.',
  'team',
  '4x4 exploration utility vehicle navigating rocky terrain in rural project area',
  0,
  95,
  'Regional Exploration Corridor',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-96',
  'Stratified Limestone Quarry Bench and Resource Assessment',
  'https://i.ibb.co/6QdvJCq/Whats-App-Image-2026-10-23-at-9-05-04-PM.jpg',
  'Massive bedded limestone deposit under geological quantification for industrial cement grade evaluation.',
  'geology',
  'High quarry cliff face displaying thick horizontal limestone strata',
  1,
  96,
  'Commercial Limestone Reserve, Ohafia',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-97',
  'V-Notch Weir Aquifer Discharge Discharge Measurement',
  'https://i.ibb.co/V1w2SVK/Whats-App-Image-2026-10-23-at-9-04-59-PM-1.jpg',
  'Precision volumetric water yield monitoring using calibrated 90-degree V-notch sharp-crested weir plate.',
  'instruments',
  'Water flowing over 90 degree V-notch weir with measuring staff',
  0,
  97,
  'Hydrogeological Flow Testing Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-98',
  'Mud Rotary Mud Mixing and Bentonite Hydration System',
  'https://i.ibb.co/dsQdTqF8/Whats-App-Image-2026-10-23-at-9-04-58-PM-2.jpg',
  'Continuous high-shear mixing of bentonite drilling mud to stabilize borehole walls during drilling in loose sands.',
  'groundwater',
  'Bentonite mud mixing hopper and circulating mud tanks beside rig',
  0,
  98,
  'Sedimentary Aquifer Borehole Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-99',
  'Geotechnical Trial Pit Soil Stratigraphy Profiling',
  'https://i.ibb.co/yBbWDvCR/Whats-App-Image-2026-10-23-at-9-04-58-PM-1.jpg',
  'In-situ logging of shear strength, soil moisture, and horizon boundaries in exploratory geotechnical trial pit.',
  'geology',
  'Geoscientist in trial pit inspecting soil cohesion and profile boundaries',
  0,
  99,
  'Geotechnical Trial Pit Grid',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-100',
  'Panoramic Highland Sandstone Ridge Escarpment',
  'https://i.ibb.co/zh3C9tbT/Whats-App-Image-2026-10-23-at-9-04-56-PM.jpg',
  'Panoramic geological survey across Udi escarpment highlighting regional dip slopes and structural contact planes.',
  'geology',
  'Broad landscape of sandstone ridge cliffs and wooded exploration terrain',
  0,
  100,
  'Highland Ridge Concession Area',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-101',
  'Consultant Team Outcrop Structural Logging Session',
  'https://i.ibb.co/TB2BV6QR/Whats-App-Image-2026-10-23-at-9-04-55-PM.jpg',
  'Dr. Ben Ukwuteyinor leading field geologists during detailed strike, dip, and joint frequency mapping at road cut.',
  'team',
  'Dr. Ben Ukwuteyinor and team examining structural rock exposures along roadside',
  0,
  101,
  'Ngwo Uno Escarpment Transect, Enugu',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-102',
  'Rotary Rig Derrick Hoisting and Kelly Bar Engagement',
  'https://i.ibb.co/fdkK6DqF/Whats-App-Image-2026-10-23-at-9-04-53-PM.jpg',
  'Heavy drill rig mast hoisting drill pipe string to initiate downhole rotary penetration into formation.',
  'groundwater',
  'High derrick mast with heavy kelly bar and rotary swivel mechanism',
  0,
  102,
  'Groundwater Exploration Drilling Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-103',
  'Production Well High-Volume Clear Water Discharge',
  'https://i.ibb.co/spHX4r3b/Whats-App-Image-2026-10-23-at-9-04-48-PM.jpg',
  'Final well testing stage showing crystal-clear groundwater discharging at high continuous flow rate without sediment.',
  'groundwater',
  'Torrent of clean clear potable water gushing from pump test pipe',
  1,
  103,
  'Commissioned Production Well Site',
  1,
  1,
  1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-104',
  'Completed Solar-Powered Water Scheme Facility',
  'https://i.ibb.co/chxd1T9M/Whats-App-Image-2026-10-23-at-9-04-40-PM.jpg',
  'Turnkey solar borehole facility featuring high-capacity steel tower, solar pump array, and public dispensing apron.',
  'groundwater',
  'Comprehensive turnkey solar water project with tank tower and solar panels',
  1,
  104,
  'Community Solar Water Project, Enugu State',
  1,
  1,
  1
);
