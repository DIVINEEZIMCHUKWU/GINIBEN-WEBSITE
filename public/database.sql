-- ============================================================================
-- GiniBen & Partners GEOSERVICES LTD (ginibengeoservices.com)
-- Comprehensive Truehost cPanel MySQL Production Database Schema & Seed Data
-- Automatically generated on: 2026-10-30T09:39:30.814Z
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ----------------------------------------------------------------------------
-- 1. GALLERY IMAGES TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `gallery_images`;
CREATE TABLE `gallery_images` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `url` TEXT NOT NULL,
  `caption` TEXT NULL,
  `category` VARCHAR(100) NOT NULL,
  `alt` VARCHAR(255) NULL,
  `is_hero` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `location` VARCHAR(255) NULL,
  `date` VARCHAR(50) NULL,
  `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_img_category` (`category`),
  INDEX `idx_img_order` (`sort_order`),
  INDEX `idx_img_gallery` (`show_on_gallery`),
  INDEX `idx_img_projects` (`show_on_projects`),
  INDEX `idx_img_home` (`show_on_homepage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. SERVICES TABLE (8 Official Practice Areas)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` VARCHAR(64) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `numeric_code` VARCHAR(20) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `detailed_scope` TEXT NOT NULL,
  `methods_deliverables` TEXT NOT NULL,
  `target_sectors` TEXT NOT NULL,
  `featured_image` TEXT NOT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. PROJECTS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` VARCHAR(64) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `category_key` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `cover_image` TEXT NOT NULL,
  `summary` TEXT NOT NULL,
  `methodology` TEXT NOT NULL,
  `key_deliverables` TEXT NOT NULL,
  `gallery_images` TEXT NOT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('Published', 'Archived', 'Draft') NOT NULL DEFAULT 'Published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. PROJECT VIDEOS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `project_videos`;
CREATE TABLE `project_videos` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NOT NULL,
  `drive_view_url` TEXT NOT NULL,
  `drive_preview_url` TEXT NOT NULL,
  `thumbnail` TEXT NOT NULL,
  `description` TEXT NOT NULL,
  `is_vertical` TINYINT(1) NOT NULL DEFAULT 1,
  `orientation` ENUM('vertical', 'horizontal') NOT NULL DEFAULT 'vertical',
  `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
  `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TEAM MEMBERS TABLE (Supports both affiliations and affiliations_json)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `team_members`;
CREATE TABLE `team_members` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `role` VARCHAR(150) NOT NULL,
  `credentials` VARCHAR(255) NOT NULL,
  `experience_years` VARCHAR(50) NOT NULL,
  `affiliations` TEXT NULL,
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
-- 6. CONSULTATION ENQUIRIES TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `enquiries`;
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

-- ----------------------------------------------------------------------------
-- 7. COMPANY SETTINGS TABLE
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED GALLERY IMAGES (116 Verified Field Records)
-- ============================================================================
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-01',
  'Outcrop Geological Mapping & Lithologic Strike Measurement',
  'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg',
  'Senior geoscientists measuring structural strike and dip on crystalline bedrock exposures in mineral concession.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Field geologists inspecting rock outcrop with structural compass and geological hammer',
  1,
  1,
  'Precambrian Mineral Belt, Nigeria',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-02',
  'Structural Strike & Dip Measurement with Clar Compass',
  'https://i.ibb.co/qYFRNWwV/IMG-20261030-WA0003.jpg',
  'Precise bedding and foliation plane measurements recorded for 3D structural model reconstruction.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Close-up of geological compass placed on planar foliation surface',
  0,
  2,
  'Field Transect Corridor',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-03',
  'Mineralized Quartz Vein Fracture Analysis in Crystalline Bedrock',
  'https://i.ibb.co/qLRqgd28/IMG-20261030-WA0004.jpg',
  'Inspection of secondary quartz-vein stockworks displaying visible sulfide mineral traces.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Silicified quartz vein cross-cutting metamorphic country rock',
  0,
  3,
  'Exploration Concession Zone',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-04',
  'Systematic Geological Traverse & Field Observation Post',
  'https://i.ibb.co/6960b5V/IMG-20261030-WA0005.jpg',
  'Mapping geologists logging lithostratigraphic variations along a 5-kilometer reconnaissance traverse.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Field geology team traversing rugged lateritic terrain',
  0,
  4,
  'Regional Exploration Block',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-05',
  'Basement Complex Joint Orientation & Discontinuity Survey',
  'https://i.ibb.co/27P0pMqG/IMG-20261030-WA0006.jpg',
  'Recording systematic joint sets and orthogonal fracturing for structural control analysis.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Geologist measuring vertical fracture spacing with steel scale',
  0,
  5,
  'Basement Complex Exposure',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-06',
  'Field Rock Exposure & Stratigraphic Contact Logging',
  'https://i.ibb.co/yzZCbNH/IMG-20261030-WA0007.jpg',
  'Delineating boundary contact between schistose metasediments and intrusive granitic pluton.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Sharp lithological contact between granite and schist rock',
  0,
  6,
  'Metamorphic Belt Sector',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-07',
  'Field Geologist Inspecting Massive Mineralized Outcrop',
  'https://i.ibb.co/CsHJChq7/IMG-20261030-WA0008.jpg',
  'In-situ examination of weathered gossanous caps and ironstone encrustations.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Geoscientist examining weathered iron-rich gossan with 20x hand lens',
  0,
  7,
  'Gossan Exploration Target',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-08',
  'Bedrock Shearing & Fold Axis Field Documentation',
  'https://i.ibb.co/jksS237N/IMG-20261030-WA0009.jpg',
  'Mapping asymmetric micro-folds and shear zone fabric indicative of regional tectonic stress.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Folded quartz-mica schist outcrop with prominent crenulation cleavage',
  0,
  8,
  'Shear Zone Corridor',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-09',
  'Geological Mapping Transect & GPS Coordinate Pinpointing',
  'https://i.ibb.co/G4jFS2wJ/IMG-20261030-WA0010.jpg',
  'Differential GPS coordinates recorded simultaneously with outcrop geological descriptions.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Handheld GPS navigation check at remote geological field station',
  0,
  9,
  'Field Station 42',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-10',
  'Petrographic Sample Chip Selection from Fresh Exposures',
  'https://i.ibb.co/9mJW2QZR/IMG-20261030-WA0011.jpg',
  'Recovering unweathered representative rock specimens for thin-section optical microscopy.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Geologist chipping fresh rock sample with hardened chisel hammer',
  0,
  10,
  'Bedrock Quarry Outcrop',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-11',
  'Foliation Strike & Metamorphic Fabric Field Evaluation',
  'https://i.ibb.co/GvgYzGYX/IMG-20261030-WA0012.jpg',
  'Plotting structural trend vectors on topographic field map sheets for strike continuity verification.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Geological map clipboard with plotted orientation symbols',
  0,
  11,
  'Field Basecamp',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-12',
  'Lithostratigraphic Boundary Tracing across Concession',
  'https://i.ibb.co/qFjLCrrM/IMG-20261030-WA0013.jpg',
  'Ground-truthing satellite remote sensing anomalies through physical ground contact mapping.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Field geologists cross-referencing satellite image with ground terrain',
  0,
  12,
  'Concession West Perimeter',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-13',
  'Regional Field Exploration Team on Outcrop Mapping Campaign',
  'https://i.ibb.co/gM8KVFYS/IMG-20261030-WA0014.jpg',
  'Full GiniBen geological exploration crew deployed for regional concession evaluation.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Team of geologists equipped with PPE and field packs on rocky summit',
  0,
  13,
  'Highland Survey Ridge',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-14',
  'Heavy Duty Rotary Borehole Drilling Rig Deployment',
  'https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg',
  'Hydraulic mast erection and drilling rig stabilization for deep industrial groundwater exploration.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Heavy duty truck-mounted drilling rig with vertical mast raised',
  1,
  14,
  'Industrial Water Project Site',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-15',
  'Deep Aquifer Drill Stem Assembly & Rotary Penetration',
  'https://i.ibb.co/9HrCtyrv/IMG-20261030-WA0015.jpg',
  'Continuous rotational drilling with tricone bit through consolidated sedimentary formations.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Rotary drill table turning drill rods into borehole collar',
  0,
  15,
  'Aquifer Development Site',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-16',
  'Rotary Rig Mud Circulation & Cuttings Return Channel',
  'https://i.ibb.co/0jYMN8Xz/IMG-20261030-WA0016.jpg',
  'Drilling fluid carrying lithologic cuttings to settling pits for real-time stratigraphical sampling.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Borehole mud return flow carrying rock chips along ditch',
  0,
  16,
  'Drilling Circulation Pits',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-17',
  'Borehole Mud Pit Excavation & Bentonite Mixing System',
  'https://i.ibb.co/kf2xsdS/IMG-20261030-WA0017.jpg',
  'Preparing high-yield bentonite drilling fluid to maintain hole stability and prevent wall collapse.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Engineers preparing drilling mud in earthen circulation tanks',
  0,
  17,
  'Drilling Pad Setup',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-18',
  'Subsurface Casing String Preparation & Alignment',
  'https://i.ibb.co/9kr27gzF/IMG-20261030-WA0018.jpg',
  'Factory-slotted uPVC borehole screen and blind casings measured and coupled for downhole lowering.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'uPVC well casing pipes stacked on drilling staging platform',
  0,
  18,
  'Borehole Collar Zone',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-19',
  'High-Pressure Down-the-Hole (DTH) Hammering Advance',
  'https://i.ibb.co/6cHMj26M/IMG-20261030-WA0019.jpg',
  'Air percussion hammer penetrating unweathered crystalline igneous basement at rapid penetration rates.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Air exhaust blowing dust and rock chips from borehole collar during DTH drilling',
  0,
  19,
  'Basement Borehole Siting',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-20',
  'Borehole Well Screen & Gravel Pack Installation Setup',
  'https://i.ibb.co/SXVT0mCc/IMG-20261030-WA0020.jpg',
  'Graded silica gravel envelope placed around well screens to filter fine sand from the aquifer.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Washed river silica gravel bags being introduced downhole annulus',
  0,
  20,
  'Water Well Installation',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-21',
  'Compressor Air-Lift Flushing & Well Development',
  'https://i.ibb.co/1tBv9HR5/IMG-20261030-WA0021.jpg',
  'High-capacity air compressor blowing drilling fines and mud cake to maximize aquifer permeability.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Turbulent geyser of groundwater and air discharging from borehole casing',
  0,
  21,
  'Well Development Phase',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-22',
  'Continuous Air Flushing Yielding Clean Aquifer Water',
  'https://i.ibb.co/d4ZDyLm8/IMG-20261030-WA0022.jpg',
  'Clear water discharge emerging after intensive dual-tube air-lift development operations.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Crystal clear water stream discharging from borehole pipe onto ground',
  0,
  22,
  'Well Testing Sector',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-23',
  'Discharge Flow Rate Gauging & Suspended Sediment Cleansing',
  'https://i.ibb.co/1J2pyfGQ/IMG-20261030-WA0023.jpg',
  'Measuring preliminary flow volume using V-notch weir and calibrated collection vessels.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Technician gauging water flow rate with digital timer and bucket',
  0,
  23,
  'Discharge Measuring Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-24',
  'Submersible Pump Installation & Downhole Electric Cable Tie',
  'https://i.ibb.co/tpbcLMD6/IMG-20261030-WA0024.jpg',
  'Lowering multi-stage stainless steel submersible pump on heavy-duty uPVC riser pipes.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Installation crew lowering submersible pump motor into borehole mouth',
  0,
  24,
  'Pump Installation Site',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-25',
  'Production Well Head Capping & Sanitary Apron Casting',
  'https://i.ibb.co/zHrmJ6VB/IMG-20261030-WA0025.jpg',
  'Forming reinforced concrete apron around wellhead to prevent surface water runoff contamination.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Cast concrete sanitary seal pad around steel borehole casing',
  0,
  25,
  'Sanitary Protection Zone',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-26',
  'Aquifer Constant Rate Pumping Test & Drawdown Monitoring',
  'https://i.ibb.co/tMncDnnN/IMG-20261030-WA0026.jpg',
  '24-hour continuous pumping test with electric contact dipmeter measuring aquifer recovery curves.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Hydrogeologist recording water level drawdown readings with electric water dipmeter',
  0,
  26,
  'Hydrogeological Testing Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-27',
  'Industrial Groundwater Reticulation Manifold Connection',
  'https://i.ibb.co/kVQW6TW4/IMG-20261030-WA0027.jpg',
  'Plumbing pressure valves, flowmeter, and check valves into facility distribution mains.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'High-pressure galvanized pipe manifold with flow meter and isolation valves',
  0,
  27,
  'Facility Water Network',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-28',
  'Community Water Supply Standpipe & Valve Chamber Setup',
  'https://i.ibb.co/N6twTKHt/IMG-20261030-WA0028.jpg',
  'Construction of durable multi-tap dispensing facility for rural community water schemes.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Masonry valve box and distribution pipe network for public standpost',
  0,
  28,
  'Community Water Scheme',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-29',
  'Potable Water Chemistry Quality Assurance & In-Situ Testing',
  'https://i.ibb.co/fYMrymrK/IMG-20261030-WA0029.jpg',
  'Digital testing of electrical conductivity, total dissolved solids, and pH before water commissioning.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Chemist dipping multi-parameter probe into water sample beaker',
  0,
  29,
  'Field Quality Test Post',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-30',
  'Completed Borehole Concrete Platform & Surrounding Drainage',
  'https://i.ibb.co/8nrgkSNd/IMG-20261030-WA0030.jpg',
  'Finished borehole infrastructure built to WHO standards with integrated drainage soakaway.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Completed clean concrete borehole headworks with secure steel lock cap',
  0,
  30,
  'Commissioned Wellsite',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-31',
  'High-Yield Groundwater Well Commissioning & Client Handover',
  'https://i.ibb.co/CsQfTmbm/IMG-20261030-WA0031.jpg',
  'Successful commissioning of high-discharge production well delivering clean potable water.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'GiniBen engineers and project sponsors celebrating successful clean water flow',
  0,
  31,
  'Project Handover Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-32',
  '2D Electrical Resistivity Tomography (ERT) Multi-Electrode Line',
  'https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg',
  'Deployment of multi-channel resistivity imaging line across target mineralized shear zone.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Geophysicist setting up multi-electrode array along straight transect',
  1,
  32,
  'Mineral Exploration Target Line',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-33',
  'Multi-Core Resistivity Cable Layout Across Exploration Grid',
  'https://i.ibb.co/bM2B4MXr/IMG-20261030-WA0033.jpg',
  'Laying calibrated takeout cables for automated Wenner-Schlumberger data acquisition.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Reel of geophysical multicore cable running through grassland transect',
  0,
  33,
  'Geophysical Survey Grid',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-34',
  'Stainless Steel Potential & Current Electrode Grounding',
  'https://i.ibb.co/TxWcfQ6p/IMG-20261030-WA0034.jpg',
  'Hammering corrosion-resistant steel stakes into soil for optimal electrical contact.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Field technician hammering metal electrode stake into dry laterite',
  0,
  34,
  'Electrode Station 18',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-35',
  'ABEM Terrameter / Resistivity Meter Station Calibration',
  'https://i.ibb.co/tMdbXFQR/IMG-20261030-WA0035.jpg',
  'Initializing central geophysical receiver for automated stacking and noise reduction testing.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Electronic geophysical console with digital LCD screen on folding field table',
  0,
  35,
  'Central Instrument Post',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-36',
  'High-Precision Induced Polarization (IP) Data Acquisition',
  'https://i.ibb.co/bMFKd3hR/IMG-20261030-WA0036.jpg',
  'Acquiring chargeability curves to identify disseminated metallic sulfide deposits at depth.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Digital Induced Polarization meter operating in time-domain acquisition mode',
  0,
  36,
  'Sulfide Target Line 4',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-37',
  'Ground Magnetometer Grid Profiling for Magnetic Ore Delineation',
  'https://i.ibb.co/dJHrfNgX/IMG-20261030-WA0037.jpg',
  'Proton magnetometer line survey measuring total magnetic field intensity anomalies.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Geophysicist carrying magnetometer sensor pole with chest console across survey grid',
  0,
  37,
  'Magnetic Survey Block',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-38',
  'Geophysical Survey Transect Layout through Forest Terrain',
  'https://i.ibb.co/JRwzMxb8/IMG-20261030-WA0038.jpg',
  'Clearing survey cut-lines through dense bush with GPS line-of-sight tracking.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Geophysical survey crew cutting straight survey line in wooded brush',
  0,
  38,
  'Concession Traverse Line',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-39',
  'Electrode Contact Resistance Measurement & Saline Salting',
  'https://i.ibb.co/tT4LFcSR/IMG-20261030-WA0039.jpg',
  'Minimizing contact resistance at dry rocky electrode stations with conductive saline solution.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Technician pouring saline electrolyte solution around grounded metal electrode',
  0,
  39,
  'Resistivity Line Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-40',
  'Schlumberger Vertical Electrical Sounding (VES) Spreading',
  'https://i.ibb.co/n8sFXNsV/IMG-20261030-WA0040.jpg',
  'Deep 1D sounding spreading current electrodes up to 1,000 meters for regional fracture detection.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Wide-spread cable drums and signal wire extended across expansive savanna',
  0,
  40,
  'Regional VES Sounding Point',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-41',
  'Real-Time Pseudosection Quality Control on Field Toughbook',
  'https://i.ibb.co/PshnhJ71/IMG-20261030-WA0041.jpg',
  'In-situ review of apparent resistivity pseudo-sections to verify anomalous conductor bodies.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Rugged field laptop showing color-contoured 2D resistivity pseudosection',
  0,
  41,
  'Field QC Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-42',
  'Dipole-Dipole Deep Mineralized Shear Zone Profiling',
  'https://i.ibb.co/LDcHjsnR/IMG-20261030-WA0042.jpg',
  'Configuring dipole-dipole array geometry for enhanced horizontal resolution and deep targeting.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Surveyor setting electrode spacing along marked coordinate flags',
  0,
  42,
  'Deep Exploration Grid',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-43',
  'Proton Precession Magnetic Sensor Height & Heading Check',
  'https://i.ibb.co/nMjnr1Rz/IMG-20261030-WA0043.jpg',
  'Calibrating magnetic base station to perform diurnal variation corrections on survey data.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Stationary base magnetometer setup on non-magnetic tripod stand',
  0,
  43,
  'Magnetic Base Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-44',
  'Electromagnetic (EM) Conductivity Mapping along Target Lines',
  'https://i.ibb.co/RmK7KZT/IMG-20261030-WA0044.jpg',
  'Frequency-domain electromagnetic profiling to map conductive fault corridors and clay zones.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Geophysicist walking survey line carrying sling-style EM conductivity transmitter and receiver',
  0,
  44,
  'EM Survey Profile',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-45',
  'Geophysical Field Crew Deploying Cable Spread on Concession',
  'https://i.ibb.co/HLw1CdLG/IMG-20261030-WA0045.jpg',
  'Coordinated fieldwork deployment operating safely under strict HSE protocols.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Field geophysical technicians in reflective high-vis vests along survey line',
  0,
  45,
  'Concession Line 12',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-46',
  'Apparent Resistivity Anomaly Verification & Repetition Run',
  'https://i.ibb.co/JjPm7nBf/IMG-20261030-WA0046.jpg',
  'Re-measuring anomalous data points to eliminate cultural noise and verify true bedrock targets.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Technician operating keyboard controls of digital resistivity receiver',
  0,
  46,
  'Target Anomaly 03',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-47',
  'Subsurface Resistivity Contrast Mapping for Gold Mineralization',
  'https://i.ibb.co/HLfXCq1n/IMG-20261030-WA0047.jpg',
  'Identifying resistive quartz reefs within conductive schistose shear zones for drilling targets.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Resistivity array crossing contact zone between distinct geological units',
  0,
  47,
  'Gold Exploration Sector',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-48',
  'GPS Differential Base Station for Geophysical Line Georeferencing',
  'https://i.ibb.co/v6CnPHFt/IMG-20261030-WA0048.jpg',
  'Sub-centimeter RTK GNSS receiver providing high-accuracy topography for terrain correction.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'High-precision GNSS antenna mounted on yellow surveying tripod',
  0,
  48,
  'Geodetic Control Point',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-49',
  'Comprehensive Geophysical Field Survey Team Debrief',
  'https://i.ibb.co/ch3qSLDL/IMG-20261030-WA0049.jpg',
  'Lead geophysicist reviewing daily raw data logs with field operators before basecamp departure.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Geophysics survey team gathered around field table reviewing data logs',
  0,
  49,
  'Field Base Operations',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-50',
  'Integrated Subsurface Inversion Model Cross-Section Evaluation',
  'https://i.ibb.co/nMNRQM6m/IMG-20261030-WA0050.jpg',
  'Iterative RES2DINV finite-element inversion model revealing subsurface lithology and fracture depths.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Detailed 2D resistivity inverted model cross-section showing depth slices and color resistivity contours',
  0,
  50,
  'Technical Interpretation Desk',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-51',
  'Diamond Core Drilling Rig Setup on Target Mineral Horizon',
  'https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg',
  'High-capacity diamond wireline core drill rig anchored for angled subsurface exploration hole.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Diamond core drilling rig with hydraulic chuck and inclined drilling mast',
  1,
  51,
  'Diamond Drill Collar 01',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-52',
  'Wireline Core Barrel Retrieval & Core Extraction',
  'https://i.ibb.co/6J4C3hF0/IMG-20261030-WA0052.jpg',
  'Overshot assembly retrieving inner core tube from 150m downhole depth without pulling drill rods.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Drillers uncoupling wireline inner tube from diamond drill string',
  0,
  52,
  'Drill Floor Operation',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-53',
  'Continuous HQ/NQ Rock Core Logging in Wooden Core Trays',
  'https://i.ibb.co/NnN3BD6x/IMG-20261030-WA0053.jpg',
  'Extracting complete cylindrical rock core cylinders into sequential wooden core boxes.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Freshly extracted rock core cylinders lying neatly inside labeled wooden core box',
  0,
  53,
  'Core Processing Pad',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-54',
  'High-Recovery Mineralized Solid Core Interval Documentation',
  'https://i.ibb.co/v6HcJkXS/IMG-20261030-WA0054.jpg',
  'Solid rock core demonstrating >98% core recovery rate through competent mineralized shear zone.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Continuous solid rock core sticks exhibiting mineral banding',
  0,
  54,
  'Core Inspection Shed',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-55',
  'Core Orientation Markings & Lithological Contact Inspection',
  'https://i.ibb.co/23vxMJPV/IMG-20261030-WA0055.jpg',
  'Drawing bottom-of-hole orientation lines and recording structural dip angles on core sticks.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Geologist marking orientation line on rock core cylinder with red grease pencil',
  0,
  55,
  'Logging Facility',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-56',
  'Rock Quality Designation (RQD) & Fracture Frequency Logging',
  'https://i.ibb.co/zVHgykf7/IMG-20261030-WA0056.jpg',
  'Measuring intact core pieces greater than 10cm to calculate geotechnical rock mass indices.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Geotechnical technician measuring core stick lengths with steel rule',
  0,
  56,
  'Geotechnical Logging Table',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-57',
  'Sulfide Mineralization Bands in Fresh Crystalline Drill Core',
  'https://i.ibb.co/Nd7XqS3q/IMG-20261030-WA0057.jpg',
  'Close-up macro inspection of pyrite, chalcopyrite, and galena mineralization within quartz vein core.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Glistening metallic sulfide grains embedded in cut diamond core specimen',
  0,
  57,
  'Mineral Evaluation Bench',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-58',
  'Diamond Core Cutting & Half-Core Sampling for Assay',
  'https://i.ibb.co/mVKHGprZ/IMG-20261030-WA0058.jpg',
  'Water-cooled diamond blade saw cutting core longitudinally for chain-of-custody laboratory dispatch.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Electric rock core saw cutting drill core in half along marked center line',
  0,
  58,
  'Core Cutting Workshop',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-59',
  'Systematic Core Box Labeling & Depth Interval Block Tagging',
  'https://i.ibb.co/LXHzq9KW/IMG-20261030-WA0059.jpg',
  'Inserting carved wooden depth blocks marking run start and end meters for accurate assay interval logging.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Wooden core box marked with hole ID, box number, and meter intervals',
  0,
  59,
  'Core Archive Section',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-60',
  'Specific Gravity Determination & Petrographic Core Analysis',
  'https://i.ibb.co/bjWpBJ1m/IMG-20261030-WA0060.jpg',
  'Measuring dry and submerged core weight to calculate accurate bulk density for reserve estimation.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Precision electronic balance with suspended water basket determining core density',
  0,
  60,
  'On-Site Mineral Lab',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-61',
  'Deep Exploration Diamond Drill String Rod Tripping',
  'https://i.ibb.co/jP7736b2/IMG-20261030-WA0061.jpg',
  'Drill crew hoisting 3m drill rods into mast tower during deep core drilling advancement.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Drillers in safety helmets handling heavy threaded steel drill rods on drilling platform',
  0,
  61,
  'Deep Exploration Drill Rig',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-62',
  'Core Yard Storage, Security & QA/QC Assay Sample Preparation',
  'https://i.ibb.co/xKs1R2Pf/IMG-20261030-WA0062.jpg',
  'Organized galvanized steel racks holding core inventory with inserted blank and standard control samples.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Covered core storage facility with rows of labeled core boxes on elevated racks',
  0,
  62,
  'GiniBen Core Storage Facility',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-63',
  'Active Stream Sediment Sampling & Mineral Grain Recovery',
  'https://i.ibb.co/mV7tX06H/IMG-20261030-WA0064.jpg',
  'Collecting fine sediment from natural hydraulic traps along river beds to delineate upstream mineralization.',
  'GEOCHEMICAL MAPPING',
  'Geochemist in waders scooping stream sediment with non-magnetic plastic trowel',
  1,
  63,
  'Drainage Basin Sampling Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-64',
  'Alluvial Heavy Mineral Panning at Drainage Intersections',
  'https://i.ibb.co/fGkN4tpj/IMG-20261030-WA0065.jpg',
  'Water panning of heavy minerals producing concentrated tails of gold, ilmenite, and cassiterite.',
  'GEOCHEMICAL MAPPING',
  'Gold pan displaying dense black sand concentrate and visible mineral specks',
  0,
  64,
  'Alluvial Stream Confluence',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-65',
  'Sieving & Fine Fraction Separation for Trace Element Assay',
  'https://i.ibb.co/0pHL4VzX/IMG-20261030-WA0066-1.jpg',
  'Stack of ASTM stainless steel sieves (-80 mesh) isolating uniform fine fraction for ICP-MS assay.',
  'GEOCHEMICAL MAPPING',
  'Field sieves separating fine silt and clay from coarse pebbles',
  0,
  65,
  'Sample Processing Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-66',
  'B-Horizon Soil Sampling Grid Layout across Shear Zone',
  'https://i.ibb.co/KcJppTpk/IMG-20261030-WA0067.jpg',
  'Systematic 50m x 200m soil sampling grid designed to detect dispersion halos over blind mineral bodies.',
  'GEOCHEMICAL MAPPING',
  'Surveyor placing marked wooden sample stake at soil grid coordinate',
  0,
  66,
  'Soil Geochemical Grid Block',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-67',
  'Soil Auger Core Extraction at 1.0m Uniform Depth',
  'https://i.ibb.co/Y4ZSC0md/IMG-20261030-WA0069.jpg',
  'Hand auger sampling past humus and organic surface wash down to undisturbed residual B-horizon clay.',
  'GEOCHEMICAL MAPPING',
  'Technician turning manual Dutch soil auger into subsoil horizon',
  0,
  67,
  'Soil Sample Station 104',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-68',
  'Geochemical Sample Bagging, Sealing & Barcode Cataloging',
  'https://i.ibb.co/v6KYyz6c/IMG-20261030-WA0070.jpg',
  'Kraft paper envelopes labeled with waterproof ink and registered into mobile GIS database.',
  'GEOCHEMICAL MAPPING',
  'Numbered Kraft sample pouches being sealed and packed in canvas field sacks',
  0,
  68,
  'Geochemical Mobile Lab',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-69',
  'Laterite Profile Horizon Differentiation & Target Sampling',
  'https://i.ibb.co/S7KvN88Z/IMG-20261030-WA0071.jpg',
  'Sampling ferricrete carapace and mottled saprolite zones across residual laterite plateaus.',
  'GEOCHEMICAL MAPPING',
  'Exposed lateritic roadcut profile with marked soil sampling horizons',
  0,
  69,
  'Plateau Concession Block',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-70',
  'Portable XRF Analyzer Rapid In-Situ Element Quantification',
  'https://i.ibb.co/Xx62bGzr/IMG-20261030-WA0072.jpg',
  'Handheld energy-dispersive XRF spectrometer measuring ppm concentrations of base and pathfinder metals.',
  'GEOCHEMICAL MAPPING',
  'Geochemist holding handheld pXRF analyzer nose against prepared soil cup',
  0,
  70,
  'Field In-Situ XRF Testing',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-71',
  'Field Basecamp Geochemical Sample Drying & Homogenization',
  'https://i.ibb.co/3y6KPnD6/IMG-20261030-WA0073.jpg',
  'Natural air drying of sediment samples under mesh shade to prevent contamination before pulverizing.',
  'GEOCHEMICAL MAPPING',
  'Sample bags arranged neatly on elevated drying racks at field basecamp',
  0,
  71,
  'Basecamp Preparation Facility',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-72',
  'Chain-of-Custody Packaging for Accredited Assay Laboratory',
  'https://i.ibb.co/PG7KnL5d/IMG-20261030-WA0074.jpg',
  'Security-tagged sample drums containing certified reference materials (CRMs), blanks, and duplicates.',
  'GEOCHEMICAL MAPPING',
  'Heavy duty sample shipping drums secured with tamper-evident seals',
  0,
  72,
  'Dispatch Depot',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-73',
  'Regional Geochemical Soil Anomaly Grid Verification',
  'https://i.ibb.co/fdKg1bvF/IMG-20261030-WA0075.jpg',
  'Detailed infill soil sampling across high-threshold anomalous zones to pinpoint mineral targets.',
  'GEOCHEMICAL MAPPING',
  'Field geologist plotting analytical results on contour anomaly map',
  0,
  73,
  'Infill Grid Target A',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-74',
  'Heavy Mineral Concentrate Inspection with Hand Lens',
  'https://i.ibb.co/RTN23Q3v/IMG-20261029-WA0026.jpg',
  'Micro-optical inspection of heavy mineral grains evaluating roundness, luster, and mineral species.',
  'GEOCHEMICAL MAPPING',
  'Close-up of mineral grains examined under illuminated triplet magnifier',
  0,
  74,
  'Field Petrography Station',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-75',
  'Stream Trap Site Identification for High-Density Minerals',
  'https://i.ibb.co/DP6DTcMY/IMG-20261029-WA0027.jpg',
  'Selecting boulder-strewn plunge pools and bar heads where heavy minerals naturally concentrate.',
  'GEOCHEMICAL MAPPING',
  'Fast flowing rocky river with geologists identifying gravel bars',
  0,
  75,
  'River Confluence Sector',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-76',
  'Geochemical Traverse Team Sampling River Basin Sediment',
  'https://i.ibb.co/CS1K0T8/IMG-20261029-WA0028.jpg',
  'Multi-point sediment composite sampling across wide alluvial channel for representative catchment analysis.',
  'GEOCHEMICAL MAPPING',
  'Field assistants gathering sediment from multiple sub-stations across stream bed',
  0,
  76,
  'Basin Catchment Area',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-77',
  'Lithogeochemical Outcrop Chip Sampling along Mineral Strike',
  'https://i.ibb.co/N2TcShB7/IMG-20261029-WA0029.jpg',
  'Channel chip sampling across vein contacts to determine alteration halo and grade distribution.',
  'GEOCHEMICAL MAPPING',
  'Linear chip channel cut into rock face with collection tarpaulin beneath',
  0,
  77,
  'Vein Channel Sample Line',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-user-78',
  'Multi-Element Anomaly Delineation & Target Prioritization',
  'https://i.ibb.co/gFcmkDqB/IMG-20261029-WA0030.jpg',
  'Statistical multivariate analysis correlating pathfinder elements (As, Sb, Bi) with precious metals.',
  'GEOCHEMICAL MAPPING',
  'Geochemical scatter plots and spatial contour maps reviewed on laptop',
  0,
  78,
  'Exploration Evaluation Center',
  0, 1, 1
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-01',
  'Heavy Rotary Water Rig on Drilling Site',
  'https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg',
  'Heavy truck-mounted rotary borehole drilling rig active on project location.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Heavy Rotary Water Rig on Drilling Site',
  1,
  79,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-02',
  'Terrameter Vertical Electrical Sounding (VES) Setup',
  'https://i.ibb.co/yngMcXWr/Whats-App-Image-2026-10-23-at-6-39-30-PM.jpg',
  'Electrical resistivity sounding survey mapping subsurface lithological layers.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Terrameter Vertical Electrical Sounding (VES) Setup',
  1,
  80,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-03',
  'Lithological Drill Cuttings Inspection & Sampling',
  'https://i.ibb.co/JFpB1MRs/Whats-App-Image-2026-10-23-at-6-39-31-PM-1.jpg',
  'Recovery and examination of drill cuttings to confirm aquifer horizon.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Lithological Drill Cuttings Inspection & Sampling',
  0,
  81,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-04',
  'Terrameter Inverted Geoelectric Profile',
  'https://i.ibb.co/tp4Sj6hz/Whats-App-Image-2026-10-23-at-6-39-31-PM-2.jpg',
  'Real-time geoelectric apparent resistivity curve analysis.',
  'GEOPHYSICAL SURVEYS',
  'Terrameter Inverted Geoelectric Profile',
  0,
  82,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-05',
  'Continuous Diamond Core Recovery in Core Trays',
  'https://i.ibb.co/h1gTzjgy/Whats-App-Image-2026-10-23-at-6-39-31-PM.jpg',
  'Solid core specimens neatly arranged in core trays for structural logging.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Continuous Diamond Core Recovery in Core Trays',
  1,
  83,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-06',
  'Geoscientist Reviewing Downhole Geophysical Log',
  'https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg',
  'On-site lead geophysicist interpreting geophysical curves in vehicle.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Geoscientist Reviewing Downhole Geophysical Log',
  0,
  84,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-07',
  '2D Electrical Resistivity Tomography Setup',
  'https://i.ibb.co/Cp1BZXSK/Whats-App-Image-2026-10-23-at-6-39-32-PM.jpg',
  'Multi-electrode resistivity array set up across concession transect.',
  'GEOPHYSICAL SURVEYS',
  '2D Electrical Resistivity Tomography Setup',
  1,
  85,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-08',
  'Rotary Drill Mast Alignment & Rigging',
  'https://i.ibb.co/sdPT6Zxq/Whats-App-Image-2026-10-23-at-6-39-33-PM-1.jpg',
  'Vertical mast alignment prior to deep mud rotary penetration.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Rotary Drill Mast Alignment & Rigging',
  1,
  86,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-09',
  'Pumping Test Discharge Measurement',
  'https://i.ibb.co/WvGQMHmf/Whats-App-Image-2026-10-23-at-6-39-33-PM-2.jpg',
  'Calibrated 90-degree V-notch weir tank recording continuous discharge rate.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Pumping Test Discharge Measurement',
  0,
  87,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-10',
  'Environmental Baseline Soil Profile Logging',
  'https://i.ibb.co/gLFDJ8yH/Whats-App-Image-2026-10-23-at-6-39-33-PM.jpg',
  'Soil stratigraphy and horizon logging for environmental baseline study.',
  'ENVIRONMENTAL GEOSCIENCE SERVICES',
  'Environmental Baseline Soil Profile Logging',
  0,
  88,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-11',
  'Crystalline Basement Hydrogeological Investigation',
  'https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg',
  'Geoscientists assessing outcrop fracture connectivity for aquifer potential.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Crystalline Basement Hydrogeological Investigation',
  1,
  89,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-12',
  'Drill Pipe Handling & Rotary Tool Jointing',
  'https://i.ibb.co/XrttsZQL/Whats-App-Image-2026-10-23-at-6-39-34-PM.jpg',
  'Technicians jointing 6-meter drill pipes on rotary drilling deck.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Drill Pipe Handling & Rotary Tool Jointing',
  0,
  90,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-13',
  'Resistivity Profiling with Stainless Steel Electrodes',
  'https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg',
  'Expanding electrode potential lines across weathered basement horizon.',
  'GEOPHYSICAL SURVEYS',
  'Resistivity Profiling with Stainless Steel Electrodes',
  0,
  91,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-14',
  'Mineral Exploration Outcrop Strike & Dip Tracing',
  'https://i.ibb.co/b5V0nds7/Whats-App-Image-2026-10-23-at-6-39-35-PM-2.jpg',
  'Outcrop strike measurement delineating structural trend across concession.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Mineral Exploration Outcrop Strike & Dip Tracing',
  1,
  92,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-15',
  'Mud Rotary Drilling Circulation Pit & Viscosity Check',
  'https://i.ibb.co/1J6tGDFq/Whats-App-Image-2026-10-23-at-6-39-35-PM.jpg',
  'Drilling fluid circulation pit monitored for bentonite suspension and cake control.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Mud Rotary Drilling Circulation Pit & Viscosity Check',
  0,
  93,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-16',
  'Subsurface 2D Inversion Modeling in Field Office',
  'https://i.ibb.co/HpT9hCQ3/Whats-App-Image-2026-10-23-at-6-39-36-PM-1.jpg',
  'Computer-aided 2D inversion modeling delivering instant geoelectric cross sections.',
  'GIS & GEOSPATIAL DATA SERVICES',
  'Subsurface 2D Inversion Modeling in Field Office',
  0,
  94,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-17',
  'Factory-Slotted uPVC Screen & Gravel Packing',
  'https://i.ibb.co/DHP3RGM0/Whats-App-Image-2026-10-23-at-6-39-36-PM-2.jpg',
  'Precision screen pipe lowered into drilled borehole prior to gravel filter placement.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Factory-Slotted uPVC Screen & Gravel Packing',
  0,
  95,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-18',
  'Geological Field Reconnaissance Traverse',
  'https://i.ibb.co/HLPjmqyK/Whats-App-Image-2026-10-23-at-6-39-37-PM-1.jpg',
  'Field reconnaissance across lateritic plateau mapping lithological exposures.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Geological Field Reconnaissance Traverse',
  1,
  96,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-19',
  'High-Yield Submersible Pump Installation',
  'https://i.ibb.co/Y4p0qFvG/Whats-App-Image-2026-10-23-at-6-39-37-PM-2.jpg',
  'Multi-stage stainless steel submersible pump lowered for constant-rate discharge test.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'High-Yield Submersible Pump Installation',
  0,
  97,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-20',
  'Differential GPS Concession Boundary Demarcation',
  'https://i.ibb.co/DHnrs3Hg/Whats-App-Image-2026-10-23-at-6-39-37-PM.jpg',
  'High-precision GNSS receiver recording boundary beacon coordinates.',
  'GIS & GEOSPATIAL DATA SERVICES',
  'Differential GPS Concession Boundary Demarcation',
  1,
  98,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-21',
  'Solid Mineral Specimen Inspection with Hand Lens',
  'https://i.ibb.co/0psMBYqs/Whats-App-Image-2026-10-23-at-6-39-38-PM-1.jpg',
  'Senior geologist evaluating mineral crystallization and alteration selvages.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Solid Mineral Specimen Inspection with Hand Lens',
  0,
  99,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-25',
  'Downhole Geophysical Logging Probe Deployment',
  'https://i.ibb.co/JwcM61yS/Whats-App-Image-2026-10-23-at-6-39-39-PM.jpg',
  'Natural gamma and point resistivity sondes lowered for borehole integrity check.',
  'GEOPHYSICAL SURVEYS',
  'Downhole Geophysical Logging Probe Deployment',
  1,
  100,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-26',
  'Geotechnical Plate Load Testing for Foundation Suitability',
  'https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg',
  'Calibrated hydraulic jack and dial gauge measuring settlement under load.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Geotechnical Plate Load Testing for Foundation Suitability',
  0,
  101,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-27',
  'Handheld XRF Multi-Element Assay Verification',
  'https://i.ibb.co/9kHrKR7Q/Whats-App-Image-2026-10-23-at-6-39-40-PM.jpg',
  'In-situ field verification of base and transition metal concentrations in soil samples.',
  'GEOCHEMICAL MAPPING',
  'Handheld XRF Multi-Element Assay Verification',
  0,
  102,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-28',
  'Wireline Diamond Core Barrel Retrieval',
  'https://i.ibb.co/CpQtM2RW/Whats-App-Image-2026-10-23-at-6-39-41-PM-1.jpg',
  'Triple tube HQ wireline barrel extracted with pristine solid rock core intact.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Wireline Diamond Core Barrel Retrieval',
  1,
  103,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-29',
  'Hydrological Catchment Basin Siting & Watershed Profiling',
  'https://i.ibb.co/0yWdwfj5/Whats-App-Image-2026-10-23-at-6-39-41-PM.jpg',
  'Watershed geomorphology assessment for regional community water supply project.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Hydrological Catchment Basin Siting & Watershed Profiling',
  0,
  104,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-30',
  'Induced Polarization (IP) Cable Layout',
  'https://i.ibb.co/KpTSkxn0/Whats-App-Image-2026-10-23-at-6-39-42-PM-1.jpg',
  'Deploying multi-core cables along 2km profile targeting disseminated sulfide mineralization.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Induced Polarization (IP) Cable Layout',
  1,
  105,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-31',
  'Drill Cuttings Grain Size Sieve Analysis',
  'https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg',
  'Granulometric sieve analysis on drill samples ensuring slot size matching.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Drill Cuttings Grain Size Sieve Analysis',
  0,
  106,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-32',
  'Geotechnical Trial Pit Excavation & Soil Stratigraphy',
  'https://i.ibb.co/nNRMvYfy/Whats-App-Image-2026-10-23-at-6-39-42-PM.jpg',
  'Trial pit inspection characterizing subsoil lithology, water seepage, and bearing capacity.',
  'ENVIRONMENTAL GEOSCIENCE SERVICES',
  'Geotechnical Trial Pit Excavation & Soil Stratigraphy',
  0,
  107,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-33',
  'Potable Water Quality In-Situ Sampling & Physicochemical Test',
  'https://i.ibb.co/6J15k85w/Whats-App-Image-2026-10-23-at-6-39-43-PM-1.jpg',
  'In-situ testing of pH, conductivity, turbidity, and total dissolved solids (TDS).',
  'ENVIRONMENTAL GEOSCIENCE SERVICES',
  'Potable Water Quality In-Situ Sampling & Physicochemical Test',
  0,
  108,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-34',
  'Differential GPS RTK Base Station Setup',
  'https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg',
  'Survey-grade geodetic RTK GPS base station establishing sub-centimeter control network.',
  'GIS & GEOSPATIAL DATA SERVICES',
  'Differential GPS RTK Base Station Setup',
  1,
  109,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-35',
  'Industrial Wellhead Assembly & Pressure Testing',
  'https://i.ibb.co/ZzXJCFKM/Whats-App-Image-2026-10-23-at-6-39-43-PM.jpg',
  'Heavy-duty flanged wellhead with pressure gauge and non-return valve installed.',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Industrial Wellhead Assembly & Pressure Testing',
  0,
  110,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-36',
  'Lead Geophysicist Directing 2D ERT Acquisition',
  'https://i.ibb.co/4nK4wrRQ/Whats-App-Image-2026-10-23-at-6-39-44-PM-1.jpg',
  'Senior consultant overseeing electrode array placement and resistance checks.',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Lead Geophysicist Directing 2D ERT Acquisition',
  1,
  111,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-37',
  'Environmental Baseline Survey Across Concession Boundary',
  'https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg',
  'Flora, fauna, and water resource baseline study for statutory regulatory compliance.',
  'ENVIRONMENTAL GEOSCIENCE SERVICES',
  'Environmental Baseline Survey Across Concession Boundary',
  0,
  112,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-38',
  'Diamond Saw Core Cutting for Assay Lab Batching',
  'https://i.ibb.co/wN8RhZQm/Whats-App-Image-2026-10-23-at-6-39-45-PM.jpg',
  'Longitudinal diamond saw cutting of drill core into equal halves for geochemical assay.',
  'CORE DRILLING & MINERAL EVALUATION',
  'Diamond Saw Core Cutting for Assay Lab Batching',
  0,
  113,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-39',
  'Soil Auger Grid Sampling Across Exploration Sector',
  'https://i.ibb.co/GvWdkt9q/Whats-App-Image-2026-10-23-at-6-39-46-PM-1.jpg',
  'Systematic hand auger soil sampling traversing across delineated shear zone.',
  'GEOCHEMICAL MAPPING',
  'Soil Auger Grid Sampling Across Exploration Sector',
  0,
  114,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-40',
  'Digital Elevation Model & Slope Analysis Mapping',
  'https://i.ibb.co/Vcj2KcYL/Whats-App-Image-2026-10-23-at-6-39-46-PM-2.jpg',
  'High-resolution DEM contour overlay for exploration access road and drill pad planning.',
  'GIS & GEOSPATIAL DATA SERVICES',
  'Digital Elevation Model & Slope Analysis Mapping',
  0,
  115,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);
INSERT INTO `gallery_images` (`id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'img-orig-41',
  'Multidisciplinary Geoscience Team Field Briefing',
  'https://i.ibb.co/27DRRcpd/Whats-App-Image-2026-10-23-at-6-39-46-PM.jpg',
  'Dr. Ben Ukwuteyinor and technical personnel conducting safety and operational briefing.',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Multidisciplinary Geoscience Team Field Briefing',
  1,
  116,
  'Concession Fieldwork Sector, Nigeria',
  1, 0, 0
);

