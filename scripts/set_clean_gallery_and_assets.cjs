const fs = require('fs');
const path = require('path');

const { newImages } = require('./update_gallery_data.cjs');
console.log(`Loaded ${newImages.length} user images.`);

// Format the 78 gallery images cleanly
const galleryImages = newImages.map((img, idx) => ({
  id: `img-user-${String(idx + 1).padStart(2, '0')}`,
  url: img.url,
  title: img.title,
  caption: img.caption,
  category: img.category,
  alt: img.alt || img.title,
  isHero: img.isHero,
  order: idx + 1,
  location: img.location || 'Mineral Concession, Nigeria',
  showOnHomepage: true,
  showOnProjects: true,
  showOnGallery: true
}));

console.log(`Formatted ${galleryImages.length} gallery images. Category breakdown:`);
const cats = {};
galleryImages.forEach(img => {
  cats[img.category] = (cats[img.category] || 0) + 1;
});
console.log(cats);

// Video thumbnails mapping using verified user images
const videoThumbnails = {
  "vid-drill-01": "https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg",
  "vid-drill-02": "https://i.ibb.co/6960b5V/IMG-20261030-WA0005.jpg",
  "vid-drill-03": "https://i.ibb.co/9HrCtyrv/IMG-20261030-WA0015.jpg",
  "vid-drill-04": "https://i.ibb.co/1tBv9HR5/IMG-20261030-WA0021.jpg",
  "vid-drill-05": "https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg",
  "vid-drill-06": "https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg",
  "vid-drill-07": "https://i.ibb.co/0jYMN8Xz/IMG-20261030-WA0016.jpg",
  "vid-drill-08": "https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg",
  "vid-drill-09": "https://i.ibb.co/bM2B4MXr/IMG-20261030-WA0033.jpg",
  "vid-drill-10": "https://i.ibb.co/tpbcLMD6/IMG-20261030-WA0024.jpg",
  "vid-gal-11": "https://i.ibb.co/NnN3BD6x/IMG-20261030-WA0053.jpg",
  "vid-gal-12": "https://i.ibb.co/fGkN4tpj/IMG-20261030-WA0065.jpg",
  "vid-gal-13": "https://i.ibb.co/v6CnPHFt/IMG-20261030-WA0048.jpg",
  "vid-gal-14": "https://i.ibb.co/gM8KVFYS/IMG-20261030-WA0014.jpg"
};

// Read companyData.ts
const companyDataPath = path.join(__dirname, '../src/data/companyData.ts');
let content = fs.readFileSync(companyDataPath, 'utf8');

// 1. Update logoUrl to local /logo.jpg
content = content.replace(/logoUrl:\s*"[^"]+"/, 'logoUrl: "/logo.jpg"');

// 2. Replace INITIAL_GALLERY_IMAGES with ONLY the 78 user images
const galleryTs = 'export const INITIAL_GALLERY_IMAGES: MediaItem[] = ' + JSON.stringify(galleryImages, null, 2) + ';';
content = content.replace(/export const INITIAL_GALLERY_IMAGES: MediaItem\[\] = \[[\s\S]*?\n\];/, galleryTs);

// 3. Update video thumbnails
Object.entries(videoThumbnails).forEach(([id, thumb]) => {
  const reg = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?thumbnail:\\s*)"[^"]+"`);
  content = content.replace(reg, `$1"${thumb}"`);
});

// 4. Update INITIAL_SERVICES featured images to verified user images
const serviceImages = {
  "srv-01": "https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg",
  "srv-02": "https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg",
  "srv-03": "https://i.ibb.co/fYMrymrK/IMG-20261030-WA0029.jpg",
  "srv-04": "https://i.ibb.co/23vxMJPV/IMG-20261030-WA0055.jpg",
  "srv-05": "https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg",
  "srv-06": "https://i.ibb.co/v6CnPHFt/IMG-20261030-WA0048.jpg"
};

Object.entries(serviceImages).forEach(([id, img]) => {
  const reg = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?featuredImage:\\s*)"[^"]+"`);
  content = content.replace(reg, `$1"${img}"`);
});

// 5. Update INITIAL_PROJECTS images to verified user images
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
    methodology: "Systematic reconnaissance traverses, structural strike and dip plotting on geological field sheets, and selective petrographic chip sampling across crystalline basement exposures.",
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
      "https://i.ibb.co/gFcmkDqB/IMG-20261029-WA0030.jpg"
    ],
    featured: false,
    status: "Published"
  }
];

const projectsTs = 'export const INITIAL_PROJECTS: ProjectItem[] = ' + JSON.stringify(updatedProjects, null, 2) + ';';
content = content.replace(/export const INITIAL_PROJECTS: ProjectItem\[\] = \[[\s\S]*?\n\];/, projectsTs);

fs.writeFileSync(companyDataPath, content, 'utf8');
console.log("Successfully updated companyData.ts with ONLY the user images!");
