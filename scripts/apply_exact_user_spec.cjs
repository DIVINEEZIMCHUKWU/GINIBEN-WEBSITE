const fs = require('fs');
const path = require('path');

const { newImages, OFFICIAL_CATEGORIES } = require('./update_gallery_data.cjs');
console.log(`Loaded ${newImages.length} user images.`);

// 1. Format the 78 verified user images: ONLY for Gallery & Projects pages!
const userGalleryItems = newImages.map((img, idx) => ({
  id: `img-user-${String(idx + 1).padStart(2, '0')}`,
  url: img.url,
  title: img.title,
  caption: img.caption,
  category: img.category,
  alt: img.alt || img.title,
  isHero: img.isHero || false,
  order: idx + 1,
  location: img.location || 'Mineral Concession, Nigeria',
  showOnHomepage: false, // User requested old images on website, only these on Gallery & Project pages
  showOnProjects: true,
  showOnGallery: true
}));

// 2. The 38 original images for other pages (Homepage, etc.) excluding 22, 23, 24
const originalImagesRaw = [
  { num: 1, url: "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg", title: "Heavy Rotary Water Rig on Drilling Site", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Heavy truck-mounted rotary borehole drilling rig active on project location." },
  { num: 2, url: "https://i.ibb.co/yngMcXWr/Whats-App-Image-2026-10-23-at-6-39-30-PM.jpg", title: "Terrameter Vertical Electrical Sounding (VES) Setup", category: "GEOPHYSICS & MINERAL EXPLORATION", caption: "Electrical resistivity sounding survey mapping subsurface lithological layers." },
  { num: 3, url: "https://i.ibb.co/JFpB1MRs/Whats-App-Image-2026-10-23-at-6-39-31-PM-1.jpg", title: "Lithological Drill Cuttings Inspection & Sampling", category: "CORE DRILLING & MINERAL EVALUATION", caption: "Recovery and examination of drill cuttings to confirm aquifer horizon." },
  { num: 4, url: "https://i.ibb.co/tp4Sj6hz/Whats-App-Image-2026-10-23-at-6-39-31-PM-2.jpg", title: "Terrameter Inverted Geoelectric Profile", category: "GEOPHYSICAL SURVEYS", caption: "Real-time geoelectric apparent resistivity curve analysis." },
  { num: 5, url: "https://i.ibb.co/h1gTzjgy/Whats-App-Image-2026-10-23-at-6-39-31-PM.jpg", title: "Continuous Diamond Core Recovery in Core Trays", category: "CORE DRILLING & MINERAL EVALUATION", caption: "Solid core specimens neatly arranged in core trays for structural logging." },
  { num: 6, url: "https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg", title: "Geoscientist Reviewing Downhole Geophysical Log", category: "GEOPHYSICS & MINERAL EXPLORATION", caption: "On-site lead geophysicist interpreting geophysical curves in vehicle." },
  { num: 7, url: "https://i.ibb.co/Cp1BZXSK/Whats-App-Image-2026-10-23-at-6-39-32-PM.jpg", title: "2D Electrical Resistivity Tomography Setup", category: "GEOPHYSICAL SURVEYS", caption: "Multi-electrode resistivity array set up across concession transect." },
  { num: 8, url: "https://i.ibb.co/sdPT6Zxq/Whats-App-Image-2026-10-23-at-6-39-33-PM-1.jpg", title: "Rotary Drill Mast Alignment & Rigging", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Vertical mast alignment prior to deep mud rotary penetration." },
  { num: 9, url: "https://i.ibb.co/WvGQMHmf/Whats-App-Image-2026-10-23-at-6-39-33-PM-2.jpg", title: "Pumping Test Discharge Measurement", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Calibrated 90-degree V-notch weir tank recording continuous discharge rate." },
  { num: 10, url: "https://i.ibb.co/gLFDJ8yH/Whats-App-Image-2026-10-23-at-6-39-33-PM.jpg", title: "Environmental Baseline Soil Profile Logging", category: "ENVIRONMENTAL GEOSCIENCE SERVICES", caption: "Soil stratigraphy and horizon logging for environmental baseline study." },
  { num: 11, url: "https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg", title: "Crystalline Basement Hydrogeological Investigation", category: "GEOLOGICAL MAPPING & EXPLORATION", caption: "Geoscientists assessing outcrop fracture connectivity for aquifer potential." },
  { num: 12, url: "https://i.ibb.co/XrttsZQL/Whats-App-Image-2026-10-23-at-6-39-34-PM.jpg", title: "Drill Pipe Handling & Rotary Tool Jointing", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Technicians jointing 6-meter drill pipes on rotary drilling deck." },
  { num: 13, url: "https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg", title: "Resistivity Profiling with Stainless Steel Electrodes", category: "GEOPHYSICAL SURVEYS", caption: "Expanding electrode potential lines across weathered basement horizon." },
  { num: 14, url: "https://i.ibb.co/b5V0nds7/Whats-App-Image-2026-10-23-at-6-39-35-PM-2.jpg", title: "Mineral Exploration Outcrop Strike & Dip Tracing", category: "GEOLOGICAL MAPPING & EXPLORATION", caption: "Outcrop strike measurement delineating structural trend across concession." },
  { num: 15, url: "https://i.ibb.co/1J6tGDFq/Whats-App-Image-2026-10-23-at-6-39-35-PM.jpg", title: "Mud Rotary Drilling Circulation Pit & Viscosity Check", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Drilling fluid circulation pit monitored for bentonite suspension and cake control." },
  { num: 16, url: "https://i.ibb.co/HpT9hCQ3/Whats-App-Image-2026-10-23-at-6-39-36-PM-1.jpg", title: "Subsurface 2D Inversion Modeling in Field Office", category: "GIS & GEOSPATIAL DATA SERVICES", caption: "Computer-aided 2D inversion modeling delivering instant geoelectric cross sections." },
  { num: 17, url: "https://i.ibb.co/DHP3RGM0/Whats-App-Image-2026-10-23-at-6-39-36-PM-2.jpg", title: "Factory-Slotted uPVC Screen & Gravel Packing", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Precision screen pipe lowered into drilled borehole prior to gravel filter placement." },
  { num: 18, url: "https://i.ibb.co/HLPjmqyK/Whats-App-Image-2026-10-23-at-6-39-37-PM-1.jpg", title: "Geological Field Reconnaissance Traverse", category: "GEOLOGICAL MAPPING & EXPLORATION", caption: "Field reconnaissance across lateritic plateau mapping lithological exposures." },
  { num: 19, url: "https://i.ibb.co/Y4p0qFvG/Whats-App-Image-2026-10-23-at-6-39-37-PM-2.jpg", title: "High-Yield Submersible Pump Installation", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Multi-stage stainless steel submersible pump lowered for constant-rate discharge test." },
  { num: 20, url: "https://i.ibb.co/DHnrs3Hg/Whats-App-Image-2026-10-23-at-6-39-37-PM.jpg", title: "Differential GPS Concession Boundary Demarcation", category: "GIS & GEOSPATIAL DATA SERVICES", caption: "High-precision GNSS receiver recording boundary beacon coordinates." },
  { num: 21, url: "https://i.ibb.co/0psMBYqs/Whats-App-Image-2026-10-23-at-6-39-38-PM-1.jpg", title: "Solid Mineral Specimen Inspection with Hand Lens", category: "GEOLOGICAL MAPPING & EXPLORATION", caption: "Senior geologist evaluating mineral crystallization and alteration selvages." },
  // 22, 23, 24 REMOVED PERMANENTLY AS DIRECTED
  { num: 25, url: "https://i.ibb.co/JwcM61yS/Whats-App-Image-2026-10-23-at-6-39-39-PM.jpg", title: "Downhole Geophysical Logging Probe Deployment", category: "GEOPHYSICAL SURVEYS", caption: "Natural gamma and point resistivity sondes lowered for borehole integrity check." },
  { num: 26, url: "https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg", title: "Geotechnical Plate Load Testing for Foundation Suitability", category: "CORE DRILLING & MINERAL EVALUATION", caption: "Calibrated hydraulic jack and dial gauge measuring settlement under load." },
  { num: 27, url: "https://i.ibb.co/9kHrKR7Q/Whats-App-Image-2026-10-23-at-6-39-40-PM.jpg", title: "Handheld XRF Multi-Element Assay Verification", category: "GEOCHEMICAL MAPPING", caption: "In-situ field verification of base and transition metal concentrations in soil samples." },
  { num: 28, url: "https://i.ibb.co/CpQtM2RW/Whats-App-Image-2026-10-23-at-6-39-41-PM-1.jpg", title: "Wireline Diamond Core Barrel Retrieval", category: "CORE DRILLING & MINERAL EVALUATION", caption: "Triple tube HQ wireline barrel extracted with pristine solid rock core intact." },
  { num: 29, url: "https://i.ibb.co/0yWdwfj5/Whats-App-Image-2026-10-23-at-6-39-41-PM.jpg", title: "Hydrological Catchment Basin Siting & Watershed Profiling", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Watershed geomorphology assessment for regional community water supply project." },
  { num: 30, url: "https://i.ibb.co/KpTSkxn0/Whats-App-Image-2026-10-23-at-6-39-42-PM-1.jpg", title: "Induced Polarization (IP) Cable Layout", category: "GEOPHYSICS & MINERAL EXPLORATION", caption: "Deploying multi-core cables along 2km profile targeting disseminated sulfide mineralization." },
  { num: 31, url: "https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg", title: "Drill Cuttings Grain Size Sieve Analysis", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Granulometric sieve analysis on drill samples ensuring slot size matching." },
  { num: 32, url: "https://i.ibb.co/nNRMvYfy/Whats-App-Image-2026-10-23-at-6-39-42-PM.jpg", title: "Geotechnical Trial Pit Excavation & Soil Stratigraphy", category: "ENVIRONMENTAL GEOSCIENCE SERVICES", caption: "Trial pit inspection characterizing subsoil lithology, water seepage, and bearing capacity." },
  { num: 33, url: "https://i.ibb.co/6J15k85w/Whats-App-Image-2026-10-23-at-6-39-43-PM-1.jpg", title: "Potable Water Quality In-Situ Sampling & Physicochemical Test", category: "ENVIRONMENTAL GEOSCIENCE SERVICES", caption: "In-situ testing of pH, conductivity, turbidity, and total dissolved solids (TDS)." },
  { num: 34, url: "https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg", title: "Differential GPS RTK Base Station Setup", category: "GIS & GEOSPATIAL DATA SERVICES", caption: "Survey-grade geodetic RTK GPS base station establishing sub-centimeter control network." },
  { num: 35, url: "https://i.ibb.co/ZzXJCFKM/Whats-App-Image-2026-10-23-at-6-39-43-PM.jpg", title: "Industrial Wellhead Assembly & Pressure Testing", category: "BOREHOLE CONSTRUCTION & WATER PROJECT", caption: "Heavy-duty flanged wellhead with pressure gauge and non-return valve installed." },
  { num: 36, url: "https://i.ibb.co/4nK4wrRQ/Whats-App-Image-2026-10-23-at-6-39-44-PM-1.jpg", title: "Lead Geophysicist Directing 2D ERT Acquisition", category: "GEOPHYSICS & MINERAL EXPLORATION", caption: "Senior consultant overseeing electrode array placement and resistance checks." },
  { num: 37, url: "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg", title: "Environmental Baseline Survey Across Concession Boundary", category: "ENVIRONMENTAL GEOSCIENCE SERVICES", caption: "Flora, fauna, and water resource baseline study for statutory regulatory compliance." },
  { num: 38, url: "https://i.ibb.co/wN8RhZQm/Whats-App-Image-2026-10-23-at-6-39-45-PM.jpg", title: "Diamond Saw Core Cutting for Assay Lab Batching", category: "CORE DRILLING & MINERAL EVALUATION", caption: "Longitudinal diamond saw cutting of drill core into equal halves for geochemical assay." },
  { num: 39, url: "https://i.ibb.co/GvWdkt9q/Whats-App-Image-2026-10-23-at-6-39-46-PM-1.jpg", title: "Soil Auger Grid Sampling Across Exploration Sector", category: "GEOCHEMICAL MAPPING", caption: "Systematic hand auger soil sampling traversing across delineated shear zone." },
  { num: 40, url: "https://i.ibb.co/Vcj2KcYL/Whats-App-Image-2026-10-23-at-6-39-46-PM-2.jpg", title: "Digital Elevation Model & Slope Analysis Mapping", category: "GIS & GEOSPATIAL DATA SERVICES", caption: "High-resolution DEM contour overlay for exploration access road and drill pad planning." },
  { num: 41, url: "https://i.ibb.co/27DRRcpd/Whats-App-Image-2026-10-23-at-6-39-46-PM.jpg", title: "Multidisciplinary Geoscience Team Field Briefing", category: "GEOLOGICAL MAPPING & EXPLORATION", caption: "Dr. Ben Ukwuteyinor and technical personnel conducting safety and operational briefing." }
];

const originalGalleryItems = originalImagesRaw.map((img, idx) => ({
  id: `img-orig-${String(img.num).padStart(2, '0')}`,
  url: img.url,
  title: img.title,
  caption: img.caption,
  category: img.category,
  alt: img.title,
  isHero: [1, 2, 5, 7, 8, 11, 14, 18, 20, 25, 28, 30, 34, 36, 41].includes(img.num),
  order: 100 + idx,
  location: 'Concession Fieldwork Sector, Nigeria',
  showOnHomepage: true,  // Kept on website homepage & other pages as requested
  showOnProjects: false, // REMOVED from Project Page as requested
  showOnGallery: false   // REMOVED from Gallery Page as requested
}));

console.log(`Original images prepared: ${originalGalleryItems.length} items.`);

// Combined initial images
const allImagesCombined = [...userGalleryItems, ...originalGalleryItems];
console.log(`Total combined initial gallery images: ${allImagesCombined.length}`);

// Read companyData.ts
const companyDataPath = path.join(__dirname, '../src/data/companyData.ts');
let content = fs.readFileSync(companyDataPath, 'utf8');

// Replace INITIAL_GALLERY_IMAGES
const galleryTs = 'export const INITIAL_GALLERY_IMAGES: MediaItem[] = ' + JSON.stringify(allImagesCombined, null, 2) + ';';
content = content.replace(/export const INITIAL_GALLERY_IMAGES: MediaItem\[\] = \[[\s\S]*?\n\];/, galleryTs);

// 3. Restore Services featured images to original authentic company images
const originalServiceImages = {
  "srv-01": "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg",
  "srv-02": "https://i.ibb.co/h1gTzjgy/Whats-App-Image-2026-10-23-at-6-39-31-PM.jpg",
  "srv-03": "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
  "srv-04": "https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg",
  "srv-05": "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg",
  "srv-06": "https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg"
};

Object.entries(originalServiceImages).forEach(([id, img]) => {
  const reg = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?featuredImage:\\s*)"[^"]+"`);
  content = content.replace(reg, `$1"${img}"`);
});

// 4. Restore team member photos to original
content = content.replace(
  /(id:\s*"team-01"[\s\S]*?image:\s*)"[^"]+"/,
  `$1"https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg"`
);
content = content.replace(
  /(id:\s*"team-06"[\s\S]*?image:\s*)"[^"]+"/,
  `$1"https://i.ibb.co/WvPD8W2S/IMG-20261023-WA0149.jpg"`
);

// 5. Restore articles cover images to original
content = content.replace(
  /(id:\s*"art-01"[\s\S]*?coverImage:\s*)"[^"]+"/,
  `$1"https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg"`
);
content = content.replace(
  /(id:\s*"art-02"[\s\S]*?coverImage:\s*)"[^"]+"/,
  `$1"https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg"`
);

// 6. Restore video thumbnails to original
content = content.replace(
  /(id:\s*"vid-drill-01"[\s\S]*?thumbnail:\s*)"[^"]+"/,
  `$1"https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg"`
);
content = content.replace(
  /(id:\s*"vid-drill-02"[\s\S]*?thumbnail:\s*)"[^"]+"/,
  `$1"https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg"`
);

fs.writeFileSync(companyDataPath, content, 'utf8');
console.log('Successfully updated src/data/companyData.ts with both user gallery archive and original website images!');