-- ============================================================================
-- SEED SERVICES (8 Official Practice Areas)
-- ============================================================================
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-01',
  'geological-mapping-exploration',
  '01',
  'Geological Mapping & Exploration',
  'Field Surveys, Rock & Soil Identification & Ground Assessment',
  'Systematic geological field surveys, outcrop lithological mapping, rock and soil identification, geological investigations, and structural geology ground assessment.',
  '["Geological mapping and field surveys","Rock and soil identification","Geological investigations","Structural geology and ground assessment"]',
  '["Geological mapping and field surveys","Rock and soil identification","Geological investigations","Structural geology and ground assessment"]',
  '["Mining & Mineral Exploration Companies","Concession Holders & Investors","Government Geological Survey Agencies"]',
  'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg',
  1
);
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-02',
  'geophysical-surveys',
  '02',
  'Geophysical Surveys',
  'Resistivity, Magnetic, Electromagnetic & Subsurface Interpretation',
  'Multi-method exploration geophysics deploying electrical resistivity, ground magnetic, and electromagnetic surveys for subsurface investigation and geological interpretation.',
  '["Electrical resistivity surveys","Magnetic surveys","Electromagnetic surveys","Subsurface investigation and interpretation"]',
  '["Electrical resistivity surveys","Magnetic surveys","Electromagnetic surveys","Subsurface investigation and interpretation"]',
  '["Exploration & Mining Concessions","Groundwater Resource Developers","Civil Infrastructure & Dam Engineering"]',
  'https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg',
  1
);
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-03',
  'geotechnical-investigations',
  '03',
  'Geotechnical Investigations',
  'Soil Sampling, Foundation Evaluation & Ground-Condition Studies',
  'Comprehensive subsoil investigations, standard soil sampling, subsurface soil assessment, foundation and construction-site studies, and ground-condition evaluations.',
  '["Soil investigation and sampling","Subsurface soil assessment","Foundation and construction-site investigations","Ground-condition evaluation"]',
  '["Soil investigation and sampling","Subsurface soil assessment","Foundation and construction-site investigations","Ground-condition evaluation"]',
  '["Civil Construction & Road Contractors","Industrial & Commercial Real Estate Builders","Infrastructure & Bridge Engineers"]',
  'https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg',
  1
);
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-04',
  'hydrogeology-groundwater-exploration',
  '04',
  'Hydrogeology & Groundwater Exploration',
  'Groundwater Prospecting, Aquifer Identification & Borehole Siting',
  'Scientific hydrogeological investigations, groundwater prospecting, aquifer identification, groundwater potential assessment, and precision borehole siting.',
  '["Groundwater prospecting","Aquifer identification","Groundwater potential assessment","Borehole siting and water-source investigation"]',
  '["Groundwater prospecting","Aquifer identification","Groundwater potential assessment","Borehole siting and water-source investigation"]',
  '["Municipal Water Corporations & Regional Boards","Industrial Manufacturing & Agricultural Estates","Community Water Scheme Stakeholders"]',
  'https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg',
  1
);
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-05',
  'borehole-drilling-water-solutions',
  '05',
  'Borehole Drilling & Water Solutions',
  'Borehole Drilling, Well Development, Completion & Testing',
  'Deep rotary and percussion borehole drilling, water-well development, casing completion, continuous step-drawdown testing, and related water-supply solutions.',
  '["Borehole drilling","Water-well development","Borehole completion","Borehole testing and related water-supply solutions"]',
  '["Borehole drilling","Water-well development","Borehole completion","Borehole testing and related water-supply solutions"]',
  '["Beverage & Manufacturing Industrial Facilities","Government & Community Water Programs","Hospitals, Campuses & Commercial Complexes"]',
  'https://i.ibb.co/9HrCtyrv/IMG-20261030-WA0015.jpg',
  1
);
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-06',
  'mineral-resource-exploration',
  '06',
  'Mineral & Resource Exploration',
  'Exploration Surveys, Occurrence Investigations & Resource Assessment',
  'Specialized mineral exploration surveys, occurrence investigations, systematic rock and mineral sampling, and preliminary resource assessment for commercial viability.',
  '["Mineral exploration surveys","Mineral occurrence investigations","Rock and mineral sampling","Preliminary resource assessment"]',
  '["Mineral exploration surveys","Mineral occurrence investigations","Rock and mineral sampling","Preliminary resource assessment"]',
  '["Solid Mineral Concession Operators","Mining Investment Syndicates & Funds","Mineral Processing Ventures"]',
  'https://i.ibb.co/ch3qSLDL/IMG-20261030-WA0049.jpg',
  1
);
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-07',
  'gis-geospatial-data-services',
  '07',
  'GIS & Geospatial Data Services',
  'Geographic Information Systems, Digital Mapping & Spatial Analytics',
  'High-precision Geographic Information Systems (GIS), digital topographical mapping, spatial data analysis, and geospatial data interpretation.',
  '["Geographic Information Systems (GIS)","Digital mapping","Spatial data analysis","Geospatial data interpretation"]',
  '["Geographic Information Systems (GIS)","Digital mapping","Spatial data analysis","Geospatial data interpretation"]',
  '["Mining Cadastre & Concession Administration","Urban & Regional Infrastructure Planners","Land Administration & Survey Agencies"]',
  'https://i.ibb.co/pBcPqw0p/imm-01.jpg',
  1
);
INSERT INTO `services` (`id`, `slug`, `numeric_code`, `title`, `tagline`, `description`, `detailed_scope`, `methods_deliverables`, `target_sectors`, `featured_image`, `is_published`) VALUES (
  'srv-08',
  'environmental-geoscience-services',
  '08',
  'Environmental Geoscience Services',
  'Environmental Field Investigations, Soil & Water Assessment & Baseline Studies',
  'Comprehensive environmental field investigations, soil and water contamination assessments, statutory environmental baseline studies, and ground/site assessment.',
  '["Environmental field investigations","Soil and water assessment","Environmental baseline studies","Ground and site assessment"]',
  '["Environmental field investigations","Soil and water assessment","Environmental baseline studies","Ground and site assessment"]',
  '["Quarry & Mining Operators","Energy & Industrial Infrastructure","Regulatory & Environmental Compliance Bodies"]',
  'https://i.ibb.co/JjPm7nBf/IMG-20261030-WA0046.jpg',
  1
);

