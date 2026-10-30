const fs = require('fs');
const path = require('path');

// 1. Read update_gallery_data.cjs content to extract newImages
const scriptContent = fs.readFileSync(path.join(__dirname, 'update_gallery_data.cjs'), 'utf8');
const matchImages = scriptContent.match(/const newImages = (\[[\s\S]*?\n\];)/);
if (!matchImages) {
  console.error("Could not find newImages in update_gallery_data.cjs");
  process.exit(1);
}
const newImages = eval(matchImages[1]);
console.log(`Loaded ${newImages.length} new user images.`);

// 2. Read src/data/companyData.ts
const companyDataPath = path.join(__dirname, '../src/data/companyData.ts');
let companyDataContent = fs.readFileSync(companyDataPath, 'utf8');

// Find INITIAL_GALLERY_IMAGES
const matchGallery = companyDataContent.match(/export const INITIAL_GALLERY_IMAGES: MediaItem\[\] = (\[[\s\S]*?\n\];)/);
if (!matchGallery) {
  console.error("Could not find INITIAL_GALLERY_IMAGES in companyData.ts");
  process.exit(1);
}

const existingImages = eval(matchGallery[1]);
console.log(`Loaded ${existingImages.length} existing images.`);

// 3. Remove the 3 specified images:
// img-22 (ccsDQjRW): Community Water Scheme Wellhead & Dispensing Standpipes
// img-23 (VYCKFqT7): Geochemical Sample Batch Cataloging (OKP-SD-001 to 015)
// img-24 (ksFt40BR): Galvanized Steel Overhead Water Storage Tower & Scheme
const deletedTokens = ['ccsDQjRW', 'VYCKFqT7', 'ksFt40BR', 'img-22', 'img-23', 'img-24'];
const filteredExisting = existingImages.filter(img => {
  const matches = deletedTokens.some(tok => (img.id === tok || img.url.includes(tok)));
  return !matches;
});
console.log(`Filtered out deleted images. Remaining existing images: ${filteredExisting.length}`);

// 4. Map remaining existing images to the 8 official categories
// Official categories:
// 'GEOLOGICAL MAPPING & EXPLORATION'
// 'BOREHOLE CONSTRUCTION & WATER PROJECT'
// 'GEOPHYSICS & MINERAL EXPLORATION'
// 'CORE DRILLING & MINERAL EVALUATION'
// 'GEOCHEMICAL MAPPING'
// 'GIS & GEOSPATIAL DATA SERVICES'
// 'GEOPHYSICAL SURVEYS'
// 'ENVIRONMENTAL GEOSCIENCE SERVICES'

function mapOldCategory(img) {
  const t = (img.title + ' ' + img.caption + ' ' + (img.alt || '')).toLowerCase();
  
  // Specific checks
  if (t.includes('geochemical') || t.includes('panning') || t.includes('stream sediment') || t.includes('batea') || t.includes('sieved')) {
    return 'GEOCHEMICAL MAPPING';
  }
  if (t.includes('borehole') || t.includes('water') || t.includes('aquifer') || t.includes('tap') || t.includes('pumping') || t.includes('wellhead')) {
    return 'BOREHOLE CONSTRUCTION & WATER PROJECT';
  }
  if (t.includes('diamond core') || t.includes('core logging') || t.includes('core tray') || t.includes('drill rig') || t.includes('drilling') || t.includes('trial pit') || t.includes('trench')) {
    return 'CORE DRILLING & MINERAL EVALUATION';
  }
  if (t.includes('gps') || t.includes('gis') || t.includes('satellite') || t.includes('topographic') || t.includes('elevation') || t.includes('concession boundary') || t.includes('survey transect')) {
    return 'GIS & GEOSPATIAL DATA SERVICES';
  }
  if (t.includes('resistivity') || t.includes('terrameter') || t.includes('electrode') || t.includes('sounding') || t.includes('ves') || t.includes('ip') || t.includes('induced polarization')) {
    return 'GEOPHYSICAL SURVEYS';
  }
  if (t.includes('environment') || t.includes('eia') || t.includes('soil profile') || t.includes('water quality') || t.includes('regulatory') || t.includes('remediation')) {
    return 'ENVIRONMENTAL GEOSCIENCE SERVICES';
  }
  if (img.category === 'geophysics') {
    return 'GEOPHYSICS & MINERAL EXPLORATION';
  }
  if (img.category === 'groundwater') {
    return 'BOREHOLE CONSTRUCTION & WATER PROJECT';
  }
  if (img.category === 'instruments') {
    return 'GEOPHYSICAL SURVEYS';
  }
  if (img.category === 'drilling') {
    return 'CORE DRILLING & MINERAL EVALUATION';
  }
  if (img.category === 'team') {
    return 'GEOLOGICAL MAPPING & EXPLORATION';
  }
  return 'GEOLOGICAL MAPPING & EXPLORATION';
}

