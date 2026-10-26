import { CompanyConfig, MediaItem, ServiceItem, ProjectItem, TeamMember, ArticleItem, ProjectVideo, ConsultationEnquiry, ProjectRecord } from '../types';

export const COMPANY_CONFIG: CompanyConfig = {
  name: "GiniBen & Partners GEOSERVICES LTD",
  tagline: "Precision Beneath the Surface.",
  supportingStatements: [
    "Exploring Resources. Unlocking Potential.",
    "Data. Depth. Development.",
    "Geoscience Meets Investment Confidence."
  ],
  domain: "https://ginibengeoservices.com/",
  legacyWebsite: "https://www.ginibengeoservicesltd.com/",
  facebookUrl: "https://www.facebook.com/share/19rQDUYSmo/?mibextid=wwXIfr",
  linkedinUrl: "https://www.linkedin.com/company/giniben-geoservices/",
  phone: "+234 803 625 1405",
  whatsappNumber: "+234 803 625 1405",
  email: "benukwutevinor@yahoo.com / gpg1.geoservices@gmail.com",
  address: "2 Leck Avenue, Adjacent State Police Headquarters GRA, Enugu, Enugu State, Nigeria",
  otherAddress: "#3 Nnamani Street, Trans Ekulu, Enugu",
  logoUrl: "https://i.ibb.co/YzZgSDd/logo.jpg",
  founderName: "Dr. Benjamin Ukwuteyinor, PhD",
  founderTitle: "Founder & Lead Consultant"
};

// 10 Videos for the "Drilling Operations & Subsurface Data Acquisition" section
export const FEATURED_DRILLING_VIDEOS: ProjectVideo[] = [
  {
    id: "vid-drill-01",
    title: "Rotary Borehole Drilling Operations",
    subtitle: "Deep Aquifer Siting & Continuous Mast Rotation",
    driveViewUrl: "https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1rpgjC2ms7rNimWZJj_ojICWy4Lwi-o8v/preview",
    thumbnail: "https://i.ibb.co/fdkK6DqF/Whats-App-Image-2026-10-23-at-9-04-53-PM.jpg",
    description: "Real-time field footage documenting heavy rotary drilling mast operation, hydraulic feed control, and borehole mud circulation on high-elevation concession.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-02",
    title: "Exploration Trenching & Saprolite Profiling",
    subtitle: "CAT Excavator Cutting Geological Trial Trench",
    driveViewUrl: "https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/15kx2J7iKVw_GepfdeUcN6j-dwm5kH-lE/preview",
    thumbnail: "https://i.ibb.co/bVLyVQK/Whats-App-Image-2026-10-23-at-9-05-15-PM.jpg",
    description: "Direct operational footage of heavy tracked excavator profiling lateritic overburden and exposing underlying weathered saprolite bedrock.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-03",
    title: "Downhole Drill Stem & Casing Installation",
    subtitle: "Rotary Mast Coupling & Hydrogeological Advancement",
    driveViewUrl: "https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1p2F0QczVzj2EMcVEF_DrN8_9V_bbWt5D/preview",
    thumbnail: "https://i.ibb.co/HDg6v6dn/Whats-App-Image-2026-10-23-at-9-05-42-PM.jpg",
    description: "On-site drilling personnel managing high-torque drill pipe couplings, casing shoe positioning, and downhole penetration monitoring.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-04",
    title: "High-Yield Borehole Pumping & Flow Testing",
    subtitle: "Aquifer Productivity & Transmissivity Validation",
    driveViewUrl: "https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1DEExffN0aik11vGK72d_dH-U2pzEDZ4e/preview",
    thumbnail: "https://i.ibb.co/spHX4r3b/Whats-App-Image-2026-10-23-at-9-04-48-PM.jpg",
    description: "Field testing and step-drawdown pumping test verifying commercial water yield and clean discharge rate from industrial production borehole.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-05",
    title: "Geological Outcrop Structural Assessment",
    subtitle: "Highland Ridge Lithological & Joint Mapping",
    driveViewUrl: "https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1yotnY29YMEKOlwrnYiy7WyXj5tBA9fL1/preview",
    thumbnail: "https://i.ibb.co/TB2BV6QR/Whats-App-Image-2026-10-23-at-9-04-55-PM.jpg",
    description: "Dr. Ben Ukwuteyinor directing technical field team during structural strike, dip measurement, and mineral vein logging across highland escarpment.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-06",
    title: "Geophysical Electrical Resistivity Survey",
    subtitle: "Multi-Electrode Vertical Electrical Sounding (VES)",
    driveViewUrl: "https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/16eb4hsKJxK6e2rqZTsed0h_GtXIVgl_z/preview",
    thumbnail: "https://i.ibb.co/604pqSkJ/Whats-App-Image-2026-10-23-at-9-22-54-PM-1.jpg",
    description: "Field geophysicists operating terrameter instrumentation to delineate subsurface resistivity layers and fracture corridors for deep borehole siting.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-07",
    title: "Geotechnical Trial Pit Profile Logging",
    subtitle: "In-Situ Soil Stratigraphy & Infiltration Evaluation",
    driveViewUrl: "https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1SzDTxr1kXyd1oKG91aLq1FIaIEJ3nsnA/preview",
    thumbnail: "https://i.ibb.co/yBbWDvCR/Whats-App-Image-2026-10-23-at-9-04-58-PM-1.jpg",
    description: "Manual excavation of deep geotechnical trial pits to inspect layer cohesion, density, and depth to bedrock ahead of drilling and foundation works.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-08",
    title: "Subsurface Core Logging & Drilling Operations Archive",
    subtitle: "Comprehensive Subsurface Exploration Documentation",
    driveViewUrl: "https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1oZjEdTBiPy-pz2beARbh_RhtqMPHrMsr/preview",
    thumbnail: "https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg",
    description: "Detailed operational capture of drilling rig logistics, diamond core recovery, ground validation, and engineering fieldwork executed by GiniBen personnel.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-09",
    title: "Turnkey Solar Water Scheme Infrastructure",
    subtitle: "Elevated Storage Tank & Public Water Dispenser",
    driveViewUrl: "https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1bPQbv0ru2j6ATl5ofBz2k6_BqF4dE4WP/preview",
    thumbnail: "https://i.ibb.co/chxd1T9M/Whats-App-Image-2026-10-23-at-9-04-40-PM.jpg",
    description: "Operational inspection of completed solar-powered water scheme delivering potable water to local community.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-drill-10",
    title: "Geochemical Stream Sediment Sieving & Sampling",
    subtitle: "Fractionation & Sample Envelope Verification",
    driveViewUrl: "https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1ccLm8FCB1uKhPn28qhNGHlo0JrPhFUqc/preview",
    thumbnail: "https://i.ibb.co/d0grTtvr/Whats-App-Image-2026-10-23-at-9-05-31-PM.jpg",
    description: "Standardized -80 mesh sieving of stream sediments along drainage channels for trace element pathfinder exploration.",
    isVertical: true,
    orientation: 'vertical'
  }
];

// All 14 Field Videos for the Dedicated Video Gallery
export const ALL_PROJECT_VIDEOS: ProjectVideo[] = [
  ...FEATURED_DRILLING_VIDEOS,
  {
    id: "vid-gal-11",
    title: "Industrial Quarry Crushing & Conveyor Transport",
    subtitle: "Aggregate Plant Primary Jaw & Screening Circuit",
    driveViewUrl: "https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1sNl4iA_We7bfkFXAGwY5VQD0zm2ZTkxn/preview",
    thumbnail: "https://i.ibb.co/YTP1ZrMT/Whats-App-Image-2026-10-23-at-9-23-03-PM.jpg",
    description: "Mechanical reduction of solid rock in primary jaw crusher and transfer via heavy-duty inclined conveyor gantries.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-gal-12",
    title: "Alluvial Gold & Heavy Mineral Gravity Panning",
    subtitle: "Stream Bed Alluvial Sampling Protocol",
    driveViewUrl: "https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1x0ukg1kNtAoTJhoCha7VoJiutXVJYUGS/preview",
    thumbnail: "https://i.ibb.co/fdX9gcH5/Whats-App-Image-2026-10-23-at-9-05-20-PM-1.jpg",
    description: "Sediment panning and recovery of heavy mineral concentrates in river gravels for mineral prospectivity analysis.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-gal-13",
    title: "Exploration Concession Boundary Differential GPS Survey",
    subtitle: "Precision Perimeter Verification & Staking",
    driveViewUrl: "https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1ZsLBm8mZVLm2KjNk3LWXPPrXPCzTay2o/preview",
    thumbnail: "https://i.ibb.co/G45M6D4f/Whats-App-Image-2026-10-23-at-9-22-51-PM-1.jpg",
    description: "Traversing boundary corner beacons with differential GPS to calibrate concession borders and survey transects.",
    isVertical: true,
    orientation: 'vertical'
  },
  {
    id: "vid-gal-14",
    title: "Highland Escarpment Geological Reconnaissance",
    subtitle: "Topographical Elevation & Lithology Survey",
    driveViewUrl: "https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1df-kGRrmsS9RBpJfSNSWTfeenTQT34Ol/preview",
    thumbnail: "https://i.ibb.co/zh3C9tbT/Whats-App-Image-2026-10-23-at-9-04-56-PM.jpg",
    description: "Comprehensive mapping of highland sandstone ridges and mineral contact zones across Udi plateau.",
    isVertical: true,
    orientation: 'vertical'
  }
];

export const PROJECT_VIDEOS: ProjectVideo[] = FEATURED_DRILLING_VIDEOS;