-- ============================================================================
-- SEED PROJECTS (5 Verified Field Assignments)
-- ============================================================================
INSERT INTO `projects` (`id`, `slug`, `title`, `category`, `category_key`, `location`, `date`, `cover_image`, `summary`, `methodology`, `key_deliverables`, `gallery_images`, `featured`, `status`) VALUES (
  'prj-01',
  'geological-structural-mapping-exploration',
  'Regional Geological Mapping & Mineralized Shear Zone Exploration',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'GEOLOGICAL MAPPING & EXPLORATION',
  'Precambrian Metamorphic Belt, Nigeria',
  'Verified Field Project',
  'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg',
  'High-resolution outcrop lithological mapping, foliation strike measurement with Clar compass, and strike continuity analysis across gold and base metal mineral concessions.',
  'Systematic reconnaissance traverses, structural strike and dip plotting on geological field sheets, and selective petrographic chip sampling across crystalline basement exposures.',
  '["1:10,000 lithostratigraphic geological map sheets with structural polar stereonets","Delineated mineralized quartz vein stockworks with strike continuity","High-priority follow-up targets for diamond core drilling and trenching"]',
  '["https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg","https://i.ibb.co/qYFRNWwV/IMG-20261030-WA0003.jpg","https://i.ibb.co/CsHJChq7/IMG-20261030-WA0008.jpg","https://i.ibb.co/gM8KVFYS/IMG-20261030-WA0014.jpg"]',
  1,
  'Published'
);
INSERT INTO `projects` (`id`, `slug`, `title`, `category`, `category_key`, `location`, `date`, `cover_image`, `summary`, `methodology`, `key_deliverables`, `gallery_images`, `featured`, `status`) VALUES (
  'prj-02',
  'industrial-borehole-water-project',
  'Deep Aquifer Rotary Drilling & Industrial Water Infrastructure',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'Industrial & Agricultural Corridor, Nigeria',
  'Verified Field Project',
  'https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg',
  'Heavy truck-mounted rotary borehole drilling penetrating deep productive aquifer horizons, followed by high-yield multi-stage pump installation and water distribution networks.',
  'Continuous mud rotary and DTH air percussion drilling, downhole geophysical logging, factory-slotted uPVC screen installation, graded silica gravel envelope packing, and 24-hour step-drawdown pumping tests.',
  '["Complete lithological and drilling penetration rate completion logs","Step-drawdown pumping test reports verifying sustainable discharge >18 m³/hr","Commissioned sanitary concrete apron, pump installation, and certified potability assays"]',
  '["https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg","https://i.ibb.co/1tBv9HR5/IMG-20261030-WA0021.jpg","https://i.ibb.co/tpbcLMD6/IMG-20261030-WA0024.jpg","https://i.ibb.co/8nrgkSNd/IMG-20261030-WA0030.jpg"]',
  1,
  'Published'
);
INSERT INTO `projects` (`id`, `slug`, `title`, `category`, `category_key`, `location`, `date`, `cover_image`, `summary`, `methodology`, `key_deliverables`, `gallery_images`, `featured`, `status`) VALUES (
  'prj-03',
  'geophysics-mineral-exploration',
  '2D Electrical Resistivity Tomography & Induced Polarization Mineral Survey',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'Sulfide & Gold Prospecting Tenement',
  'Verified Field Project',
  'https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg',
  'Deep multi-electrode electrical resistivity tomography (ERT) and time-domain Induced Polarization (IP) profiling targeting disseminated sulfide ore and resistive auriferous quartz reefs.',
  'Deployed 64-electrode automated takeout arrays using Wenner-Schlumberger and Dipole-Dipole geometries, coupled with continuous proton precession ground magnetic grid profiling.',
  '["Inverted 2D and 3D subsurface resistivity and chargeability block models","Georeferenced geophysical anomaly maps correlating low resistivity with high IP chargeability","Recommended angled diamond drill collar coordinates and depth-to-target specifications"]',
  '["https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg","https://i.ibb.co/bMFKd3hR/IMG-20261030-WA0036.jpg","https://i.ibb.co/dJHrfNgX/IMG-20261030-WA0037.jpg","https://i.ibb.co/nMNRQM6m/IMG-20261030-WA0050.jpg"]',
  1,
  'Published'
);
INSERT INTO `projects` (`id`, `slug`, `title`, `category`, `category_key`, `location`, `date`, `cover_image`, `summary`, `methodology`, `key_deliverables`, `gallery_images`, `featured`, `status`) VALUES (
  'prj-04',
  'diamond-core-drilling-mineral-evaluation',
  'Diamond Wireline Core Drilling & Subsurface Mineral Evaluation',
  'CORE DRILLING & MINERAL EVALUATION',
  'CORE DRILLING & MINERAL EVALUATION',
  'Commercial Mineral Concession, Nigeria',
  'Verified Field Project',
  'https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg',
  'Angled diamond wireline core drilling achieving >98% solid core recovery, RQD geotechnical logging, structural core orientation, and diamond saw splitting for laboratory assay.',
  'Continuous wireline HQ/NQ triple-tube core barrel retrieval, geotechnical Rock Quality Designation (RQD) logging in labeled core boxes, core photography, and longitudinal half-core saw cutting.',
  '["Comprehensive digital core photographic archive and detailed geological logs","RQD and geotechnical fracture frequency indices across all drill intervals","QA/QC certified assay interval batches dispatched to accredited international laboratories"]',
  '["https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg","https://i.ibb.co/NnN3BD6x/IMG-20261030-WA0053.jpg","https://i.ibb.co/Nd7XqS3q/IMG-20261030-WA0057.jpg","https://i.ibb.co/mVKHGprZ/IMG-20261030-WA0058.jpg"]',
  1,
  'Published'
);
INSERT INTO `projects` (`id`, `slug`, `title`, `category`, `category_key`, `location`, `date`, `cover_image`, `summary`, `methodology`, `key_deliverables`, `gallery_images`, `featured`, `status`) VALUES (
  'prj-05',
  'regional-geochemical-mapping-soil-survey',
  'Regional Stream Sediment & Grid Soil Geochemical Mapping Campaign',
  'GEOCHEMICAL MAPPING',
  'GEOCHEMICAL MAPPING',
  'Drainage Basin Catchment, Mineral Sector',
  'Verified Field Project',
  'https://i.ibb.co/mV7tX06H/IMG-20261030-WA0064.jpg',
  'Catchment-scale active stream sediment sampling, hydraulic trap recovery, and systematic B-horizon soil auger grid sampling with portable XRF in-situ multi-element assays.',
  'Multi-point sediment composite collection, -80 mesh stainless steel sieving, alluvial heavy mineral batea panning, and 1.0m depth hand auger soil sampling across a 50m x 200m grid.',
  '["Multi-element geochemical anomaly distribution maps (Au, Cu, Pb, Zn, Ni)","Statistical multivariate correlation reports isolating pathfinder dispersion halos","Prioritized target anomalies ranked for trenching and test drilling"]',
  '["https://i.ibb.co/mV7tX06H/IMG-20261030-WA0064.jpg","https://i.ibb.co/fGkN4tpj/IMG-20261030-WA0065.jpg","https://i.ibb.co/Xx62bGzr/IMG-20261030-WA0072.jpg","https://i.ibb.co/gFcmkDqB/IMG-20261029-WA0030.jpg"]',
  0,
  'Published'
);

