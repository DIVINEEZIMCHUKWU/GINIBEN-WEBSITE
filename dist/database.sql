-- =============================================================================
-- GiniBen & Partners GEOSERVICES LTD (ginibengeoservices.com)
-- Production MySQL Database Schema & Initial Data Seed
-- Target Environment: Truehost cPanel Hosting / phpMyAdmin / MySQL 5.7+ & 8.0+
-- Collation: utf8mb4_unicode_ci
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- -----------------------------------------------------------------------------
-- 1. Table structure for: company_settings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `company_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(64) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table structure for: gallery_images
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery_images` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `url` TEXT NOT NULL,
  `caption` TEXT DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'geology',
  `alt` VARCHAR(255) DEFAULT NULL,
  `is_hero` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `location` VARCHAR(255) DEFAULT NULL,
  `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_homepage` (`show_on_homepage`),
  KEY `idx_projects` (`show_on_projects`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table structure for: project_videos
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_videos` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `drive_view_url` TEXT NOT NULL,
  `drive_preview_url` TEXT NOT NULL,
  `thumbnail` TEXT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `is_vertical` TINYINT(1) NOT NULL DEFAULT 1,
  `orientation` VARCHAR(20) NOT NULL DEFAULT 'vertical',
  `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vid_homepage` (`show_on_homepage`),
  KEY `idx_vid_projects` (`show_on_projects`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table structure for: team_members
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `credentials` VARCHAR(255) DEFAULT NULL,
  `experience_years` VARCHAR(255) DEFAULT NULL,
  `affiliations_json` TEXT DEFAULT NULL,
  `bio` TEXT NOT NULL,
  `image` TEXT NOT NULL,
  `is_placeholder` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table structure for: consultation_enquiries
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `consultation_enquiries` (
  `id` VARCHAR(64) NOT NULL,
  `reference_number` VARCHAR(32) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64) DEFAULT NULL,
  `service_of_interest` VARCHAR(255) NOT NULL,
  `project_location` VARCHAR(255) DEFAULT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'reviewed', 'resolved') NOT NULL DEFAULT 'new',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enq_status` (`status`),
  KEY `idx_enq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- INITIAL DATA SEEDING
-- =============================================================================

-- Company Coordinates and Master Settings
INSERT INTO `company_settings` (`setting_key`, `setting_value`) VALUES
('name', 'GiniBen & Partners GEOSERVICES LTD'),
('tagline', 'Precision Beneath the Surface.'),
('domain', 'https://ginibengeoservices.com/'),
('phone', '+234 803 625 1405'),
('whatsappNumber', '+234 803 625 1405'),
('email', 'info@ginibengeoservices.com / benukwutevinor@yahoo.com / gpg1.geoservices@gmail.com'),
('address', '2 Leck Avenue, Adjacent State Police Headquarters GRA, Enugu, Enugu State, Nigeria'),
('otherAddress', '#3 Nnamani Street, Trans Ekulu, Enugu'),
('facebookUrl', 'https://www.facebook.com/share/19rQDUYSmo/?mibextid=wwXIfr'),
('linkedinUrl', 'https://www.linkedin.com/company/giniben-geoservices/'),
('admin_password', 'Giniben123')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- Team Members Seeding (with 25+ years and 20+ years preserved)
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations_json`, `bio`, `image`, `sort_order`) VALUES
('team-01', 'Dr. Benjamin Ukwuteyinor, PhD', 'Founder & Lead Consultant', 'Founder & Lead Consultant', 'PhD Applied Geophysics, COMEG, NMGS, IAIA certified', '25+ years of professional practice', '["Council of Mining Engineers and Geoscientists (COMEG)","Nigerian Mining and Geosciences Society (NMGS)","International Association for Impact Assessment (IAIA)"]', 'Dr. Benjamin Ukwuteyinor is an accomplished exploration geophysicist directing integrated mineral resource evaluations, hydrogeological investigations, deep industrial borehole engineering, and infrastructure geophysics across Nigeria and West Africa.', 'https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg', 1),
('team-02', 'Dr. Ezeugwu Innocent (Ph.D)', 'Principal Partner', 'Principal Partner', 'Ph.D, Principal Partner, Groundwater & Mineral Resources', '20+ years of professional practice', '["Principal Partner, Applied Geophysics & Groundwater Resources","COMEG Registered Geoscientist"]', 'Principal Partner overseeing high-volume groundwater engineering, subsurface characterization, and large-scale water treatment facility development across regional states.', 'https://i.ibb.co/0xNFG2Z/Whats-App-Image-2026-10-23-at-9-04-07-PM.jpg', 2),
('team-03', 'Ogechukwu Maryann Okeke', 'Geologist', 'Geologist', 'Geologist, Exploration & Structural Mapping', 'Active Field Exploration Geologist', '["Nigerian Mining and Geosciences Society (NMGS)","Field Exploration & Stratigraphy Specialist"]', 'Field geologist specializing in geological mapping, structural interpretation, mineral prospect evaluation, and sample recovery protocols.', 'https://i.ibb.co/vx8ytQDy/Whats-App-Image-2026-10-23-at-9-04-06-PM-1.jpg', 3),
('team-04', 'Alichi U. (Ph.D)', 'Senior Partner / Co-Developer', 'Senior Partner / Co-Developer', 'Ph.D, Environmental Hydrogeology & Co-Developer', 'Senior Partner Level', '["Environmental Management & Hydrogeology Specialist","Subsurface Hydrodynamics & Resource Evaluation"]', 'Senior Partner & Co-Developer leading environmental management planning, hydrodynamics, and sustainable water resources development.', 'https://i.ibb.co/XxpMK4xQ/Whats-App-Image-2026-10-23-at-9-04-06-PM.jpg', 4),
('team-05', 'Ekechi Mmaduabuchi', 'Geophysicist and Logistics Officer', 'Geophysicist and Logistics Officer', 'Exploration Geophysics & Field Logistics Operations', 'Field Operations & Logistics', '["Nigerian Mining and Geosciences Society (NMGS)","Applied Geophysics & Technical Logistics Lead"]', 'Exploration geophysicist directing logistical coordination, vertical electrical sounding (VES) data collection, equipment mobilization, and field operations safety.', 'https://i.ibb.co/1YhTdZ6w/IMG-20261023-WA0146.jpg', 5),
('team-06', 'Ama Agwu', 'Geologist / Field Coordinator', 'Geologist / Field Coordinator', 'Field Geology & Exploration Coordination', 'Field Geological Operations', '["Nigerian Mining and Geosciences Society (NMGS)","Structural Mapping & Field Oversight"]', 'Field geologist coordinating on-site exploration operations, structural geological logging, stratigraphic correlation, and technical field team management.', 'https://i.ibb.co/WvPD8W2S/IMG-20261023-WA0149.jpg', 6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `title` = VALUES(`title`), `experience_years` = VALUES(`experience_years`);

-- Field Recordings & Videos Seeding (14 Verified Records)
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES
('vid-drill-01', 'Rotary Borehole Drilling Operations', 'Deep Aquifer Siting & Continuous Mast Rotation', 'https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/view?usp=drive_link', 'https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/preview', 'https://i.ibb.co/fdkK6DqF/Whats-App-Image-2026-10-23-at-9-04-53-PM.jpg', 'Real-time field footage documenting heavy rotary drilling mast operation, hydraulic feed control, and borehole mud circulation on high-elevation concession.', 1, 'vertical', 1, 1, 1),
('vid-drill-02', 'Exploration Trenching & Saprolite Profiling', 'CAT Excavator Cutting Geological Trial Trench', 'https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/view?usp=drive_link', 'https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/preview', 'https://i.ibb.co/bVLyVQK/Whats-App-Image-2026-10-23-at-9-05-15-PM.jpg', 'Direct operational footage of heavy tracked excavator profiling lateritic overburden and exposing underlying weathered saprolite bedrock.', 1, 'vertical', 1, 1, 1),
('vid-drill-03', 'Downhole Drill Stem & Casing Installation', 'Rotary Mast Coupling & Hydrogeological Advancement', 'https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/view?usp=drive_link', 'https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/preview', 'https://i.ibb.co/HDg6v6dn/Whats-App-Image-2026-10-23-at-9-05-42-PM.jpg', 'On-site drilling personnel managing high-torque drill pipe couplings, casing shoe positioning, and downhole penetration monitoring.', 1, 'vertical', 1, 1, 1),
('vid-drill-04', 'High-Yield Borehole Pumping & Flow Testing', 'Aquifer Productivity & Transmissivity Validation', 'https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/view?usp=drive_link', 'https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/preview', 'https://i.ibb.co/spHX4r3b/Whats-App-Image-2026-10-23-at-9-04-48-PM.jpg', 'Field testing and step-drawdown pumping test verifying commercial water yield and clean discharge rate from industrial production borehole.', 1, 'vertical', 1, 1, 1),
('vid-drill-05', 'Geological Outcrop Structural Assessment', 'Highland Ridge Lithological & Joint Mapping', 'https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/view?usp=drive_link', 'https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/preview', 'https://i.ibb.co/TB2BV6QR/Whats-App-Image-2026-10-23-at-9-04-55-PM.jpg', 'Dr. Ben Ukwuteyinor directing technical field team during structural strike, dip measurement, and mineral vein logging across highland escarpment.', 1, 'vertical', 1, 1, 1),
('vid-drill-06', 'Geophysical Electrical Resistivity Survey', 'Multi-Electrode Vertical Electrical Sounding (VES)', 'https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/view?usp=drive_link', 'https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/preview', 'https://i.ibb.co/604pqSkJ/Whats-App-Image-2026-10-23-at-9-22-54-PM-1.jpg', 'Field geophysicists operating terrameter instrumentation to delineate subsurface resistivity layers and fracture corridors for deep borehole siting.', 1, 'vertical', 1, 1, 1),
('vid-drill-07', 'Geotechnical Trial Pit Profile Logging', 'In-Situ Soil Stratigraphy & Infiltration Evaluation', 'https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/view?usp=drive_link', 'https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/preview', 'https://i.ibb.co/yBbWDvCR/Whats-App-Image-2026-10-23-at-9-04-58-PM-1.jpg', 'Manual excavation of deep geotechnical trial pits to inspect layer cohesion, density, and depth to bedrock ahead of drilling and foundation works.', 1, 'vertical', 1, 1, 1),
('vid-drill-08', 'Subsurface Core Logging & Drilling Operations Archive', 'Comprehensive Subsurface Exploration Documentation', 'https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/view?usp=drive_link', 'https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/preview', 'https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg', 'Detailed operational capture of drilling rig logistics, diamond core recovery, ground validation, and engineering fieldwork executed by GiniBen personnel.', 1, 'vertical', 1, 1, 1),
('vid-drill-09', 'Turnkey Solar Water Scheme Infrastructure', 'Elevated Storage Tank & Public Water Dispenser', 'https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/view?usp=drive_link', 'https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/preview', 'https://i.ibb.co/chxd1T9M/Whats-App-Image-2026-10-23-at-9-04-40-PM.jpg', 'Operational inspection of completed solar-powered water scheme delivering potable water to local community.', 1, 'vertical', 1, 1, 1),
('vid-drill-10', 'Geochemical Stream Sediment Sieving & Sampling', 'Fractionation & Sample Envelope Verification', 'https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/view?usp=drive_link', 'https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/preview', 'https://i.ibb.co/d0grTtvr/Whats-App-Image-2026-10-23-at-9-05-31-PM.jpg', 'Standardized -80 mesh sieving of stream sediments along drainage channels for trace element pathfinder exploration.', 1, 'vertical', 1, 1, 1),
('vid-gal-11', 'Industrial Quarry Crushing & Conveyor Transport', 'Aggregate Plant Primary Jaw & Screening Circuit', 'https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/view?usp=drive_link', 'https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/preview', 'https://i.ibb.co/YTP1ZrMT/Whats-App-Image-2026-10-23-at-9-23-03-PM.jpg', 'Mechanical reduction of solid rock in primary jaw crusher and transfer via heavy-duty inclined conveyor gantries.', 1, 'vertical', 0, 1, 1),
('vid-gal-12', 'Alluvial Gold & Heavy Mineral Gravity Panning', 'Stream Bed Alluvial Sampling Protocol', 'https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/view?usp=drive_link', 'https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/preview', 'https://i.ibb.co/fdX9gcH5/Whats-App-Image-2026-10-23-at-9-05-20-PM-1.jpg', 'Sediment panning and recovery of heavy mineral concentrates in river gravels for mineral prospectivity analysis.', 1, 'vertical', 0, 1, 1),
('vid-gal-13', 'Exploration Concession Boundary Differential GPS Survey', 'Precision Perimeter Verification & Staking', 'https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/view?usp=drive_link', 'https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/preview', 'https://i.ibb.co/G45M6D4f/Whats-App-Image-2026-10-23-at-9-22-51-PM-1.jpg', 'Traversing boundary corner beacons with differential GPS to calibrate concession borders and survey transects.', 1, 'vertical', 0, 1, 1),
('vid-gal-14', 'Highland Escarpment Geological Reconnaissance', 'Topographical Elevation & Lithology Survey', 'https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/view?usp=drive_link', 'https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/preview', 'https://i.ibb.co/zh3C9tbT/Whats-App-Image-2026-10-23-at-9-04-56-PM.jpg', 'Comprehensive mapping of highland sandstone ridges and mineral contact zones across Udi plateau.', 1, 'vertical', 0, 1, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `drive_preview_url` = VALUES(`drive_preview_url`);

-- Fieldwork Images Seeding (24 Authentic Records)
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES
('img-01', 'Exploration Trenching & Trial Pit Excavation', 'https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg', 'Tracked CAT excavator cutting deep exploration trench for stratigraphic profiling and mineral vein exposure.', 'geology', 'Tracked hydraulic excavator digging deep trench in lateritic terrain', 1, 1, 1, 1, 1),
('img-02', 'Stratigraphic Horizon & Soil Profile Inspection', 'https://i.ibb.co/yngMcXWr/Whats-App-Image-2026-10-23-at-6-39-30-PM.jpg', 'Excavated trial trench exposing undisturbed vertical soil horizons and weathered basement contact.', 'geology', 'Undisturbed trial trench showing stratigraphical soil layers and basement contact', 1, 2, 1, 1, 1),
('img-03', 'CAT 225DLC Heavy Excavator in Trenching Operation', 'https://i.ibb.co/JFpB1MRs/Whats-App-Image-2026-10-23-at-6-39-31-PM-1.jpg', 'Hydraulic crawler excavator scooping laterite soil and weathered rock overburden along survey transect.', 'geology', 'CAT 225DLC excavator bucket scooping lateritic soil trench', 1, 3, 1, 1, 1),
('img-04', 'Geotechnical Trial Pit Depth & Soil Logging', 'https://i.ibb.co/tp4Sj6hz/Whats-App-Image-2026-10-23-at-6-39-31-PM-2.jpg', 'Field technician using calibrated yellow tape measure to record precise depth intervals of excavated test pit.', 'geophysics', 'Square test pit with yellow measuring tape recording excavation depth', 1, 4, 1, 1, 1),
('img-05', 'Excavation Pit Hardpan & Boulder Penetration', 'https://i.ibb.co/h1gTzjgy/Whats-App-Image-2026-10-23-at-6-39-31-PM.jpg', 'Excavator bucket breaking through compact lateritic hardpan and boulder horizons during trial pit advance.', 'geology', 'Hydraulic excavator bucket lifting boulder laterite from exploration trench', 1, 5, 1, 1, 1),
('img-06', 'Stream Sediment & Mineral Panning Sample Recovery', 'https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg', 'Geoscientist in safety gloves and gumboots pouring panned heavy mineral concentrates through funnel into sample packet for geochemical assay.', 'geology', 'Geoscientist with funnel and collection packet packaging stream sediment concentrates', 1, 6, 1, 1, 1),
('img-07', 'Active Alluvial Gold & Mineral Panning Transect', 'https://i.ibb.co/7dK2tq98/Whats-App-Image-2026-10-23-at-6-39-32-PM-2.jpg', 'Exploration team members washing stream sediments in river gravels using gravity gold pans to trace pathfinder mineral anomalies.', 'geology', 'Fieldworkers washing river gravel sediments in wide green and black panning dishes', 1, 7, 1, 1, 1),
('img-08', 'Hydraulic Rotary Borehole Rig Mast in Full Operation', 'https://i.ibb.co/Q3B1m9b8/Whats-App-Image-2026-10-23-at-6-39-32-PM.jpg', 'Heavy truck-mounted rotary drilling rig with vertical mast actively advancing industrial production borehole.', 'drilling', 'Truck mounted heavy hydraulic drilling rig with mast erected drilling deep borehole', 1, 8, 1, 1, 1),
('img-09', 'Trench Geological Inspection & Structural Mapping', 'https://i.ibb.co/sdPT6Zxq/Whats-App-Image-2026-10-23-at-6-39-33-PM-1.jpg', 'Lead consultant inspecting lateral exposed saprolite horizons inside exploration trench to measure strike and dip of quartz veins.', 'geology', 'Geologist standing inside trench inspecting sidewall lithology and fracture zones', 1, 9, 1, 1, 1),
('img-10', 'Heavy Excavator Profiling Lateritic Horizon', 'https://i.ibb.co/XZKjZ67T/Whats-App-Image-2026-10-23-at-6-39-33-PM-2.jpg', 'Close-up perspective of CAT excavator bucket precision slicing trial pit profile for engineering density logging.', 'geology', 'Excavator tooth bucket cutting sharp soil trench face', 1, 10, 1, 1, 1),
('img-11', 'Drill Mud Pit & Direct Circulation System', 'https://i.ibb.co/gLFDJ8yH/Whats-App-Image-2026-10-23-at-6-39-33-PM.jpg', 'Drill mud circulation pit collecting return fluid with polymer additives to stabilize borehole walls during rotary drilling.', 'drilling', 'Rectangular excavated mud pit with bentonite drilling fluid and suction hoses', 1, 11, 1, 1, 1),
('img-12', 'Rotary Mast Feed & Subsurface Advancement', 'https://i.ibb.co/rR48gB3J/Whats-App-Image-2026-10-23-at-6-39-34-PM-2.jpg', 'Drilling crew monitoring hydraulic pull-down cylinders and drill string rotary table on deep water borehole project.', 'drilling', 'Drill rig operator in high-vis vest operating hydraulic levers at rotary rig console', 1, 12, 1, 1, 1),
('img-13', 'Rotary Rig Mud Circulation & Cuttings Return', 'https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg', 'High-pressure mud pump discharging drill cuttings through conductor casing to examine lithological chip samples.', 'drilling', 'Mud discharge conduit flushing drill cuttings into settlement channels', 1, 13, 1, 1, 1),
('img-14', 'Downhole Drilling Tool Assembly & Casing Rig Logistics', 'https://i.ibb.co/v49s08h5/Whats-App-Image-2026-10-23-at-6-39-34-PM.jpg', 'Rig helpers preparing steel drill pipes and casing strings on rig bed for deployment into advancing borehole.', 'drilling', 'Drilling crew handling threaded drill pipe sections on rear rig deck', 1, 14, 1, 1, 1),
('img-15', 'Production Borehole Wellhead Continuous Flow Testing', 'https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg', 'Clear artesian aquifer discharge pumping continuously from newly drilled borehole during 24-hour yield test.', 'groundwater', 'High-volume crystalline water gushing from steel wellhead flange during aquifer pump test', 1, 15, 1, 1, 1),
('img-16', 'Borehole Discharge Channeling & Water Yield Measurement', 'https://i.ibb.co/Y4p0qFvG/Whats-App-Image-2026-10-23-at-6-39-37-PM-2.jpg', 'Discharge flume directing high-velocity water from production well to volumetric weir for step-drawdown calculation.', 'groundwater', 'Clean groundwater torrent flowing through calibrated discharge trench during pump test', 0, 16, 1, 1, 1),
('img-17', 'Deep Water Well Rig & Technical Crew on Concession', 'https://i.ibb.co/N64QG4Qx/Whats-App-Image-2026-10-23-at-6-39-37-PM.jpg', 'Heavy hydraulic exploration rig erected on remote highland drilling pad with technical field personnel.', 'drilling', 'High-mast drilling rig stationed on rural drilling site surrounded by technical crew', 0, 17, 1, 1, 1),
('img-18', 'Exploration Geologists with Structural Outcrop Specimen', 'https://i.ibb.co/5xb0hP0w/Whats-App-Image-2026-10-23-at-6-39-38-PM-1.jpg', 'GiniBen exploration geologists in field PPE examining freshly cleaved mineralized rock specimens on quarry escarpment.', 'geology', 'Two geoscientists in hard hats and safety vests inspecting hand specimen rock core', 0, 18, 1, 1, 1),
('img-19', 'Diamond Core Bit & Geological Specimen Examination', 'https://i.ibb.co/CpQtM2RW/Whats-App-Image-2026-10-23-at-6-39-41-PM-1.jpg', 'Lead geoscientist examining cylindrical rock specimen with hand lens to log lithological texture and grain boundary contacts.', 'geology', 'Geologist holding hand specimen inspecting mineral crystallization under field lens', 0, 19, 1, 1, 1),
('img-20', 'Electronic Total Station Precision Topographic Survey', 'https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg', 'Geomatics surveyor operating motorized electronic total station on heavy wooden tripod to establish ground control points.', 'instruments', 'Surveyor sighting through total station telescope mounted on tripod in open terrain', 0, 20, 1, 0, 1),
('img-21', 'Surveyor Operating Total Station Optical Alignment', 'https://i.ibb.co/B5D34t8g/Whats-App-Image-2026-10-23-at-6-39-42-PM.jpg', 'Close-up of total station optical eyepiece and digital angle readout during topographic boundary demarcation.', 'instruments', 'Survey technician fine-tuning leveling knobs and sighting target prism on total station', 0, 21, 1, 0, 1),
('img-22', 'Optical Prism Sighting & DGPS Concession Staking', 'https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg', 'Field engineer aligning reflector prism pole to record high-precision sub-centimeter coordinates on concession boundary.', 'instruments', 'Field technician holding yellow surveying pole with reflecting prism on quarry boundary', 0, 22, 1, 0, 1),
('img-23', 'Topographical Surveyor Traversing Hilly Terrain', 'https://i.ibb.co/6J15k85w/Whats-App-Image-2026-10-23-at-6-39-43-PM-1.jpg', 'Survey crew traversing steep undulating escarpment with precision EDM prism to generate digital elevation model (DEM).', 'instruments', 'Surveyor navigating hillside with surveying prism pole and GPS backpack', 0, 23, 1, 0, 1),
('img-24', 'Dr. Benjamin Ukwuteyinor in Technical Field Mapping', 'https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg', 'Dr. Benjamin Ukwuteyinor directing on-site exploration team during highland lithological strike and dip measurement.', 'team', 'Dr. Ben Ukwuteyinor in field safety gear holding geological notebook and compass', 0, 24, 1, 1, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `caption` = VALUES(`caption`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- End of database.sql
-- =============================================================================