export const INITIAL_GALLERY_IMAGES: MediaItem[] = [
  {
    id: "img-01",
    url: "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg",
    title: "Exploration Trenching & Trial Pit Excavation",
    caption: "Tracked CAT excavator cutting deep exploration trench for stratigraphic profiling and mineral vein exposure.",
    category: "geology",
    alt: "Tracked hydraulic excavator digging deep trench in lateritic terrain",
    isHero: true,
    order: 1,
    location: "Mineral Exploration Corridor"
  },
  {
    id: "img-02",
    url: "https://i.ibb.co/yngMcXWr/Whats-App-Image-2026-10-23-at-6-39-30-PM.jpg",
    title: "Stratigraphic Horizon & Soil Profile Inspection",
    caption: "Excavated trial trench exposing undisturbed vertical soil horizons and weathered basement contact.",
    category: "geology",
    alt: "Undisturbed trial trench showing stratigraphical soil layers and basement contact",
    isHero: true,
    order: 2,
    location: "Concession Exploration Sector"
  },
  {
    id: "img-03",
    url: "https://i.ibb.co/JFpB1MRs/Whats-App-Image-2026-10-23-at-6-39-31-PM-1.jpg",
    title: "CAT 225DLC Heavy Excavator in Trenching Operation",
    caption: "Hydraulic crawler excavator scooping laterite soil and weathered rock overburden along survey transect.",
    category: "geology",
    alt: "CAT 225DLC excavator bucket scooping lateritic soil trench",
    isHero: true,
    order: 3,
    location: "Fieldwork Trenching Transect"
  },
  {
    id: "img-04",
    url: "https://i.ibb.co/tp4Sj6hz/Whats-App-Image-2026-10-23-at-6-39-31-PM-2.jpg",
    title: "Geotechnical Trial Pit Depth & Soil Logging",
    caption: "Field technician using calibrated yellow tape measure to record precise depth intervals of excavated test pit.",
    category: "geophysics",
    alt: "Square test pit with yellow measuring tape recording excavation depth",
    isHero: true,
    order: 4,
    location: "Geotechnical Investigation Site"
  },
  {
    id: "img-05",
    url: "https://i.ibb.co/h1gTzjgy/Whats-App-Image-2026-10-23-at-6-39-31-PM.jpg",
    title: "Excavation Pit Hardpan & Boulder Penetration",
    caption: "Excavator bucket breaking through compact lateritic hardpan and boulder horizons during trial pit advance.",
    category: "geology",
    alt: "Hydraulic excavator bucket lifting boulder laterite from exploration trench",
    isHero: true,
    order: 5,
    location: "Trial Pit Section"
  },
  {
    id: "img-06",
    url: "https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg",
    title: "Stream Sediment & Mineral Panning Sample Recovery",
    caption: "Geoscientist in safety gloves and gumboots pouring panned heavy mineral concentrates through funnel into sample packet for geochemical assay.",
    category: "geology",
    alt: "Geoscientist bagging panned heavy mineral concentrates with GPS coordinates",
    isHero: true,
    order: 6,
    location: "5°57'15.792\"N, 7°42'45.798\"E (Alt: 62.6m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-07",
    url: "https://i.ibb.co/Cp1BZXSK/Whats-App-Image-2026-10-23-at-6-39-32-PM.jpg",
    title: "Exploration Trenching & Field Security Logistics",
    caption: "Continuous trial trench excavation in lateritic terrain with operational field security monitoring project perimeter.",
    category: "geology",
    alt: "Heavy excavator cutting trench with field security personnel monitoring site",
    isHero: true,
    order: 7,
    location: "Exploration Concession Perimeter"
  },
  {
    id: "img-08",
    url: "https://i.ibb.co/sdPT6Zxq/Whats-App-Image-2026-10-23-at-6-39-33-PM-1.jpg",
    title: "Undisturbed Rectangular Trial Pit Profile",
    caption: "Deep test pit exposing stable sidewall lithology, soil moisture transitions, and rock competence for engineering foundation evaluation.",
    category: "geophysics",
    alt: "Deep rectangular trial pit showing vertical soil profile",
    isHero: true,
    order: 8,
    location: "Foundation Feasibility Zone"
  },
  {
    id: "img-09",
    url: "https://i.ibb.co/WvGQMHmf/Whats-App-Image-2026-10-23-at-6-39-33-PM-2.jpg",
    title: "Geochemical Sample Bagging & QA/QC Identification",
    caption: "Field geologists bagging and labelling stream sediment sample SP-014 with precise geostamped satellite coordinates.",
    category: "geology",
    alt: "Field geologists packaging sample SP-014 through funnel",
    isHero: true,
    order: 9,
    location: "5°57'19.662\"N, 7°42'22.17\"E (Alt: 60.1m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-10",
    url: "https://i.ibb.co/gLFDJ8yH/Whats-App-Image-2026-10-23-at-6-39-33-PM.jpg",
    title: "Stream Alluvium Wet-Sieving & Mineral Separation",
    caption: "Geoscientist wet-sieving alluvium through nested mesh screens in bamboo drainage creek to isolate target heavy minerals.",
    category: "geology",
    alt: "Geoscientist wet-sieving stream sediment samples in field",
    isHero: true,
    order: 10,
    location: "5°57'15.69\"N, 7°42'45.852\"E (Alt: 57.5m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-11",
    url: "https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg",
    title: "Geotechnical Soil Pit Depth Measurement: Ishiagu",
    caption: "Measuring depth and logging lithological boundary of trial pit along Amokwe Road, Ishiagu, Ivo LGA, Ebonyi State.",
    category: "geophysics",
    alt: "Measuring tape inside trial pit in Ishiagu, Ebonyi State",
    isHero: true,
    order: 11,
    location: "Amokwe Road, Ishiagu, Ivo LGA, Ebonyi (Alt: 78.2m)",
    date: "12 Feb 2026"
  },
  {
    id: "img-12",
    url: "https://i.ibb.co/XrttsZQL/Whats-App-Image-2026-10-23-at-6-39-34-PM.jpg",
    title: "Sealed Geochemical Sample Pouch (OKP-SD-013)",
    caption: "Lead geologist displaying sealed and verified stream sediment geochemical sample packet OKP-SD-013 with GPS documentation.",
    category: "geology",
    alt: "Lead geologist holding sealed sample packet OKP-SD-013",
    isHero: true,
    order: 12,
    location: "5°57'15.666\"N, 7°42'45.804\"E (Alt: 61.9m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-13",
    url: "https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg",
    title: "Rehabilitation of Onuagu Water Scheme: Project Signboard",
    caption: "Official project board confirming GiniBen & Partners Geoservices Ltd as contractor for Enugu State Ministry of Water Resources.",
    category: "groundwater",
    alt: "Project signboard for Rehabilitation of Onuagu Water Scheme with elevated water tank",
    isHero: true,
    order: 13,
    location: "Oyofo Oghe, Ezeagu LGA, Enugu State"
  },
  {
    id: "img-14",
    url: "https://i.ibb.co/b5V0nds7/Whats-App-Image-2026-10-23-at-6-39-35-PM-2.jpg",
    title: "MWF GF-1000 33-Elements Long Range Locator System",
    caption: "Specialized geophysical sensor system featuring ground reinforcement transmitter, directional antenna locator, and acoustic receiver console.",
    category: "instruments",
    alt: "MWF GF-1000 33-element long range detector instrumentation",
    isHero: true,
    order: 14,
    location: "Geophysical Instrumentation Inventory"
  },
  {
    id: "img-15",
    url: "https://i.ibb.co/1J6tGDFq/Whats-App-Image-2026-10-23-at-6-39-35-PM.jpg",
    title: "Trial Pit Manual Excavation & In-Situ Density Check",
    caption: "Field technician demonstrating depth within hand-dug trial pit prior to undisturbed soil core sampling.",
    category: "geophysics",
    alt: "Field technician inside deep trial pit with spade",
    isHero: true,
    order: 15,
    location: "Soil Mechanics Test Sector"
  },
  {
    id: "img-16",
    url: "https://i.ibb.co/HpT9hCQ3/Whats-App-Image-2026-10-23-at-6-39-36-PM-1.jpg",
    title: "Stream Bed Alluvial Sampling & Trench Digging",
    caption: "Geoscientist digging alluvial sediment from creek bed into panning trays for heavy mineral concentrate isolation.",
    category: "geology",
    alt: "Geoscientist digging stream bed gravels with spade",
    isHero: true,
    order: 16,
    location: "5°57'15.762\"N, 7°42'45.846\"E (Alt: 67.9m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-17",
    url: "https://i.ibb.co/DHP3RGM0/Whats-App-Image-2026-10-23-at-6-39-36-PM-2.jpg",
    title: "Dr. Benjamin Ukwuteyinor & Team Outcrop Mapping: Nsude",
    caption: "Dr. Ben Ukwuteyinor directing GPG geological team during structural outcrop investigation on Udi ridge, Nsude, Enugu.",
    category: "team",
    alt: "Dr. Benjamin Ukwuteyinor and GPG field team mapping outcrop on hillside in Nsude",
    isHero: true,
    order: 17,
    location: "Nsude, Udi LGA, Enugu State (Alt: 487.5m)",
    date: "22 Jul 2026"
  },
  {
    id: "img-18",
    url: "https://i.ibb.co/HLPjmqyK/Whats-App-Image-2026-10-23-at-6-39-37-PM-1.jpg",
    title: "Deep Geotechnical Trial Pit in Sandstone Horizon",
    caption: "Vertical shaft test pit excavated into weathered sandstone and clay stratum for bearing capacity and foundation assessment.",
    category: "geophysics",
    alt: "Deep square test pit in sandstone stratum",
    isHero: false,
    order: 18,
    location: "Foundation Feasibility Transect"
  },
  {
    id: "img-19",
    url: "https://i.ibb.co/Y4p0qFvG/Whats-App-Image-2026-10-23-at-6-39-37-PM-2.jpg",
    title: "Heavy 6x6 Truck-Mounted Rotary Drilling Rig",
    caption: "High-capacity heavy drilling rig equipped with lattice folding mast, mud circulation pump, and high-pressure compressor for deep water wells and mineral core holes.",
    category: "drilling",
    alt: "Heavy 6x6 truck-mounted rotary drilling rig with lattice mast",
    isHero: true,
    order: 19,
    location: "Heavy Equipment Mobilization Depot"
  },
  {
    id: "img-20",
    url: "https://i.ibb.co/DHnrs3Hg/Whats-App-Image-2026-10-23-at-6-39-37-PM.jpg",
    title: "Stream Sediment Fractionation & Fine Recovery",
    caption: "Controlled funnel transfer of sieved heavy fraction into moisture-resistant paper envelope for laboratory XRF/ICP-MS analysis.",
    category: "geology",
    alt: "Pouring sieved mineral fraction through funnel into sample packet",
    isHero: false,
    order: 20,
    location: "5°57'15.696\"N, 7°42'45.78\"E (Alt: 60.9m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-21",
    url: "https://i.ibb.co/0psMBYqs/Whats-App-Image-2026-10-23-at-6-39-38-PM-1.jpg",
    title: "Field Panning Heavy Mineral Concentrate Transfer",
    caption: "Dual geoscientist team pouring concentrated stream sediment from wooden batea gold pan into sample cone funnel.",
    category: "geology",
    alt: "Geologists pouring concentrated mineral samples into sample envelope",
    isHero: false,
    order: 21,
    location: "5°57'21.432\"N, 7°42'9.486\"E (Alt: 64.6m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-22",
    url: "https://i.ibb.co/ccsDQjRW/Whats-App-Image-2026-10-23-at-6-39-38-PM.jpg",
    title: "Community Water Scheme Wellhead & Dispensing Standpipes",
    caption: "GiniBen engineers and community leaders standing around newly cast concrete apron with twin water dispensing standpipes, Hilux 4x4 in background.",
    category: "groundwater",
    alt: "Engineers and community leaders inspecting newly cast water tap apron and standpipes",
    isHero: true,
    order: 22,
    location: "Community Water Project Site"
  },
  {
    id: "img-23",
    url: "https://i.ibb.co/VYCKFqT7/Whats-App-Image-2026-10-23-at-6-39-39-PM-1.jpg",
    title: "Geochemical Sample Batch Cataloging (OKP-SD-001 to 015)",
    caption: "Numbered stream sediment sample pouches organized sequentially on field table for chain-of-custody laboratory dispatch.",
    category: "geology",
    alt: "15 labeled geochemical sample packets laid out on blue table",
    isHero: false,
    order: 23,
    location: "Field Basecamp Laboratory"
  },
  {
    id: "img-24",
    url: "https://i.ibb.co/ksFt40BR/Whats-App-Image-2026-10-23-at-6-39-39-PM-2.jpg",
    title: "Galvanized Steel Overhead Water Storage Tower & Scheme",
    caption: "High-elevation steel water tank tower with cat ladder, security fence, and project billboard constructed for Oyoho Health Center by GiniBen.",
    category: "groundwater",
    alt: "Galvanized steel overhead water tank tower with security perimeter",
    isHero: false,
    order: 24,
    location: "Oyoho Health Center, Ezeagu LGA, Enugu"
  },
  {
    id: "img-25",
    url: "https://i.ibb.co/JwcM61yS/Whats-App-Image-2026-10-23-at-6-39-39-PM.jpg",
    title: "Multi-Tap Potable Water Dispensing Point Commissioning",
    caption: "Four active taps discharging pure borehole water simultaneously onto tiled apron while project supervisor inspects flow rate.",
    category: "groundwater",
    alt: "Four water taps flowing on brick-tiled apron with inspector washing hands",
    isHero: true,
    order: 25,
    location: "Completed Water Dispensing Facility"
  },
  {
    id: "img-26",
    url: "https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg",
    title: "Geochemical Mineral Fraction Bagging in Drainage Basin",
    caption: "Field samplers transferring washed sediment grains from pan into field sampling packet with precise GPS satellite location.",
    category: "geology",
    alt: "Transferring mineral grains into funnel at creek drainage basin",
    isHero: false,
    order: 26,
    location: "5°57'21.45\"N, 7°42'9.45\"E (Alt: 63.6m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-27",
    url: "https://i.ibb.co/9kHrKR7Q/Whats-App-Image-2026-10-23-at-6-39-40-PM.jpg",
    title: "Wet-Sieving & Mineral Fractionation in Sieve Drum",
    caption: "Geoscientist in safety gloves manually agitating sediment slurry in sieve drum to remove oversized gravel and retain target fractions.",
    category: "geology",
    alt: "Geoscientist agitating sediment inside nested sieve drum",
    isHero: false,
    order: 27,
    location: "5°57'21.486\"N, 7°42'9.504\"E (Alt: 63.7m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-28",
    url: "https://i.ibb.co/CpQtM2RW/Whats-App-Image-2026-10-23-at-6-39-41-PM-1.jpg",
    title: "Continuous Exploration Trench Excavation to Water Seepage",
    caption: "Deep trial trench excavated through laterite soil down to groundwater table showing active water pooling and stratum contact.",
    category: "geology",
    alt: "Long exploration trench with water pooling at bottom excavated by CAT machine",
    isHero: true,
    order: 28,
    location: "Exploration Trenching Corridor"
  },
  {
    id: "img-29",
    url: "https://i.ibb.co/0yWdwfj5/Whats-App-Image-2026-10-23-at-6-39-41-PM.jpg",
    title: "Alluvial Mineral Panning in Creek Drainage Channel",
    caption: "Field sampling crew panning creek alluvium under senior consultant supervision in agricultural basin.",
    category: "geology",
    alt: "Field crew panning sediment in creek channel with supervisor observing",
    isHero: false,
    order: 29,
    location: "Alluvial Sampling Basin"
  },
  {
    id: "img-30",
    url: "https://i.ibb.co/KpTSkxn0/Whats-App-Image-2026-10-23-at-6-39-42-PM-1.jpg",
    title: "Stream Sediment Mesh Sieving in Bamboo Riparian Zone",
    caption: "Sediment preparation and classification using metallurgical sieves in bamboo canopy with satellite positioning stamp.",
    category: "geology",
    alt: "Sieving sediment samples with nested sieves in bamboo riparian grove",
    isHero: false,
    order: 30,
    location: "5°57'15.654\"N, 7°42'45.846\"E (Alt: 58.6m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-31",
    url: "https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg",
    title: "Dr. Benjamin Ukwuteyinor Structural Geological Traverse",
    caption: "Lead consultant Dr. Ben Ukwuteyinor and GPG field geologists logging outcrop strike, dip, and lithology in Nsude, Udi LGA, Enugu.",
    category: "team",
    alt: "Dr. Ben Ukwuteyinor pointing to outcrop with geologists taking notes on hillside in Nsude",
    isHero: true,
    order: 31,
    location: "Nsude, Udi LGA, Enugu (Alt: 487.5m)",
    date: "22 Jul 2026"
  },
  {
    id: "img-32",
    url: "https://i.ibb.co/nNRMvYfy/Whats-App-Image-2026-10-23-at-6-39-42-PM.jpg",
    title: "Alluvial Panning Samplers in Stream Bed",
    caption: "Field technicians in high-visibility safety vests washing and swirling heavy gravels in panning pans to detect indicator minerals.",
    category: "geology",
    alt: "Two field samplers wearing hi-vis vests panning stream gravels",
    isHero: false,
    order: 32,
    location: "Alluvial Exploration Transect",
    date: "9 Jul 2026"
  },
  {
    id: "img-33",
    url: "https://i.ibb.co/6J15k85w/Whats-App-Image-2026-10-23-at-6-39-43-PM-1.jpg",
    title: "Highland Geological Reconnaissance Team: Nsude Ridge",
    caption: "Consulting geologists recording GPS coordinates, elevation, and structural lithology on scenic highland ridge overlooking Enugu valley.",
    category: "team",
    alt: "GPG geoscience crew recording structural data on Nsude ridge elevation 487.5m",
    isHero: false,
    order: 33,
    location: "Nsude Ridge, Udi LGA, Enugu State",
    date: "22 Jul 2026"
  },
  {
    id: "img-34",
    url: "https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg",
    title: "Active Rotary Borehole Drilling Rig & Pipe Assembly",
    caption: "Drilling crew in hardhats and protective gear managing drill pipe couplings and hydraulic rotary mast on a deep water well.",
    category: "drilling",
    alt: "Drilling crew operating rotary drill rig with drill pipes on racks in foreground",
    isHero: true,
    order: 34,
    location: "Deep Groundwater Drilling Site"
  },
  {
    id: "img-35",
    url: "https://i.ibb.co/ZzXJCFKM/Whats-App-Image-2026-10-23-at-6-39-43-PM.jpg",
    title: "Cataloged Geochemical Assay Sample Envelopes",
    caption: "Overhead view of labeled stream sediment geochemical sample envelopes (OKP-SD-001 to 015) ready for dispatch.",
    category: "geology",
    alt: "Overhead view of labeled sample bags organized on field table",
    isHero: false,
    order: 35,
    location: "Field Laboratory Processing"
  },
  {
    id: "img-36",
    url: "https://i.ibb.co/4nK4wrRQ/Whats-App-Image-2026-10-23-at-6-39-44-PM-1.jpg",
    title: "Open-Cast Coal Seam & Mineral Quarry Stratigraphy",
    caption: "Tracked green excavator exposing thick black bituminous coal / carbonaceous shale bed beneath reddish overburden in Enugu basin.",
    category: "geology",
    alt: "Excavator digging into exposed black coal seam beneath red overburden in Enugu quarry",
    isHero: false,
    order: 36,
    location: "Enugu Solid Minerals Quarry",
    date: "28 Nov 2025"
  },
  {
    id: "img-37",
    url: "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
    title: "Turnkey Solar-Powered Community Water Scheme",
    caption: "Commissioned solar-powered water facility featuring elevated steel storage tank with rooftop solar array, pump house, and 4-tap brick dispensing station.",
    category: "groundwater",
    alt: "Turnkey solar borehole water scheme with elevated tank and brick tap dispenser",
    isHero: true,
    order: 37,
    location: "Rural Water Supply Scheme, Enugu"
  },
  {
    id: "img-38",
    url: "https://i.ibb.co/wN8RhZQm/Whats-App-Image-2026-10-23-at-6-39-45-PM.jpg",
    title: "Open-Pit Mine Face & Overburden Stripping",
    caption: "Heavy excavators bench-stripping red weathered overburden to expose commercial solid mineral and coal horizons.",
    category: "geology",
    alt: "Excavators stripping red overburden above thick dark mineral seam",
    isHero: false,
    order: 38,
    location: "Open-Pit Mineral Extraction Site"
  },
  {
    id: "img-39",
    url: "https://i.ibb.co/GvWdkt9q/Whats-App-Image-2026-10-23-at-6-39-46-PM-1.jpg",
    title: "Geophysical Resistivity Survey & Subsurface Imaging",
    caption: "GiniBen geophysicists operating portable electrical resistivity terrameter console in field for vertical electrical sounding (VES) and aquifer siting.",
    category: "geophysics",
    alt: "Geophysicists in field with instrument flight case and portable resistivity meter",
    isHero: false,
    order: 39,
    location: "Geophysical Exploration Grid"
  },
  {
    id: "img-40",
    url: "https://i.ibb.co/Vcj2KcYL/Whats-App-Image-2026-10-23-at-6-39-46-PM-2.jpg",
    title: "Outcrop Strike & Dip Structural Logging: Ngwo Uno",
    caption: "Field geologists logging structural attitude and dip angles along Asaba-Onitsha-Enugu Road escarpment, Ngwo Uno, Udi LGA, Enugu.",
    category: "team",
    alt: "Geologists with GPG vest logging rock outcrop in Ngwo Uno, Udi LGA",
    isHero: true,
    order: 40,
    location: "Asaba-Onitsha-Enugu Rd, Ngwo Uno, Udi, Enugu (Alt: 487.5m)",
    date: "22 Jul 2026"
  },
  {
    id: "img-41",
    url: "https://i.ibb.co/27DRRcpd/Whats-App-Image-2026-10-23-at-6-39-46-PM.jpg",
    title: "Geochemical Field Geologist with Sample Packet (OKP-SD-015)",
    caption: "Field geologist holding verified sample packet OKP-SD-015 with collection shovel and sieve pans in stream channel.",
    category: "geology",
    alt: "Geologist holding sample packet OKP-SD-015 in stream trench",
    isHero: false,
    order: 41,
    location: "5°57'21.486\"N, 7°42'9.51\"E (Alt: 65.4m)",
    date: "14 Feb 2026"
  },
  {
    id: "img-42",
    url: "https://i.ibb.co/rRbhQSZn/Whats-App-Image-2026-10-23-at-9-22-56-PM-2.jpg",
    title: "Stream Sediment Sieving and Heavy Mineral Panning",
    caption: "Field geoscientist processing stream gravels using standardized brass sieves along active drainage channels.",
    category: "geology",
    alt: "Field geologist sieving stream sediment into basin along river bank",
    isHero: false,
    order: 42,
    location: "Drainage Catchment Exploration Transect",
    date: "14 Feb 2026"
  },
  {
    id: "img-43",
    url: "https://i.ibb.co/4wwZKF6J/Whats-App-Image-2026-10-23-at-9-23-06-PM-2.jpg",
    title: "Riverbed Bedrock Exposure and Lithological Logging",
    caption: "Geoscientist conducting in-situ lithological inspection and sampling of crystalline riverbed rock outcrops.",
    category: "geology",
    alt: "Geoscientist inspecting water-washed bedrock exposures in riverbed",
    isHero: false,
    order: 43,
    location: "River Valley Geological Traverse",
    date: "14 Feb 2026"
  },
  {
    id: "img-44",
    url: "https://i.ibb.co/bM2PDHmB/Whats-App-Image-2026-10-23-at-9-23-06-PM-1.jpg",
    title: "Quartz Vein Mineralization and Host Rock Contact",
    caption: "Close-up structural investigation of hydrothermal quartz veining cutting across crystalline basement rock.",
    category: "geology",
    alt: "Hydrothermal quartz vein intruding weathered crystalline bedrock",
    isHero: false,
    order: 44,
    location: "Basement Complex Structural Horizon",
    date: "15 Feb 2026"
  },
  {
    id: "img-45",
    url: "https://i.ibb.co/hJcMQC2n/Whats-App-Image-2026-10-23-at-9-23-06-PM.jpg",
    title: "Highland Ridge Escarpment Geological Reconnaissance",
    caption: "GiniBen exploration team traversing high-elevation sandstone ridges to delineate regional lineaments.",
    category: "team",
    alt: "Geologists standing on high plateau ridge overlooking forested valley",
    isHero: true,
    order: 45,
    location: "Udi Plateau Escarpment, Enugu",
    date: "22 Jul 2026"
  },
  {
    id: "img-46",
    url: "https://i.ibb.co/qL79gVKY/Whats-App-Image-2026-10-23-at-9-23-05-PM-2.jpg",
    title: "Deep Rotary Borehole Rig Mobilization and Setup",
    caption: "Hydraulic heavy rotary drill rig mast raised and stabilized with hydraulic outriggers on production drilling pad.",
    category: "groundwater",
    alt: "Heavy-duty truck-mounted rotary drill rig mast erect on drilling site",
    isHero: false,
    order: 46,
    location: "Industrial Groundwater Wellfield, Enugu",
    date: "18 Aug 2026"
  },
  {
    id: "img-47",
    url: "https://i.ibb.co/N601b26D/Whats-App-Image-2026-10-23-at-9-23-05-PM.jpg",
    title: "Borehole Steel Casing and Drill Stem Handling",
    caption: "Drilling crew guiding heavy gauge casing pipes into borehole collar to secure unstable upper formation.",
    category: "groundwater",
    alt: "Drilling crew positioning heavy steel borehole casing section",
    isHero: false,
    order: 47,
    location: "Community Water Production Well",
    date: "19 Aug 2026"
  },
  {
    id: "img-48",
    url: "https://i.ibb.co/JhNfBJ5/Whats-App-Image-2026-10-23-at-9-23-04-PM-1.jpg",
    title: "Structural Strike and Dip Measurement with Clinometer",
    caption: "Precision measurement of bedding attitude and foliation dip angles using geological compass-clinometer.",
    category: "geology",
    alt: "Geologist using compass-clinometer on inclined bedding plane",
    isHero: false,
    order: 48,
    location: "Outcrop Exposure, Ngwo Uno, Enugu",
    date: "22 Jul 2026"
  },
  {
    id: "img-49",
    url: "https://i.ibb.co/Gvzm0rkf/Whats-App-Image-2026-10-23-at-9-23-04-PM.jpg",
    title: "Digital Resistivity Terrameter Instrument Display",
    caption: "Field calibration and real-time resistance monitoring on digital terrameter console during VES survey.",
    category: "instruments",
    alt: "Digital terrameter instrumentation screen showing resistivity metrics",
    isHero: false,
    order: 49,
    location: "Geophysical Calibration Station",
    date: "03 Sep 2026"
  },
  {
    id: "img-50",
    url: "https://i.ibb.co/qYjw7Vqq/Whats-App-Image-2026-10-23-at-9-23-03-PM-1.jpg",
    title: "Multicore Cable Deployment for Resistivity Sounding",
    caption: "Technical crew deploying multicore survey cables across exploration profile line for electrical resistivity tomography.",
    category: "geophysics",
    alt: "Field team rolling out high-visibility multicore geophysics cables",
    isHero: false,
    order: 50,
    location: "Aquifer Delineation Grid",
    date: "03 Sep 2026"
  },
  {
    id: "img-51",
    url: "https://i.ibb.co/YTP1ZrMT/Whats-App-Image-2026-10-23-at-9-23-03-PM.jpg",
    title: "Quarry Primary Jaw Crusher and Sizing Conveyor",
    caption: "Heavy industrial aggregate plant crushing blasted granite rock and sorting into specified commercial fractions.",
    category: "geology",
    alt: "Heavy-duty jaw crusher and inclined conveyor belt at granite quarry",
    isHero: false,
    order: 51,
    location: "Commercial Aggregate Quarry, Ebonyi State",
    date: "12 Sep 2026"
  },
  {
    id: "img-52",
    url: "https://i.ibb.co/ZvL8Qxs/Whats-App-Image-2026-10-23-at-9-23-02-PM-2.jpg",
    title: "Trial Pit Regolith Sampling and Documentation",
    caption: "Geologist logging vertical saprolite horizons and bagging geochemical samples from exploratory trial pit.",
    category: "geology",
    alt: "Geologist standing in trial pit inspecting soil horizons and sample bag",
    isHero: false,
    order: 52,
    location: "Lateritic Regolith Trial Pit Site",
    date: "20 Sep 2026"
  },
  {
    id: "img-53",
    url: "https://i.ibb.co/4gmXj1Kp/Whats-App-Image-2026-10-23-at-9-23-02-PM-1.jpg",
    title: "Hydraulic Excavator Cutting Deep Geotechnical Trench",
    caption: "Tracked CAT excavator trenching through consolidated laterite to expose sub-surface weathering profile.",
    category: "geology",
    alt: "Hydraulic excavator bucket excavating deep geotechnical exploration trench",
    isHero: false,
    order: 53,
    location: "Infrastructure Ground Investigation Site",
    date: "20 Sep 2026"
  },
  {
    id: "img-54",
    url: "https://i.ibb.co/bMq25Shw/Whats-App-Image-2026-10-23-at-9-23-02-PM.jpg",
    title: "High-Yield Borehole Production Flow Testing",
    caption: "Continuous high-volume discharge during constant rate pumping test to determine aquifer transmissivity.",
    category: "groundwater",
    alt: "Clean groundwater pouring heavily from high-capacity borehole pipe",
    isHero: true,
    order: 54,
    location: "Commercial Water Supply Well",
    date: "28 Sep 2026"
  },
  {
    id: "img-55",
    url: "https://i.ibb.co/vvdBgxtw/Whats-App-Image-2026-10-23-at-9-23-01-PM-2.jpg",
    title: "Reinforced Steel Overhead Water Storage Tower",
    caption: "Elevated galvanized steel water storage tank constructed by GiniBen engineering division for gravity reticulation.",
    category: "groundwater",
    alt: "Elevated galvanized steel water tank tower against clear blue sky",
    isHero: false,
    order: 55,
    location: "Public Water Scheme Installation",
    date: "05 Oct 2026"
  },
  {
    id: "img-56",
    url: "https://i.ibb.co/XZQQDvBw/Whats-App-Image-2026-10-23-at-9-23-01-PM-1.jpg",
    title: "Community Water Dispensing Station and Apron",
    caption: "Commissioned multi-tap potable water dispensing point featuring tiled hygiene apron and continuous gravity feed.",
    category: "groundwater",
    alt: "Completed multi-tap water collection station with flowing brass taps",
    isHero: false,
    order: 56,
    location: "Rural Community Water Scheme",
    date: "05 Oct 2026"
  },
  {
    id: "img-57",
    url: "https://i.ibb.co/Q3qcq22f/Whats-App-Image-2026-10-23-at-9-23-01-PM.jpg",
    title: "Hand Lens Mineralogical Inspection of Rock Specimen",
    caption: "Geoscientist using 10x achromatic hand lens to identify accessory mineral grains and texture on fresh rock split.",
    category: "geology",
    alt: "Geoscientist inspecting fresh crystalline rock specimen using hand lens",
    isHero: false,
    order: 57,
    location: "Outcrop Mineral Mapping Site",
    date: "08 Oct 2026"
  },
  {
    id: "img-58",
    url: "https://i.ibb.co/PvsXmSWQ/Whats-App-Image-2026-10-23-at-9-23-00-PM-1.jpg",
    title: "Dynamic Cone Penetrometer (DCP) In-Situ Soil Testing",
    caption: "Geotechnical engineer performing DCP test to determine structural bearing capacity and soil compaction gradient.",
    category: "geophysics",
    alt: "Geotechnical engineer conducting dynamic cone penetrometer test on foundation pad",
    isHero: false,
    order: 58,
    location: "Civil Infrastructure Foundation Site",
    date: "09 Oct 2026"
  },
  {
    id: "img-59",
    url: "https://i.ibb.co/C3YKbKTX/Whats-App-Image-2026-10-23-at-9-23-00-PM.jpg",
    title: "Systematic Drill Core Tray Logging and Preservation",
    caption: "Drill core specimens arranged systematically in wooden core boxes with depth tags and lithology markers.",
    category: "geology",
    alt: "Wooden core boxes displaying recovered diamond drill core cylinders",
    isHero: false,
    order: 59,
    location: "Field Base Core Logging Facility",
    date: "10 Oct 2026"
  },
  {
    id: "img-60",
    url: "https://i.ibb.co/RTmCygjN/Whats-App-Image-2026-10-23-at-9-22-59-PM.jpg",
    title: "Differential GPS Concession Boundary Verification",
    caption: "High-precision GNSS receiver deployed over legal survey monument to calibrate mineral concession limits.",
    category: "geology",
    alt: "Differential GPS receiver mounted on survey bipod over boundary beacon",
    isHero: false,
    order: 60,
    location: "Mining Concession Perimeter",
    date: "11 Oct 2026"
  },
  {
    id: "img-61",
    url: "https://i.ibb.co/r2cM80n5/Whats-App-Image-2026-10-23-at-9-22-58-PM-1.jpg",
    title: "Precision Field Balance Sample Mass Determination",
    caption: "Accurate gravimetric weighing of geochemical sieve splits using digital balance inside field mobile laboratory.",
    category: "instruments",
    alt: "Digital precision balance weighing geochemical sample pouch",
    isHero: false,
    order: 61,
    location: "Mobile Exploration Laboratory",
    date: "12 Oct 2026"
  },
  {
    id: "img-62",
    url: "https://i.ibb.co/S4dscbry/Whats-App-Image-2026-10-23-at-9-22-57-PM-3.jpg",
    title: "Field Notebook Structural Data Entry at Outcrop",
    caption: "Field geologist recording joint orientations, dip measurements, and stratigraphic descriptions at rock cut.",
    category: "team",
    alt: "Geologist writing structural field data into waterproof geological field book",
    isHero: false,
    order: 62,
    location: "Road Cutting Structural Profile",
    date: "14 Oct 2026"
  },
  {
    id: "img-63",
    url: "https://i.ibb.co/N2ZRSH97/Whats-App-Image-2026-10-23-at-9-22-57-PM-1.jpg",
    title: "Borehole Rotary Bit Rotation and Mud Circulation Pit",
    caption: "Mud rotary drilling in progress with circulating bentonite drilling fluids cooling the tricone bit and removing cuttings.",
    category: "groundwater",
    alt: "Drilling fluid circulation pit with rock cuttings beside rotary drilling rig",
    isHero: true,
    order: 63,
    location: "Deep Aquifer Hydrogeological Well",
    date: "15 Oct 2026"
  },
  {
    id: "img-64",
    url: "https://i.ibb.co/Df0n9KMq/Whats-App-Image-2026-10-23-at-9-22-57-PM.jpg",
    title: "Resistivity Electrode Layout and Ground Contact Inspection",
    caption: "Geophysicist verifying stainless steel current electrodes and contact resistance along sounding traverse line.",
    category: "geophysics",
    alt: "Field geophysicist checking steel electrode ground contact in survey layout",
    isHero: false,
    order: 64,
    location: "Groundwater Siting Traverse Grid",
    date: "16 Oct 2026"
  },
  {
    id: "img-65",
    url: "https://i.ibb.co/v47tFNKL/Whats-App-Image-2026-10-23-at-9-22-56-PM.jpg",
    title: "Geological Field Map Review and Traverse Planning",
    caption: "Senior consultants and field crew reviewing regional geological sheet and satellite maps on vehicle hood.",
    category: "team",
    alt: "Geologists gathering around topographic map spread on vehicle hood",
    isHero: false,
    order: 65,
    location: "Regional Reconnaissance Basepoint",
    date: "17 Oct 2026"
  },
  {
    id: "img-66",
    url: "https://i.ibb.co/0pBVYpkN/Whats-App-Image-2026-10-23-at-9-22-54-PM-2.jpg",
    title: "River Alluvial Gravel Bed Stratification Inspection",
    caption: "Inspection of active alluvial gravel layers to target prospective heavy mineral and placer accumulations.",
    category: "geology",
    alt: "Layered alluvial gravels and river sediments along active watercourse",
    isHero: false,
    order: 66,
    location: "Placer Mineral Exploration Sector",
    date: "18 Oct 2026"
  },
  {
    id: "img-67",
    url: "https://i.ibb.co/604pqSkJ/Whats-App-Image-2026-10-23-at-9-22-54-PM-1.jpg",
    title: "Schlumberger Array Vertical Electrical Sounding (VES)",
    caption: "GiniBen geophysical team operating Schlumberger configuration to map deep weathered zone and fractured bedrock.",
    category: "geophysics",
    alt: "Geophysicists taking sounding measurements with terrameter along survey line",
    isHero: false,
    order: 67,
    location: "Hydrogeological Exploration Corridor",
    date: "18 Oct 2026"
  },
  {
    id: "img-68",
    url: "https://i.ibb.co/qFCmTfKp/Whats-App-Image-2026-10-23-at-9-22-54-PM.jpg",
    title: "High-Pressure Airlift Well Development Operation",
    caption: "Compressed air surging surging fine sands and rock flour from drilled borehole to maximize aquifer yield.",
    category: "groundwater",
    alt: "Violent air and water surge emerging from borehole casing during airlift development",
    isHero: false,
    order: 68,
    location: "Community Water Project Borehole",
    date: "19 Oct 2026"
  },
  {
    id: "img-69",
    url: "https://i.ibb.co/Jjr33Smf/Whats-App-Image-2026-10-23-at-9-22-53-PM-1.jpg",
    title: "Benched Granite Quarry Face and Joint Evaluation",
    caption: "Engineered multi-level quarry benching demonstrating stable slope geometry and massive granitic formation.",
    category: "geology",
    alt: "Stepped quarry rock benches exposing solid crystalline granite deposit",
    isHero: false,
    order: 69,
    location: "Commercial Granite Quarry Face",
    date: "19 Oct 2026"
  },
  {
    id: "img-70",
    url: "https://i.ibb.co/xtdwjZbK/Whats-App-Image-2026-10-23-at-9-22-53-PM.jpg",
    title: "Standardized Brass Sieve Stack for Sediment Sizing",
    caption: "Laboratory grade stacked brass sieves used in field base to partition stream sediments into analytical fractions.",
    category: "instruments",
    alt: "Stack of circular brass sieves on field table for grain size fractionation",
    isHero: false,
    order: 70,
    location: "Basecamp Sample Processing Station",
    date: "20 Oct 2026"
  },
  {
    id: "img-71",
    url: "https://i.ibb.co/Fq59dqMT/Whats-App-Image-2026-10-23-at-9-22-52-PM-1.jpg",
    title: "Multi-Parameter Water Quality Tester Calibration",
    caption: "Digital multiparameter sensor calibrating pH, electrical conductivity (EC), and TDS for groundwater baseline data.",
    category: "instruments",
    alt: "Handheld water quality tester with probe immersed in test solution",
    isHero: false,
    order: 71,
    location: "Water Scheme Quality Assurance Station",
    date: "20 Oct 2026"
  },
  {
    id: "img-72",
    url: "https://i.ibb.co/RTyj3sr8/Whats-App-Image-2026-10-23-at-9-22-52-PM.jpg",
    title: "Fault Contact and Stratigraphic Displacement Analysis",
    caption: "Field geologist detailing brittle fault zone causing displacement between sedimentary lithologic units.",
    category: "geology",
    alt: "Geologist pointing to sharp structural fault line in layered rock wall",
    isHero: true,
    order: 72,
    location: "Sedimentary Basin Structural Outcrop",
    date: "21 Oct 2026"
  },
  {
    id: "img-73",
    url: "https://i.ibb.co/G45M6D4f/Whats-App-Image-2026-10-23-at-9-22-51-PM-1.jpg",
    title: "Optical Level and Survey Prism Elevation Traversing",
    caption: "Survey technician leveling instrument along boreline to establish precise topographic elevations for hydraulic modeling.",
    category: "team",
    alt: "Survey technician with leveling staff and prism in open survey field",
    isHero: false,
    order: 73,
    location: "Water Transmission Line Corridor",
    date: "21 Oct 2026"
  },
  {
    id: "img-74",
    url: "https://i.ibb.co/Fqytr3Dp/Whats-App-Image-2026-10-23-at-9-22-51-PM.jpg",
    title: "Heavy-Duty Reticulation Valve Chamber and Manifold",
    caption: "Underground valve pit installation with gate valves, non-return valves, and distribution headers for municipal water flow.",
    category: "groundwater",
    alt: "Engineered concrete valve chamber with high-pressure water distribution pipework",
    isHero: false,
    order: 74,
    location: "Municipal Water Reticulation Scheme",
    date: "21 Oct 2026"
  },
  {
    id: "img-75",
    url: "https://i.ibb.co/nMbp0RQq/Whats-App-Image-2026-10-23-at-9-22-50-PM.jpg",
    title: "Twilight Rig Operations on Deep Hydrogeological Well",
    caption: "Continuous 24-hour rotary drilling operation advancing downhole drill string into deep artesian aquifer.",
    category: "groundwater",
    alt: "Rotary drilling rig operating under evening sky with floodlights active",
    isHero: false,
    order: 75,
    location: "Deep Artesian Exploration Wellfield",
    date: "21 Oct 2026"
  },
  {
    id: "img-76",
    url: "https://i.ibb.co/rRmjCdW6/Whats-App-Image-2026-10-23-at-9-22-47-PM.jpg",
    title: "Undisturbed Soil Profile Logging in Deep Trial Pit",
    caption: "Detailed pedological horizon logging documenting soil cohesion, gravel content, and plasticity down to bedrock.",
    category: "geology",
    alt: "Vertical walls of deep trial pit showing distinct stratigraphic soil layers",
    isHero: false,
    order: 76,
    location: "Geotechnical Foundation Exploration Pit",
    date: "22 Oct 2026"
  },
  {
    id: "img-77",
    url: "https://i.ibb.co/N60pM2wF/Whats-App-Image-2026-10-23-at-9-22-41-PM.jpg",
    title: "Wireline Core Barrel Retrieval and Rock Core Recovery",
    caption: "Drill crew extracting core barrel from borehole containing pristine cylindrical rock core for laboratory testing.",
    category: "groundwater",
    alt: "Drilling crew hoisting wireline core barrel containing intact rock core sample",
    isHero: false,
    order: 77,
    location: "Mineral Exploration Core Drilling Rig",
    date: "22 Oct 2026"
  },
  {
    id: "img-78",
    url: "https://i.ibb.co/xqvR4q7W/Whats-App-Image-2026-10-23-at-9-22-40-PM.jpg",
    title: "Geochemical Sample Batch Air-Drying and Cataloging",
    caption: "Systematic air-drying of sealed geochemical sample envelopes under camp awning prior to laboratory pulverization.",
    category: "geology",
    alt: "Labeled geochem sample envelopes laid out uniformly on drying racks",
    isHero: false,
    order: 78,
    location: "Exploration Basecamp QA/QC Yard",
    date: "22 Oct 2026"
  },
  {
    id: "img-79",
    url: "https://i.ibb.co/xtdwjZbK/Whats-App-Image-2026-10-23-at-9-22-53-PM.jpg",
    title: "Field Sediment Preparation and Mesh Fractionation",
    caption: "Controlled particle size grading of bulk stream gravels using nesting screens to isolate heavy pathfinder minerals.",
    category: "instruments",
    alt: "Sieving equipment and pans used for granulometric mineral separation",
    isHero: false,
    order: 79,
    location: "Fieldwork Geochemical Station",
    date: "22 Oct 2026"
  },
  {
    id: "img-80",
    url: "https://i.ibb.co/RTt4xdhN/Whats-App-Image-2026-10-23-at-9-06-28-PM.jpg",
    title: "Outcrop Examination and Vein Structure Correlation",
    caption: "Geoscientists evaluating structural trends, mineralized shears, and fault kinematics on exposed hillside outcrop.",
    category: "team",
    alt: "Field team inspecting fractured bedrock outcrop with geological equipment",
    isHero: false,
    order: 80,
    location: "Highland Geological Contact Zone",
    date: "22 Oct 2026"
  },
  {
    id: "img-81",
    url: "https://i.ibb.co/VpJyn1Kd/Whats-App-Image-2026-10-23-at-9-05-54-PM.jpg",
    title: "Heavy-Duty Drill Rig Transportation and Pad Access",
    caption: "Mobilization of all-wheel-drive drilling rig transporter negotiating rugged terrain to reach remote exploration location.",
    category: "groundwater",
    alt: "Heavy exploration drilling truck parked on prepared remote well pad",
    isHero: false,
    order: 81,
    location: "Remote Hydrogeological Exploration Site",
    date: "22 Oct 2026"
  },
  {
    id: "img-82",
    url: "https://i.ibb.co/HDg6v6dn/Whats-App-Image-2026-10-23-at-9-05-42-PM.jpg",
    title: "High-Torque Hydraulic Breakout Wrench Coupling",
    caption: "Rig operators utilizing hydraulic breakout wrenches to tighten heavy drill string couplings under high pressure.",
    category: "groundwater",
    alt: "Hydraulic breakout wrench mechanism securing drill stem on rig deck",
    isHero: false,
    order: 82,
    location: "Production Borehole Drilling Operations",
    date: "23 Oct 2026"
  },
  {
    id: "img-83",
    url: "https://i.ibb.co/y1XKPqv/Whats-App-Image-2026-10-23-at-9-05-41-PM.jpg",
    title: "Standard Penetration Test (SPT) Sampler Preparation",
    caption: "Geotechnical team assembling split-barrel sampler and drive rods for standard penetration testing in boreholes.",
    category: "geophysics",
    alt: "Geotechnical technician inspecting split spoon sampler for in-situ soil density",
    isHero: false,
    order: 83,
    location: "Infrastructure Geotechnical Investigation Site",
    date: "23 Oct 2026"
  },
  {
    id: "img-84",
    url: "https://i.ibb.co/d0grTtvr/Whats-App-Image-2026-10-23-at-9-05-31-PM.jpg",
    title: "Wet Sieve Processing of Stream Sediments",
    caption: "Field geologist washing and sizing coarse sediment in running water to concentrate high-density mineral fractions.",
    category: "geology",
    alt: "Geologist washing stream sediments through sieve pan in flowing river",
    isHero: false,
    order: 84,
    location: "Drainage Basin Geochemical Traverse",
    date: "23 Oct 2026"
  },
  {
    id: "img-85",
    url: "https://i.ibb.co/h1YdYYSv/Whats-App-Image-2026-10-23-at-9-05-26-PM.jpg",
    title: "Schistosity and Mineral Vein Orientation Mapping",
    caption: "Close geological mapping of foliation trends, crenulation cleavage, and quartz ribbons in metamorphic basement.",
    category: "geology",
    alt: "Metamorphic rock face exhibiting foliation and folded quartz veinlets",
    isHero: true,
    order: 85,
    location: "Metamorphic Basement Complex Zone",
    date: "23 Oct 2026"
  },
  {
    id: "img-86",
    url: "https://i.ibb.co/8gv2QFC1/Whats-App-Image-2026-10-23-at-9-05-25-PM.jpg",
    title: "High-Capacity Air Compressor Rig Hookup",
    caption: "Industrial high-CFM screw compressor feeding continuous high-pressure air for Down-The-Hole (DTH) percussion drilling.",
    category: "groundwater",
    alt: "High pressure mobile compressor supplying air lines to drilling rig",
    isHero: false,
    order: 86,
    location: "Hard Rock Drilling Well Site",
    date: "23 Oct 2026"
  },
  {
    id: "img-87",
    url: "https://i.ibb.co/fdX9gcH5/Whats-App-Image-2026-10-23-at-9-05-20-PM-1.jpg",
    title: "Heavy Mineral Concentrate Recovery in Gold Pan",
    caption: "Dense black mineral concentrate and heavy oxides separated from river sands using traditional gravitational panning.",
    category: "geology",
    alt: "Heavy mineral black sands concentrated in the rim of panning basin",
    isHero: false,
    order: 87,
    location: "Placer Heavy Mineral Stream Survey",
    date: "23 Oct 2026"
  },
  {
    id: "img-88",
    url: "https://i.ibb.co/ksTNqDv9/Whats-App-Image-2026-10-23-at-9-05-20-PM.jpg",
    title: "Geophysical Sounding Cable Reel and Connector Box",
    caption: "High-durability cable spools and multi-pin connector harness deployed for high-density 2D resistivity imaging.",
    category: "geophysics",
    alt: "Cable reels and electrical connector box set up for resistivity survey",
    isHero: false,
    order: 88,
    location: "Geophysical Siting Grid",
    date: "23 Oct 2026"
  },
  {
    id: "img-89",
    url: "https://i.ibb.co/bRLKqB3b/Whats-App-Image-2026-10-23-at-9-05-19-PM.jpg",
    title: "Solar Photovoltaic Array on Pump House Structure",
    caption: "High-efficiency monocrystalline solar panels mounted on security pump shelter powering submersible borehole pump.",
    category: "groundwater",
    alt: "Solar panel array mounted securely atop reinforced concrete pump house",
    isHero: false,
    order: 89,
    location: "Off-Grid Turnkey Water Facility",
    date: "23 Oct 2026"
  },
  {
    id: "img-90",
    url: "https://i.ibb.co/bVLyVQK/Whats-App-Image-2026-10-23-at-9-05-15-PM.jpg",
    title: "Excavator Access Road Construction and Bench Cut",
    caption: "Tracked heavy excavator clearing steep access road and grading benches on remote exploration concession.",
    category: "geology",
    alt: "Excavator cutting slope bench along hillside access road",
    isHero: false,
    order: 90,
    location: "Concession Infrastructure Access Road",
    date: "23 Oct 2026"
  },
  {
    id: "img-91",
    url: "https://i.ibb.co/KxCZJ6qs/Whats-App-Image-2026-10-23-at-9-05-14-PM-1.jpg",
    title: "GPS Coordinate Acquisition and Waypoint Cataloging",
    caption: "Field geologist capturing high-accuracy geographic coordinates at strategic geochemical sample location.",
    category: "team",
    alt: "Geologist using GPS receiver and entering waypoint data in field",
    isHero: false,
    order: 91,
    location: "Exploration Traverse Checkpoint",
    date: "23 Oct 2026"
  },
  {
    id: "img-92",
    url: "https://i.ibb.co/Pv3MXSbC/Whats-App-Image-2026-10-23-at-9-05-14-PM.jpg",
    title: "Sedimentary Cross-Bedding and Sandstone Cliff Face",
    caption: "Prominent planar cross-bedding and depositional structures exposed on steep sandstone escarpment.",
    category: "geology",
    alt: "Massive sandstone cliff wall showing detailed depositional cross-bedding",
    isHero: false,
    order: 92,
    location: "Sedimentary Formation Escarpment",
    date: "23 Oct 2026"
  },
  {
    id: "img-93",
    url: "https://i.ibb.co/JjNdP9WN/Whats-App-Image-2026-10-23-at-9-05-12-PM-1.jpg",
    title: "Field Electrical Resistivity Data Quality Audit",
    caption: "Geophysicist verifying apparent resistivity curves and repeatability metrics in the field to eliminate noise.",
    category: "geophysics",
    alt: "Geophysicist analyzing sounding curves on field clipboard",
    isHero: false,
    order: 93,
    location: "Resistivity Quality Control Point",
    date: "23 Oct 2026"
  },
  {
    id: "img-94",
    url: "https://i.ibb.co/DgkdL29c/Whats-App-Image-2026-10-23-at-9-05-11-PM.jpg",
    title: "Heavy-Duty Submersible Pump Lowering and Setting",
    caption: "Installation of multi-stage stainless steel submersible pump and drop pipes into production borehole casing.",
    category: "groundwater",
    alt: "Field team lowering stainless steel submersible pump into borehole",
    isHero: false,
    order: 94,
    location: "Water Scheme Production Well",
    date: "23 Oct 2026"
  },
  {
    id: "img-95",
    url: "https://i.ibb.co/0ytGqZM4/Whats-App-Image-2026-10-23-at-9-05-10-PM.jpg",
    title: "Four-Wheel-Drive Field Vehicle on Regional Traverse",
    caption: "All-terrain field logistics vehicle transporting specialized sampling gear across rugged mineral concession corridors.",
    category: "team",
    alt: "4x4 exploration utility vehicle navigating rocky terrain in rural project area",
    isHero: false,
    order: 95,
    location: "Regional Exploration Corridor",
    date: "23 Oct 2026"
  },
  {
    id: "img-96",
    url: "https://i.ibb.co/6QdvJCq/Whats-App-Image-2026-10-23-at-9-05-04-PM.jpg",
    title: "Stratified Limestone Quarry Bench and Resource Assessment",
    caption: "Massive bedded limestone deposit under geological quantification for industrial cement grade evaluation.",
    category: "geology",
    alt: "High quarry cliff face displaying thick horizontal limestone strata",
    isHero: true,
    order: 96,
    location: "Commercial Limestone Reserve, Ohafia",
    date: "23 Oct 2026"
  },
  {
    id: "img-97",
    url: "https://i.ibb.co/V1w2SVK/Whats-App-Image-2026-10-23-at-9-04-59-PM-1.jpg",
    title: "V-Notch Weir Aquifer Discharge Discharge Measurement",
    caption: "Precision volumetric water yield monitoring using calibrated 90-degree V-notch sharp-crested weir plate.",
    category: "instruments",
    alt: "Water flowing over 90 degree V-notch weir with measuring staff",
    isHero: false,
    order: 97,
    location: "Hydrogeological Flow Testing Site",
    date: "23 Oct 2026"
  },
  {
    id: "img-98",
    url: "https://i.ibb.co/dsQdTqF8/Whats-App-Image-2026-10-23-at-9-04-58-PM-2.jpg",
    title: "Mud Rotary Mud Mixing and Bentonite Hydration System",
    caption: "Continuous high-shear mixing of bentonite drilling mud to stabilize borehole walls during drilling in loose sands.",
    category: "groundwater",
    alt: "Bentonite mud mixing hopper and circulating mud tanks beside rig",
    isHero: false,
    order: 98,
    location: "Sedimentary Aquifer Borehole Site",
    date: "23 Oct 2026"
  },
  {
    id: "img-99",
    url: "https://i.ibb.co/yBbWDvCR/Whats-App-Image-2026-10-23-at-9-04-58-PM-1.jpg",
    title: "Geotechnical Trial Pit Soil Stratigraphy Profiling",
    caption: "In-situ logging of shear strength, soil moisture, and horizon boundaries in exploratory geotechnical trial pit.",
    category: "geology",
    alt: "Geoscientist in trial pit inspecting soil cohesion and profile boundaries",
    isHero: false,
    order: 99,
    location: "Geotechnical Trial Pit Grid",
    date: "23 Oct 2026"
  },
  {
    id: "img-100",
    url: "https://i.ibb.co/zh3C9tbT/Whats-App-Image-2026-10-23-at-9-04-56-PM.jpg",
    title: "Panoramic Highland Sandstone Ridge Escarpment",
    caption: "Panoramic geological survey across Udi escarpment highlighting regional dip slopes and structural contact planes.",
    category: "geology",
    alt: "Broad landscape of sandstone ridge cliffs and wooded exploration terrain",
    isHero: false,
    order: 100,
    location: "Highland Ridge Concession Area",
    date: "23 Oct 2026"
  },
  {
    id: "img-101",
    url: "https://i.ibb.co/TB2BV6QR/Whats-App-Image-2026-10-23-at-9-04-55-PM.jpg",
    title: "Consultant Team Outcrop Structural Logging Session",
    caption: "Dr. Ben Ukwuteyinor leading field geologists during detailed strike, dip, and joint frequency mapping at road cut.",
    category: "team",
    alt: "Dr. Ben Ukwuteyinor and team examining structural rock exposures along roadside",
    isHero: false,
    order: 101,
    location: "Ngwo Uno Escarpment Transect, Enugu",
    date: "23 Oct 2026"
  },
  {
    id: "img-102",
    url: "https://i.ibb.co/fdkK6DqF/Whats-App-Image-2026-10-23-at-9-04-53-PM.jpg",
    title: "Rotary Rig Derrick Hoisting and Kelly Bar Engagement",
    caption: "Heavy drill rig mast hoisting drill pipe string to initiate downhole rotary penetration into formation.",
    category: "groundwater",
    alt: "High derrick mast with heavy kelly bar and rotary swivel mechanism",
    isHero: false,
    order: 102,
    location: "Groundwater Exploration Drilling Site",
    date: "23 Oct 2026"
  },
  {
    id: "img-103",
    url: "https://i.ibb.co/spHX4r3b/Whats-App-Image-2026-10-23-at-9-04-48-PM.jpg",
    title: "Production Well High-Volume Clear Water Discharge",
    caption: "Final well testing stage showing crystal-clear groundwater discharging at high continuous flow rate without sediment.",
    category: "groundwater",
    alt: "Torrent of clean clear potable water gushing from pump test pipe",
    isHero: true,
    order: 103,
    location: "Commissioned Production Well Site",
    date: "23 Oct 2026"
  },
  {
    id: "img-104",
    url: "https://i.ibb.co/chxd1T9M/Whats-App-Image-2026-10-23-at-9-04-40-PM.jpg",
    title: "Completed Solar-Powered Water Scheme Facility",
    caption: "Turnkey solar borehole facility featuring high-capacity steel tower, solar pump array, and public dispensing apron.",
    category: "groundwater",
    alt: "Comprehensive turnkey solar water project with tank tower and solar panels",
    isHero: true,
    order: 104,
    location: "Community Solar Water Project, Enugu State",
    date: "23 Oct 2026"
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-01",
    slug: "mineral-exploration",
    numericCode: "01",
    title: "Mineral Resources & Exploration",
    tagline: "Precision Subsurface Target Generation & Delineation",
    description: "From regional structural reconnaissance to pinpoint drill-target generation, we deploy integrated geological mapping and advanced geophysical methods (Resistivity, Induced Polarization, Magnetics, and Electromagnetics) to reduce exploration risk and quantify resource potential.",
    detailedScope: [
      "Geological mapping and regional structural interpretation",
      "Advanced geophysical surveys: 2D/3D Electrical Resistivity Tomography (ERT)",
      "Induced Polarization (IP) surveys for disseminated metallic sulfides",
      "Ground Magnetic & Electromagnetic (EM) profiling",
      "Target generation, trenching supervision, and drill-hole planning",
      "Lithological core logging and stratigraphic delineation"
    ],
    methodsAndDeliverables: [
      "Calibrated geophysical pseudo-sections and resistivity inversion models",
      "Structural cross-sections and strike-dip tectonic diagrams",
      "Prioritized drill-target coordinate manifests with depth estimations",
      "Exploration GIS databases and regulatory-standard reporting"
    ],
    targetSectors: [
      "Solid Minerals & Mining Companies",
      "Concession Owners & Exploration Investors",
      "Government Geological Survey Agencies"
    ],
    featuredImage: "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg",
    isPublished: true
  },
  {
    id: "srv-02",
    slug: "resource-assessment",
    numericCode: "02",
    title: "Resource Assessment & Project Advisory",
    tagline: "Converting Geological Data into Strategic Investment Confidence",
    description: "Accurate evaluation is the bedrock of viable mining and infrastructure investment. We deliver rigorous due diligence, resource estimation support, technical audits, and competent reporting that bridge science and financial decision-making.",
    detailedScope: [
      "Resource estimation support and spatial grade interpolation",
      "Independent technical audits and geological due diligence",
      "Feasibility study input and mineral asset valuation support",
      "Exploration risk modeling and concession portfolio advisory",
      "Investment-grade technical documentation for capital providers"
    ],
    methodsAndDeliverables: [
      "Comprehensive technical evaluation reports",
      "Risk assessment matrix and economic viability indicators",
      "Independent advisory memorandums for board and lender review",
      "Data room preparation and verification"
    ],
    targetSectors: [
      "Mining Private Equity & Venture Funds",
      "Commercial Banks & Project Financiers",
      "Corporate Boards & Concession Acquisition Teams"
    ],
    featuredImage: "https://i.ibb.co/sdPT6Zxq/Whats-App-Image-2026-10-23-at-6-39-33-PM-1.jpg",
    isPublished: true
  },
  {
    id: "srv-03",
    slug: "environmental-regulatory",
    numericCode: "03",
    title: "Environmental & Regulatory Services",
    tagline: "Sustainable Stewardship & Rigorous Compliance",
    description: "We help resource developers, industrial operators, and engineering contractors navigate stringent environmental statutory frameworks through Environmental Impact Assessments (EIA), baseline studies, and environmental management plans.",
    detailedScope: [
      "Environmental Impact Assessment (EIA) field studies and reporting",
      "Baseline soil, surface water, and groundwater quality evaluations",
      "Environmental Management Plans (EMP) and monitoring protocols",
      "Mine site rehabilitation planning and closure audits",
      "Regulatory liaison and environmental compliance advisory"
    ],
    methodsAndDeliverables: [
      "Statutory EIA documentation compliant with regulatory bodies",
      "Baseline environmental parameters database (chemical & physical)",
      "Periodic environmental compliance monitoring reports",
      "Mitigation frameworks and community safety protocols"
    ],
    targetSectors: [
      "Mining & Quarrying Operators",
      "Infrastructure & Civil Contractors",
      "Industrial Processing Facilities"
    ],
    featuredImage: "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
    isPublished: true
  },
  {
    id: "srv-04",
    slug: "geotechnical-engineering",
    numericCode: "04",
    title: "Geotechnical & Engineering Support",
    tagline: "Subsurface Integrity for Heavy Infrastructure",
    description: "Every durable structure depends on understanding what lies beneath the foundation. We provide intrusive and non-destructive subsurface investigations, soil-rock mechanics characterization, and site suitability assessments for critical infrastructure.",
    detailedScope: [
      "Subsurface soil boring and geotechnical core recovery",
      "Standard Penetration Testing (SPT) and dynamic probing",
      "Rock mass characterization and Rock Quality Designation (RQD)",
      "Foundation depth recommendations and settlement risk analysis",
      "Slope stability analysis and embankment engineering reviews"
    ],
    methodsAndDeliverables: [
      "Detailed geotechnical investigation reports with borehole logs",
      "Allowable bearing capacity profiles across foundation depths",
      "Subsurface geologic hazard mapping (karst, fault lines, sinkholes)",
      "Civil foundation design parameters"
    ],
    targetSectors: [
      "Civil Engineering & Highway Contractors",
      "Bridge, Dam & Marine Terminal Developers",
      "High-Rise Commercial Real Estate Builders"
    ],
    featuredImage: "https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg",
    isPublished: true
  },
  {
    id: "srv-05",
    slug: "hydrogeology-water",
    numericCode: "05",
    title: "Hydrogeology & Water Development",
    tagline: "Sustainable Aquifer Discovery & Industrial Yield Security",
    description: "Groundwater scarcity and contamination demand rigorous scientific exploration. GiniBen executes geophysical aquifer mapping, precision borehole siting, drilling supervision, step-drawdown pump testing, and municipal/industrial water scheme design.",
    detailedScope: [
      "Hydrogeological mapping and fractured-basement aquifer detection",
      "Vertical Electrical Sounding (VES) and 2D resistivity imaging for well siting",
      "Borehole drilling supervision, casing design, and gravel-pack monitoring",
      "Step-drawdown and continuous rate aquifer pumping tests",
      "Water quality laboratory analysis (potability and industrial grade)"
    ],
    methodsAndDeliverables: [
      "Aquifer potential reports with optimal drill depths and casing plans",
      "Transmissivity, storativity, and sustainable safe-yield calculations",
      "Comprehensive borehole completion logs and water chemistry certificates",
      "Preventive maintenance schedules for high-volume wells"
    ],
    targetSectors: [
      "Industrial & Beverage Manufacturing Plants",
      "Municipal Water Boards & Regional Authorities",
      "Agricultural Irrigation Schemes & Large Estates"
    ],
    featuredImage: "https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg",
    isPublished: true
  },
  {
    id: "srv-06",
    slug: "geospatial-mapping",
    numericCode: "06",
    title: "Geospatial, Mapping & Related Technical Services",
    tagline: "High-Precision Topography & Spatial Analytics",
    description: "Spatial precision underpins all modern geoscience workflows. We provide high-accuracy Differential GPS (DGPS) control, electronic total station topographic surveys, digital elevation models (DEM), and GIS database integration for mining and civil sites.",
    detailedScope: [
      "Differential GPS (DGPS) ground control and perimeter demarcation",
      "Topographic contour surveys using electronic total stations",
      "Digital Elevation Modeling (DEM) and terrain surface generation",
      "GIS data integration, spatial analysis, and thematic map production",
      "Mining tenement boundary certification and concession mapping"
    ],
    methodsAndDeliverables: [
      "Georeferenced contour and topographic base plans (CAD/GIS formats)",
      "Volumetric excavation and stockpiling calculation models",
      "Comprehensive spatial GIS data packages with metadata",
      "Regulatory boundary certification documentation"
    ],
    targetSectors: [
      "Mining Concession Operators",
      "Urban & Regional Infrastructure Planners",
      "Industrial Land Developers"
    ],
    featuredImage: "https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg",
    isPublished: true
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "prj-01",
    slug: "basement-complex-groundwater",
    title: "Basement Complex Aquifer Delineation & Well Siting",
    category: "Hydrogeology & Water Development",
    categoryKey: "groundwater",
    location: "Southwestern Basement Complex, Nigeria",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg",
    summary: "Integrated vertical electrical sounding and 2D resistivity imaging to identify fractured bedrock zones for high-yield commercial groundwater production.",
    methodology: "Deployed multi-electrode resistivity arrays with Schlumberger and dipole-dipole configurations. Performed iterative 2D inversion modeling to pinpoint deep weathered crystalline fractures.",
    keyDeliverables: [
      "2D electrical resistivity subsurface cross-sections",
      "Precise borehole coordinates and depth recommendations",
      "Drilling oversight resulting in verified sustainable yield >12 m³/hr"
    ],
    galleryImages: [
      "https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg",
      "https://i.ibb.co/mVYDKDsg/Whats-App-Image-2026-10-23-at-6-39-32-PM-1.jpg",
      "https://i.ibb.co/JwcM61yS/Whats-App-Image-2026-10-23-at-6-39-39-PM.jpg"
    ],
    featured: true,
    status: "Published"
  },
  {
    id: "prj-02",
    slug: "mineralized-corridor-exploration",
    title: "Precious & Base Metal Exploration Transect",
    category: "Mineral Resources & Exploration",
    categoryKey: "geology",
    location: "Mineral Belt Investigation Corridor",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg",
    summary: "Systematic geological structural mapping, vein strike measurement, and geophysical profiling across prospective shear-zone hosted mineralization.",
    methodology: "Structural orientation measurement of strike/dip across exposed outcrops, coupled with magnetic anomaly profiling and geochemical chip sampling.",
    keyDeliverables: [
      "Detailed structural geological field map with joint polar plots",
      "Delineated mineralized quartz vein corridors",
      "Target generation portfolio for follow-up trenching and core drilling"
    ],
    galleryImages: [
      "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg",
      "https://i.ibb.co/sdPT6Zxq/Whats-App-Image-2026-10-23-at-6-39-33-PM-1.jpg",
      "https://i.ibb.co/Y4p0qFvG/Whats-App-Image-2026-10-23-at-6-39-37-PM-2.jpg"
    ],
    featured: true,
    status: "Published"
  },
  {
    id: "prj-03",
    slug: "infrastructure-geotechnical-site-investigation",
    title: "Heavy Industrial Facility Subsurface Geotechnical Survey",
    category: "Geotechnical & Engineering Support",
    categoryKey: "geophysics",
    location: "Industrial Corridor Development Zone",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg",
    summary: "Comprehensive subsurface foundation profiling combining rotary drilling with SPT and seismic refraction to determine bearing capacity for heavy equipment.",
    methodology: "Continuous hollow-stem auger boring with SPT sampling at 1.5m intervals down to competent bedrock, supplemented by ground resistivity profiling.",
    keyDeliverables: [
      "Borehole logs with continuous lithologic descriptions",
      "SPT N-value profiles correlated with allowable soil bearing pressure",
      "Engineered foundation depth specifications for heavy load-bearing pads"
    ],
    galleryImages: [
      "https://i.ibb.co/PGsyQjXy/Whats-App-Image-2026-10-23-at-6-39-42-PM-2.jpg",
      "https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg",
      "https://i.ibb.co/CpQtM2RW/Whats-App-Image-2026-10-23-at-6-39-41-PM-1.jpg"
    ],
    featured: true,
    status: "Published"
  },
  {
    id: "prj-04",
    slug: "environmental-baseline-assessment",
    title: "Concession Baseline Environmental Impact Study",
    category: "Environmental & Regulatory Services",
    categoryKey: "environmental",
    location: "Resource Concession Perimeter",
    date: "Verified Field Project",
    coverImage: "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
    summary: "Pre-operational baseline assessment documenting groundwater chemistry, topsoil heavy metal background, and ecological status for statutory licensing.",
    methodology: "Multi-point systematic sampling of surface drainage, static well water, and agricultural topsoils with certified chain-of-custody laboratory assays.",
    keyDeliverables: [
      "Certified baseline environmental parameter report",
      "Aquifer vulnerability and surface discharge mapping",
      "Environmental Management Plan (EMP) compliant with national ministries"
    ],
    galleryImages: [
      "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
      "https://i.ibb.co/gLFDJ8yH/Whats-App-Image-2026-10-23-at-6-39-33-PM.jpg",
      "https://i.ibb.co/6J15k85w/Whats-App-Image-2026-10-23-at-6-39-43-PM-1.jpg"
    ],
    featured: false,
    status: "Published"
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-01",
    name: "Dr. Benjamin Ukwuteyinor, PhD",
    title: "Founder & Lead Consultant",
    role: "Founder & Lead Consultant",
    credentials: "PhD Applied Geophysics, COMEG, NMGS, IAIA certified",
    experienceYears: "COMEG Certified Lead Consultant",
    affiliations: [
      "Council of Mining Engineers and Geoscientists (COMEG)",
      "Nigerian Mining and Geosciences Society (NMGS)",
      "International Association for Impact Assessment (IAIA)"
    ],
    bio: "Dr. Benjamin Ukwuteyinor is an accomplished exploration geophysicist directing integrated mineral resource evaluations, hydrogeological investigations, deep industrial borehole engineering, and infrastructure geophysics across Nigeria and West Africa.",
    image: "https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg",
    isPlaceholder: false,
    order: 1
  },
  {
    id: "team-02",
    name: "Dr. Ezeugwu Innocent (Ph.D)",
    title: "Principal Partner",
    role: "Principal Partner",
    credentials: "Ph.D, Principal Partner, Groundwater & Mineral Resources",
    experienceYears: "Groundwater & Mineral Resources Partner",
    affiliations: [
      "Principal Partner, Applied Geophysics & Groundwater Resources",
      "COMEG Registered Geoscientist"
    ],
    bio: "Principal Partner overseeing high-volume groundwater engineering, subsurface characterization, and large-scale water treatment facility development across regional states.",
    image: "https://i.ibb.co/0xNFG2Z/Whats-App-Image-2026-10-23-at-9-04-07-PM.jpg",
    isPlaceholder: false,
    order: 2
  },
  {
    id: "team-03",
    name: "Ogechukwu Maryann Okeke",
    title: "Geologist",
    role: "Geologist",
    credentials: "Geologist, Exploration & Structural Mapping",
    experienceYears: "Active Field Exploration Geologist",
    affiliations: [
      "Nigerian Mining and Geosciences Society (NMGS)",
      "Field Exploration & Stratigraphy Specialist"
    ],
    bio: "Field geologist specializing in geological mapping, structural interpretation, mineral prospect evaluation, and sample recovery protocols.",
    image: "https://i.ibb.co/vx8ytQDy/Whats-App-Image-2026-10-23-at-9-04-06-PM-1.jpg",
    isPlaceholder: false,
    order: 3
  },
  {
    id: "team-04",
    name: "Alichi U. (Ph.D)",
    title: "Senior Partner / Co-Developer",
    role: "Senior Partner / Co-Developer",
    credentials: "Ph.D, Environmental Hydrogeology & Co-Developer",
    experienceYears: "Senior Partner Level",
    affiliations: [
      "Environmental Management & Hydrogeology Specialist",
      "Subsurface Hydrodynamics & Resource Evaluation"
    ],
    bio: "Senior Partner & Co-Developer leading environmental management planning, hydrodynamics, and sustainable water resources development.",
    image: "https://i.ibb.co/XxpMK4xQ/Whats-App-Image-2026-10-23-at-9-04-06-PM.jpg",
    isPlaceholder: false,
    order: 4
  },
  {
    id: "team-05",
    name: "Ekechi Mmaduabuchi",
    title: "Geophysicist and Logistics Officer",
    role: "Geophysicist and Logistics Officer",
    credentials: "Exploration Geophysics & Field Logistics Operations",
    experienceYears: "Field Operations & Logistics",
    affiliations: [
      "Nigerian Mining and Geosciences Society (NMGS)",
      "Applied Geophysics & Technical Logistics Lead"
    ],
    bio: "Exploration geophysicist directing logistical coordination, vertical electrical sounding (VES) data collection, equipment mobilization, and field operations safety.",
    image: "https://i.ibb.co/1YhTdZ6w/IMG-20261023-WA0146.jpg",
    isPlaceholder: false,
    order: 5
  },
  {
    id: "team-06",
    name: "Ama Agwu",
    title: "Geologist / Field Coordinator",
    role: "Geologist / Field Coordinator",
    credentials: "Field Geology & Exploration Coordination",
    experienceYears: "Field Geological Operations",
    affiliations: [
      "Nigerian Mining and Geosciences Society (NMGS)",
      "Structural Mapping & Field Oversight"
    ],
    bio: "Field geologist coordinating on-site exploration operations, structural geological logging, stratigraphic correlation, and technical field team management.",
    image: "https://i.ibb.co/WvPD8W2S/IMG-20261023-WA0149.jpg",
    isPlaceholder: false,
    order: 6
  }
];