-- ============================================================================
-- SEED VIDEOS (14 Verified Field Operations Footage)
-- ============================================================================
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-01',
  'Rotary Borehole Drilling Operations',
  'Deep Aquifer Siting & Continuous Mast Rotation',
  'https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/view?usp=drive_link',
  'https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/preview',
  'https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg',
  'Real-time field footage documenting heavy rotary drilling mast operation, hydraulic feed control, and borehole mud circulation on high-elevation concession.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-02',
  'Exploration Trenching & Saprolite Profiling',
  'CAT Excavator Cutting Geological Trial Trench',
  'https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/view?usp=drive_link',
  'https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/preview',
  'https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg',
  'Direct operational footage of heavy tracked excavator profiling lateritic overburden and exposing underlying weathered saprolite bedrock.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-03',
  'Downhole Drill Stem & Casing Installation',
  'Rotary Mast Coupling & Hydrogeological Advancement',
  'https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/view?usp=drive_link',
  'https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/preview',
  'https://i.ibb.co/9HrCtyrv/IMG-20261030-WA0015.jpg',
  'On-site drilling personnel managing high-torque drill pipe couplings, casing shoe positioning, and downhole penetration monitoring.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-04',
  'High-Yield Borehole Pumping & Flow Testing',
  'Aquifer Productivity & Transmissivity Validation',
  'https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/view?usp=drive_link',
  'https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/preview',
  'https://i.ibb.co/1tBv9HR5/IMG-20261030-WA0021.jpg',
  'Field testing and step-drawdown pumping test verifying commercial water yield and clean discharge rate from industrial production borehole.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-05',
  'Geological Outcrop Structural Assessment',
  'Highland Ridge Lithological & Joint Mapping',
  'https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/view?usp=drive_link',
  'https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/preview',
  'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg',
  'Dr. Ben Ukwuteyinor directing technical field team during structural strike, dip measurement, and mineral vein logging across highland escarpment.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-06',
  'Geophysical Electrical Resistivity Survey',
  'Multi-Electrode Vertical Electrical Sounding (VES)',
  'https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/view?usp=drive_link',
  'https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/preview',
  'https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg',
  'Field geophysicists operating terrameter instrumentation to delineate subsurface resistivity layers and fracture corridors for deep borehole siting.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-07',
  'Geotechnical Trial Pit Profile Logging',
  'In-Situ Soil Stratigraphy & Infiltration Evaluation',
  'https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/view?usp=drive_link',
  'https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/preview',
  'https://i.ibb.co/0jYMN8Xz/IMG-20261030-WA0016.jpg',
  'Manual excavation of deep geotechnical trial pits to inspect layer cohesion, density, and depth to bedrock ahead of drilling and foundation works.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-08',
  'Subsurface Core Logging & Drilling Operations Archive',
  'Comprehensive Subsurface Exploration Documentation',
  'https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/view?usp=drive_link',
  'https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/preview',
  'https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg',
  'Detailed operational capture of drilling rig logistics, diamond core recovery, ground validation, and engineering fieldwork executed by GiniBen personnel.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-09',
  'Turnkey Solar Water Scheme Infrastructure',
  'Elevated Storage Tank & Public Water Dispenser',
  'https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/view?usp=drive_link',
  'https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/preview',
  'https://i.ibb.co/bM2B4MXr/IMG-20261030-WA0033.jpg',
  'Operational inspection of completed solar-powered water scheme delivering potable water to local community.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-drill-10',
  'Geochemical Stream Sediment Sieving & Sampling',
  'Fractionation & Sample Envelope Verification',
  'https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/view?usp=drive_link',
  'https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/preview',
  'https://i.ibb.co/tpbcLMD6/IMG-20261030-WA0024.jpg',
  'Standardized -80 mesh sieving of stream sediments along drainage channels for trace element pathfinder exploration.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-11',
  'Industrial Quarry Crushing & Conveyor Transport',
  'Aggregate Plant Primary Jaw & Screening Circuit',
  'https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/view?usp=drive_link',
  'https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/preview',
  'https://i.ibb.co/NnN3BD6x/IMG-20261030-WA0053.jpg',
  'Mechanical reduction of solid rock in primary jaw crusher and transfer via heavy-duty inclined conveyor gantries.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-12',
  'Alluvial Gold & Heavy Mineral Gravity Panning',
  'Stream Bed Alluvial Sampling Protocol',
  'https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/view?usp=drive_link',
  'https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/preview',
  'https://i.ibb.co/fGkN4tpj/IMG-20261030-WA0065.jpg',
  'Sediment panning and recovery of heavy mineral concentrates in river gravels for mineral prospectivity analysis.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-13',
  'Exploration Concession Boundary Differential GPS Survey',
  'Precision Perimeter Verification & Staking',
  'https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/view?usp=drive_link',
  'https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/preview',
  'https://i.ibb.co/v6CnPHFt/IMG-20261030-WA0048.jpg',
  'Traversing boundary corner beacons with differential GPS to calibrate concession borders and survey transects.',
  1,
  'vertical',
  1, 1, 1
);
INSERT INTO `project_videos` (`id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`, `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`) VALUES (
  'vid-gal-14',
  'Highland Escarpment Geological Reconnaissance',
  'Topographical Elevation & Lithology Survey',
  'https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/view?usp=drive_link',
  'https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/preview',
  'https://i.ibb.co/gM8KVFYS/IMG-20261030-WA0014.jpg',
  'Comprehensive mapping of highland sandstone ridges and mineral contact zones across Udi plateau.',
  1,
  'vertical',
  1, 1, 1
);