const remappedExisting = filteredExisting.map((img, idx) => ({
  ...img,
  category: mapOldCategory(img),
  order: idx + newImages.length + 1
}));

// Build formatted newImages with IDs and order
const formattedNewImages = newImages.map((img, idx) => ({
  id: `img-new-${String(idx + 1).padStart(2, '0')}`,
  url: img.url,
  title: img.title,
  caption: img.caption,
  category: img.category,
  alt: img.alt,
  isHero: img.isHero,
  order: idx + 1,
  location: img.location || 'Concession Fieldwork Sector, Nigeria'
}));

const combinedImages = [...formattedNewImages, ...remappedExisting];
console.log(`Total combined gallery images: ${combinedImages.length}`);

// Category breakdown check
const breakdown = {};
combinedImages.forEach(img => {
  breakdown[img.category] = (breakdown[img.category] || 0) + 1;
});
console.log("Category breakdown in combined gallery images:", breakdown);

// Generate formatted TypeScript code for INITIAL_GALLERY_IMAGES
const imagesTsString = 'export const INITIAL_GALLERY_IMAGES: MediaItem[] = ' + JSON.stringify(combinedImages, null, 2) + ';';

// Replace in companyDataContent
companyDataContent = companyDataContent.replace(
  /export const INITIAL_GALLERY_IMAGES: MediaItem\[\] = \[[\s\S]*?\n\];/,
  imagesTsString
);