export const RECENT_PROJECT_RECORDS: ProjectRecord[] = [
  { id: 1, description: "305mm industrial boreholes, 9th Mile Ngwo, Enugu 2023", client: "Enugu State Water Corp", status: "Phase 1 Completed" },
  { id: 2, description: "750ft borehole + 40,000L tank, ESUT Teaching Hospital 2022", client: "Enugu Min. Works", status: "Completed" },
  { id: 3, description: "800ft industrial borehole, Amaja Health Centre 2022", client: "AIRBDA", status: "Completed" },
  { id: 4, description: "6 productive boreholes, Ugwuomu water treatment 2021", client: "Godfrey Okoye Univ", status: "Completed" },
  { id: 5, description: "Quantitative assessment Limestone: Ewekoro & Ohafia 2021", client: "Genesis Cement", status: "Quantified" },
  { id: 6, description: "Community boreholes Ugwueke Abia 2021", client: "Ugwueke Community", status: "Completed" },
  { id: 7, description: "ESIA for 45km road expansion, Enugu North", client: "Federal Ministry of Works", status: "Completed" }
];

export const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: "art-01",
    slug: "precision-geophysics-groundwater-discovery",
    title: "Precision Electrical Resistivity in Crystalline Basement Hydrogeology",
    category: "Technical Commentary",
    excerpt: "Why traditional single-point soundings fall short in complex crystalline terrains and how multi-electrode 2D inversion prevents costly dry boreholes.",
    content: "Groundwater development in fractured basement complexes represents one of the most critical engineering challenges in West African hydrogeology. Fractures and weathered pockets occur with sharp spatial heterogeneity. By integrating 2D Electrical Resistivity Tomography (ERT) with continuous dip-angle geological mapping, consultants can model the exact depth to weathered regolith and target interconnected structural joints. Accuracy in preliminary geophysics transforms borehole drilling from a speculative venture into a guaranteed infrastructure asset.",
    author: "Dr. Ben Ukwuteyinor, PhD",
    authorRole: "Founder & Lead Consultant",
    publishedAt: "October 2026",
    readTime: "5 min read",
    coverImage: "https://i.ibb.co/FkvwLGFK/Whats-App-Image-2026-10-23-at-6-39-35-PM-1.jpg",
    isPublished: true
  },
  {
    id: "art-02",
    slug: "converting-geological-data-into-investment-confidence",
    title: "Converting Geological Data into Strategic Investment Insight",
    category: "Corporate Insight",
    excerpt: "In natural resource evaluation, data alone is not strategy. How standardized technical reporting bridges scientific metrics with commercial bankability.",
    content: "Institutional investors and mining boards do not make decisions on raw apparent resistivity curves or isolated core specimens; they allocate capital based on quantified geological risk and clear delineation of prospective reserves. GiniBen & Partners grounds its advisory practice in standardizing subsurface findings into investment-grade reports. By integrating strict QA/QC protocols, competent geoscientist sign-offs, and transparent geological cross-sections, we provide project stakeholders with defensible clarity beneath the surface.",
    author: "Prof. M.N. Tijani & Dr. Ben Ukwuteyinor",
    authorRole: "Principal Partner & Lead Consultant",
    publishedAt: "September 2026",
    readTime: "6 min read",
    coverImage: "https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg",
    isPublished: true
  }
];