-- ============================================================================
-- SEED TEAM MEMBERS (6 Core Leadership & Technical Consultants)
-- ============================================================================
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-01',
  'Dr. Benjamin Ukwuteyinor, PhD',
  'Founder & Lead Consultant',
  'Founder & Lead Consultant',
  'PhD Applied Geophysics, COMEG, NMGS, IAIA certified',
  '25+ years of professional practice',
  '["Council of Mining Engineers and Geoscientists (COMEG)","Nigerian Mining and Geosciences Society (NMGS)","International Association for Impact Assessment (IAIA)"]',
  '["Council of Mining Engineers and Geoscientists (COMEG)","Nigerian Mining and Geosciences Society (NMGS)","International Association for Impact Assessment (IAIA)"]',
  'Dr. Benjamin Ukwuteyinor is an accomplished exploration geophysicist directing integrated mineral resource evaluations, hydrogeological investigations, deep industrial borehole engineering, and infrastructure geophysics across Nigeria and West Africa.',
  'https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg',
  0,
  1
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-02',
  'Dr. Ezeugwu Innocent (Ph.D)',
  'Principal Partner',
  'Principal Partner',
  'Ph.D, Principal Partner, Groundwater & Mineral Resources',
  '20+ years of professional practice',
  '["Principal Partner, Applied Geophysics & Groundwater Resources","COMEG Registered Geoscientist"]',
  '["Principal Partner, Applied Geophysics & Groundwater Resources","COMEG Registered Geoscientist"]',
  'Principal Partner overseeing high-volume groundwater engineering, subsurface characterization, and large-scale water treatment facility development across regional states.',
  'https://i.ibb.co/0xNFG2Z/Whats-App-Image-2026-10-23-at-9-04-07-PM.jpg',
  0,
  2
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-03',
  'Ogechukwu Maryann Okeke',
  'Geologist',
  'Geologist',
  'Geologist, Exploration & Structural Mapping',
  'Active Field Exploration Geologist',
  '["Nigerian Mining and Geosciences Society (NMGS)","Field Exploration & Stratigraphy Specialist"]',
  '["Nigerian Mining and Geosciences Society (NMGS)","Field Exploration & Stratigraphy Specialist"]',
  'Field geologist specializing in geological mapping, structural interpretation, mineral prospect evaluation, and sample recovery protocols.',
  'https://i.ibb.co/vx8ytQDy/Whats-App-Image-2026-10-23-at-9-04-06-PM-1.jpg',
  0,
  3
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-04',
  'Alichi U. (Ph.D)',
  'Senior Partner / Co-Developer',
  'Senior Partner / Co-Developer',
  'Ph.D, Environmental Hydrogeology & Co-Developer',
  'Senior Partner Level',
  '["Environmental Management & Hydrogeology Specialist","Subsurface Hydrodynamics & Resource Evaluation"]',
  '["Environmental Management & Hydrogeology Specialist","Subsurface Hydrodynamics & Resource Evaluation"]',
  'Senior Partner & Co-Developer leading environmental management planning, hydrodynamics, and sustainable water resources development.',
  'https://i.ibb.co/XxpMK4xQ/Whats-App-Image-2026-10-23-at-9-04-06-PM.jpg',
  0,
  4
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-05',
  'Ekechi Mmaduabuchi',
  'Geophysicist and Logistics Officer',
  'Geophysicist and Logistics Officer',
  'Exploration Geophysics & Field Logistics Operations',
  'Field Operations & Logistics',
  '["Nigerian Mining and Geosciences Society (NMGS)","Applied Geophysics & Technical Logistics Lead"]',
  '["Nigerian Mining and Geosciences Society (NMGS)","Applied Geophysics & Technical Logistics Lead"]',
  'Exploration geophysicist directing logistical coordination, vertical electrical sounding (VES) data collection, equipment mobilization, and field operations safety.',
  'https://i.ibb.co/1YhTdZ6w/IMG-20261023-WA0146.jpg',
  0,
  5
);
INSERT INTO `team_members` (`id`, `name`, `title`, `role`, `credentials`, `experience_years`, `affiliations`, `affiliations_json`, `bio`, `image`, `is_placeholder`, `sort_order`) VALUES (
  'team-06',
  'Ama Agwu',
  'Geologist / Field Coordinator',
  'Geologist / Field Coordinator',
  'Field Geology & Exploration Coordination',
  'Field Geological Operations',
  '["Nigerian Mining and Geosciences Society (NMGS)","Structural Mapping & Field Oversight"]',
  '["Nigerian Mining and Geosciences Society (NMGS)","Structural Mapping & Field Oversight"]',
  'Field geologist coordinating on-site exploration operations, structural geological logging, stratigraphic correlation, and technical field team management.',
  'https://i.ibb.co/WvPD8W2S/IMG-20261023-WA0149.jpg',
  0,
  6
);

SET FOREIGN_KEY_CHECKS = 1;