// 5. Update INITIAL_PROJECTS to reflect the 8 official categories
const updatedProjects = [
  {
    id: "prj-01",
    slug: "geological-structural-mapping-exploration",
    title: "Regional Geological Mapping & Mineralized Shear Zone Exploration",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    categoryKey: "GEOLOGICAL MAPPING & EXPLORATION",
    location: "Precambrian Metamorphic Belt, Nigeria",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg",
    summary: "High-resolution outcrop lithological mapping, foliation strike measurement with Clar compass, and strike continuity analysis across gold and base metal mineral concessions.",
    methodology: "Systematic 5km reconnaissance traverses, structural strike and dip plotting on geological field sheets, and selective petrographic chip sampling across crystalline basement exposures.",
    keyDeliverables: [
      "1:10,000 lithostratigraphic geological map sheets with structural polar stereonets",
      "Delineated mineralized quartz vein stockworks with strike continuity",
      "High-priority follow-up targets for diamond core drilling and trenching"
    ],
    galleryImages: [
      "https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg",
      "https://i.ibb.co/qYFRNWwV/IMG-20261030-WA0003.jpg",
      "https://i.ibb.co/CsHJChq7/IMG-20261030-WA0008.jpg",
      "https://i.ibb.co/gM8KVFYS/IMG-20261030-WA0014.jpg"
    ],
    featured: true,
    status: "Published"
  },
  {
    id: "prj-02",
    slug: "industrial-borehole-water-project",
    title: "Deep Aquifer Rotary Drilling & Industrial Water Infrastructure",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    categoryKey: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    location: "Industrial & Agricultural Corridor, Nigeria",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg",
    summary: "Heavy truck-mounted rotary borehole drilling penetrating deep productive aquifer horizons, followed by high-yield multi-stage pump installation and water distribution networks.",
    methodology: "Continuous mud rotary and DTH air percussion drilling, downhole geophysical logging, factory-slotted uPVC screen installation, graded silica gravel envelope packing, and 24-hour step-drawdown pumping tests.",
    keyDeliverables: [
      "Complete lithological and drilling penetration rate completion logs",
      "Step-drawdown pumping test reports verifying sustainable discharge >18 m³/hr",
      "Commissioned sanitary concrete apron, pump installation, and certified potability assays"
    ],
    galleryImages: [
      "https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg",
      "https://i.ibb.co/1tBv9HR5/IMG-20261030-WA0021.jpg",
      "https://i.ibb.co/tpbcLMD6/IMG-20261030-WA0024.jpg",
      "https://i.ibb.co/8nrgkSNd/IMG-20261030-WA0030.jpg"
    ],
    featured: true,
    status: "Published"
  },
  {
    id: "prj-03",
    slug: "geophysics-mineral-exploration",
    title: "2D Electrical Resistivity Tomography & Induced Polarization Mineral Survey",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    categoryKey: "GEOPHYSICS & MINERAL EXPLORATION",
    location: "Sulfide & Gold Prospecting Tenement",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg",
    summary: "Deep multi-electrode electrical resistivity tomography (ERT) and time-domain Induced Polarization (IP) profiling targeting disseminated sulfide ore and resistive auriferous quartz reefs.",
    methodology: "Deployed 64-electrode automated takeout arrays using Wenner-Schlumberger and Dipole-Dipole geometries, coupled with continuous proton precession ground magnetic grid profiling.",
    keyDeliverables: [
      "Inverted 2D and 3D subsurface resistivity and chargeability block models",
      "Georeferenced geophysical anomaly maps correlating low resistivity with high IP chargeability",
      "Recommended angled diamond drill collar coordinates and depth-to-target specifications"
    ],
    galleryImages: [
      "https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg",
      "https://i.ibb.co/bMFKd3hR/IMG-20261030-WA0036.jpg",
      "https://i.ibb.co/dJHrfNgX/IMG-20261030-WA0037.jpg",
      "https://i.ibb.co/nMNRQM6m/IMG-20261030-WA0050.jpg"
    ],
    featured: true,
    status: "Published"
  },
  {
    id: "prj-04",
    slug: "diamond-core-drilling-mineral-evaluation",
    title: "Diamond Wireline Core Drilling & Subsurface Mineral Evaluation",
    category: "CORE DRILLING & MINERAL EVALUATION",
    categoryKey: "CORE DRILLING & MINERAL EVALUATION",
    location: "Commercial Mineral Concession, Nigeria",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg",
    summary: "Angled diamond wireline core drilling achieving >98% solid core recovery, RQD geotechnical logging, structural core orientation, and diamond saw splitting for laboratory assay.",
    methodology: "Continuous wireline HQ/NQ triple-tube core barrel retrieval, geotechnical Rock Quality Designation (RQD) logging in labeled core boxes, core photography, and longitudinal half-core saw cutting.",
    keyDeliverables: [
      "Comprehensive digital core photographic archive and detailed geological logs",
      "RQD and geotechnical fracture frequency indices across all drill intervals",
      "QA/QC certified assay interval batches dispatched to accredited international laboratories"
    ],
    galleryImages: [
      "https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg",
      "https://i.ibb.co/NnN3BD6x/IMG-20261030-WA0053.jpg",
      "https://i.ibb.co/Nd7XqS3q/IMG-20261030-WA0057.jpg",
      "https://i.ibb.co/mVKHGprZ/IMG-20261030-WA0058.jpg"
    ],
    featured: true,
    status: "Published"
  },
  {
    id: "prj-05",
    slug: "regional-geochemical-mapping-soil-survey",
    title: "Regional Stream Sediment & Grid Soil Geochemical Mapping Campaign",
    category: "GEOCHEMICAL MAPPING",
    categoryKey: "GEOCHEMICAL MAPPING",
    location: "Drainage Basin Catchment, Mineral Sector",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/mV7tX06H/IMG-20261030-WA0064.jpg",
    summary: "Catchment-scale active stream sediment sampling, hydraulic trap recovery, and systematic B-horizon soil auger grid sampling with portable XRF in-situ multi-element assays.",
    methodology: "Multi-point sediment composite collection, -80 mesh stainless steel sieving, alluvial heavy mineral batea panning, and 1.0m depth hand auger soil sampling across a 50m x 200m grid.",
    keyDeliverables: [
      "Multi-element geochemical anomaly distribution maps (Au, Cu, Pb, Zn, Ni)",
      "Statistical multivariate correlation reports isolating pathfinder dispersion halos",
      "Prioritized target anomalies ranked for trenching and test drilling"
    ],
    galleryImages: [
      "https://i.ibb.co/mV7tX06H/IMG-20261030-WA0064.jpg",
      "https://i.ibb.co/fGkN4tpj/IMG-20261030-WA0065.jpg",
      "https://i.ibb.co/Xx62bGzr/IMG-20261030-WA0072.jpg",
      "https://i.ibb.co/gFcmkDqB/IMG-20261030-WA0030.jpg"
    ],
    featured: false,
    status: "Published"
  },
  {
    id: "prj-06",
    slug: "geospatial-boundary-gis-mapping",
    title: "Tenement Differential GPS Boundary Demarcation & GIS Spatial Integration",
    category: "GIS & GEOSPATIAL DATA SERVICES",
    categoryKey: "GIS & GEOSPATIAL DATA SERVICES",
    location: "Regional Mining Concession Sector",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg",
    summary: "Sub-centimeter RTK Differential GPS concession perimeter beacon demarcation, digital elevation modeling (DEM), and multi-layer GIS spatial database construction.",
    methodology: "Geodetic base-station RTK positioning, electronic total station topographic surveys, ground-truthed satellite imagery rectifications, and spatial cadastral compliance mapping.",
    keyDeliverables: [
      "Statutory cadastral boundary beacon survey plans signed by certified surveyors",
      "High-resolution Digital Elevation Models (DEM) and topographic contour overlays",
      "Fully integrated enterprise GIS project files with complete geospatial attribute tables"
    ],
    galleryImages: [
      "https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg",
      "https://i.ibb.co/v6CnPHFt/IMG-20261030-WA0048.jpg",
      "https://i.ibb.co/GvgYzGYX/IMG-20261030-WA0012.jpg"
    ],
    featured: false,
    status: "Published"
  },
  {
    id: "prj-07",
    slug: "geophysical-surveys-ves-profiling",
    title: "Vertical Electrical Sounding (VES) & Electromagnetic Fracture Profiling",
    category: "GEOPHYSICAL SURVEYS",
    categoryKey: "GEOPHYSICAL SURVEYS",
    location: "Crystalline Basement & Sedimentary Basins",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/TB2BV6QR/Whats-App-Image-2026-10-23-at-9-04-55-PM.jpg",
    summary: "Precision Schlumberger Vertical Electrical Soundings and frequency-domain electromagnetic profiling to map conductive fracture zones and aquifer horizons.",
    methodology: "ABEM Terrameter receiver calibration, electrode spacing expanding to AB/2 = 500m, contact resistance salting, and computer-assisted 1D IPI2win curve matching.",
    keyDeliverables: [
      "Apparent resistivity sounding curves and layer geoelectric models",
      "Isopach maps of weathered overburden and fractured bedrock depth",
      "Accurate drilling depth and casing schedule recommendations"
    ],
    galleryImages: [
      "https://i.ibb.co/TB2BV6QR/Whats-App-Image-2026-10-23-at-9-04-55-PM.jpg",
      "https://i.ibb.co/n8sFXNsV/IMG-20261030-WA0040.jpg",
      "https://i.ibb.co/tMdbXFQR/IMG-20261030-WA0035.jpg"
    ],
    featured: false,
    status: "Published"
  },
  {
    id: "prj-08",
    slug: "environmental-geoscience-baseline-impact-assessment",
    title: "Comprehensive Environmental Geoscience & Baseline Impact Study",
    category: "ENVIRONMENTAL GEOSCIENCE SERVICES",
    categoryKey: "ENVIRONMENTAL GEOSCIENCE SERVICES",
    location: "Concession Perimeter & Surrounding Communities",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
    summary: "Statutory environmental baseline investigation documenting baseline groundwater chemistry, topsoil heavy metal background, trial pit stratigraphy, and ecosystem vulnerability.",
    methodology: "Systematic multi-station soil and surface water sampling, geotechnical trial pit logging, in-situ physico-chemical parameter measurement (pH, EC, TDS), and chain-of-custody lab assays.",
    keyDeliverables: [
      "Statutory Environmental Impact Assessment (EIA) technical report compliant with FMEnv standards",
      "Aquifer vulnerability and contaminant migration risk models",
      "Environmental Management Plan (EMP) and groundwater monitoring schedule"
    ],
    galleryImages: [
      "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
      "https://i.ibb.co/gLFDJ8yH/Whats-App-Image-2026-10-23-at-6-39-33-PM.jpg",
      "https://i.ibb.co/fYMrymrK/IMG-20261030-WA0029.jpg"
    ],
    featured: false,
    status: "Published"
  }
];

const projectsTsString = 'export const INITIAL_PROJECTS: ProjectItem[] = ' + JSON.stringify(updatedProjects, null, 2) + ';';

companyDataContent = companyDataContent.replace(
  /export const INITIAL_PROJECTS: ProjectItem\[\] = \[[\s\S]*?\n\];/,
  projectsTsString
);

fs.writeFileSync(companyDataPath, companyDataContent, 'utf8');
console.log("Successfully updated src/data/companyData.ts!");