export const INITIAL_ENQUIRIES: ConsultationEnquiry[] = [
  {
    id: "enq-01",
    referenceNumber: "GB-2026-8492",
    fullName: "Chief Engr. D. Adeleke",
    company: "Westland Infrastructure Consortium",
    email: "d.adeleke@westland-infra.example.com",
    phone: "+2348030001122",
    serviceOfInterest: "Geotechnical & Engineering Support",
    projectLocation: "Ogun Industrial Hub",
    subject: "Subsurface Investigation for Heavy Bridge Foundation",
    message: "We require borehole drilling, SPT profiling, and rock quality designation across 8 pier locations along our proposed access corridor.",
    status: "reviewed",
    createdAt: "2026-10-21T09:30:00Z"
  },
  {
    id: "enq-02",
    referenceNumber: "GB-2026-9134",
    fullName: "Marcus Van Der Bilt",
    company: "Sahara Mineral Exploration Partners",
    email: "marcus@saharaminerals.example.com",
    phone: "+2348123456789",
    serviceOfInterest: "Mineral Resources & Exploration",
    projectLocation: "Niger State Concession Area",
    subject: "2D Resistivity & Induced Polarization Survey",
    message: "Looking to contract your team for a 14-line kilometer IP and resistivity survey to delineate disseminated sulfide targets on our gold exploration lease.",
    status: "new",
    createdAt: "2026-10-23T07:15:00Z"
  }
];
