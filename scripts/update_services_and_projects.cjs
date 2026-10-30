const fs = require('fs');
const path = require('path');

const services = [
  {
    id: "srv-01",
    slug: "geological-mapping-exploration",
    numericCode: "01",
    title: "Geological Mapping & Exploration",
    tagline: "Field Surveys, Rock & Soil Identification & Ground Assessment",
    description: "Systematic geological field surveys, outcrop lithological mapping, rock and soil identification, geological investigations, and structural geology ground assessment.",
    detailedScope: [
      "Geological mapping and field surveys",
      "Rock and soil identification",
      "Geological investigations",
      "Structural geology and ground assessment"
    ],
    methodsAndDeliverables: [
      "Geological mapping and field surveys",
      "Rock and soil identification",
      "Geological investigations",
      "Structural geology and ground assessment"
    ],
    targetSectors: [
      "Mining & Mineral Exploration Companies",
      "Concession Holders & Investors",
      "Government Geological Survey Agencies"
    ],
    featuredImage: "https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg",
    isPublished: true
  },
  {
    id: "srv-02",
    slug: "geophysical-surveys",
    numericCode: "02",
    title: "Geophysical Surveys",
    tagline: "Resistivity, Magnetic, Electromagnetic & Subsurface Interpretation",
    description: "Multi-method exploration geophysics deploying electrical resistivity, ground magnetic, and electromagnetic surveys for subsurface investigation and geological interpretation.",
    detailedScope: [
      "Electrical resistivity surveys",
      "Magnetic surveys",
      "Electromagnetic surveys",
      "Subsurface investigation and interpretation"
    ],
    methodsAndDeliverables: [
      "Electrical resistivity surveys",
      "Magnetic surveys",
      "Electromagnetic surveys",
      "Subsurface investigation and interpretation"
    ],
    targetSectors: [
      "Exploration & Mining Concessions",
      "Groundwater Resource Developers",
      "Civil Infrastructure & Dam Engineering"
    ],
    featuredImage: "https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg",
    isPublished: true
  },
  {
    id: "srv-03",
    slug: "geotechnical-investigations",
    numericCode: "03",
    title: "Geotechnical Investigations",
    tagline: "Soil Sampling, Foundation Evaluation & Ground-Condition Studies",
    description: "Comprehensive subsoil investigations, standard soil sampling, subsurface soil assessment, foundation and construction-site studies, and ground-condition evaluations.",
    detailedScope: [
      "Soil investigation and sampling",
      "Subsurface soil assessment",
      "Foundation and construction-site investigations",
      "Ground-condition evaluation"
    ],
    methodsAndDeliverables: [
      "Soil investigation and sampling",
      "Subsurface soil assessment",
      "Foundation and construction-site investigations",
      "Ground-condition evaluation"
    ],
    targetSectors: [
      "Civil Construction & Road Contractors",
      "Industrial & Commercial Real Estate Builders",
      "Infrastructure & Bridge Engineers"
    ],
    featuredImage: "https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg",
    isPublished: true
  },
  {
    id: "srv-04",
    slug: "hydrogeology-groundwater-exploration",
    numericCode: "04",
    title: "Hydrogeology & Groundwater Exploration",
    tagline: "Groundwater Prospecting, Aquifer Identification & Borehole Siting",
    description: "Scientific hydrogeological investigations, groundwater prospecting, aquifer identification, groundwater potential assessment, and precision borehole siting.",
    detailedScope: [
      "Groundwater prospecting",
      "Aquifer identification",
      "Groundwater potential assessment",
      "Borehole siting and water-source investigation"
    ],
    methodsAndDeliverables: [
      "Groundwater prospecting",
      "Aquifer identification",
      "Groundwater potential assessment",
      "Borehole siting and water-source investigation"
    ],
    targetSectors: [
      "Municipal Water Corporations & Regional Boards",
      "Industrial Manufacturing & Agricultural Estates",
      "Community Water Scheme Stakeholders"
    ],
    featuredImage: "https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg",
    isPublished: true
  },
  {
    id: "srv-05",
    slug: "borehole-drilling-water-solutions",
    numericCode: "05",
    title: "Borehole Drilling & Water Solutions",
    tagline: "Borehole Drilling, Well Development, Completion & Testing",
    description: "Deep rotary and percussion borehole drilling, water-well development, casing completion, continuous step-drawdown testing, and related water-supply solutions.",
    detailedScope: [
      "Borehole drilling",
      "Water-well development",
      "Borehole completion",
      "Borehole testing and related water-supply solutions"
    ],
    methodsAndDeliverables: [
      "Borehole drilling",
      "Water-well development",
      "Borehole completion",
      "Borehole testing and related water-supply solutions"
    ],
    targetSectors: [
      "Beverage & Manufacturing Industrial Facilities",
      "Government & Community Water Programs",
      "Hospitals, Campuses & Commercial Complexes"
    ],
    featuredImage: "https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg",
    isPublished: true
  },
  {
    id: "srv-06",
    slug: "mineral-resource-exploration",
    numericCode: "06",
    title: "Mineral & Resource Exploration",
    tagline: "Exploration Surveys, Occurrence Investigations & Resource Assessment",
    description: "Specialized mineral exploration surveys, occurrence investigations, systematic rock and mineral sampling, and preliminary resource assessment for commercial viability.",
    detailedScope: [
      "Mineral exploration surveys",
      "Mineral occurrence investigations",
      "Rock and mineral sampling",
      "Preliminary resource assessment"
    ],
    methodsAndDeliverables: [
      "Mineral exploration surveys",
      "Mineral occurrence investigations",
      "Rock and mineral sampling",
      "Preliminary resource assessment"
    ],
    targetSectors: [
      "Solid Mineral Concession Operators",
      "Mining Investment Syndicates & Funds",
      "Mineral Processing Ventures"
    ],
    featuredImage: "https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg",
    isPublished: true
  },
  {
    id: "srv-07",
    slug: "gis-geospatial-data-services",
    numericCode: "07",
    title: "GIS & Geospatial Data Services",
    tagline: "Geographic Information Systems, Digital Mapping & Spatial Analytics",
    description: "High-precision Geographic Information Systems (GIS), digital topographical mapping, spatial data analysis, and geospatial data interpretation.",
    detailedScope: [
      "Geographic Information Systems (GIS)",
      "Digital mapping",
      "Spatial data analysis",
      "Geospatial data interpretation"
    ],
    methodsAndDeliverables: [
      "Geographic Information Systems (GIS)",
      "Digital mapping",
      "Spatial data analysis",
      "Geospatial data interpretation"
    ],
    targetSectors: [
      "Mining Cadastre & Concession Administration",
      "Urban & Regional Infrastructure Planners",
      "Land Administration & Survey Agencies"
    ],
    featuredImage: "https://i.ibb.co/DH3L8q7y/Whats-App-Image-2026-10-23-at-6-39-43-PM-2.jpg",
    isPublished: true
  },
  {
    id: "srv-08",
    slug: "environmental-geoscience-services",
    numericCode: "08",
    title: "Environmental Geoscience Services",
    tagline: "Environmental Field Investigations, Soil & Water Assessment & Baseline Studies",
    description: "Comprehensive environmental field investigations, soil and water contamination assessments, statutory environmental baseline studies, and ground/site assessment.",
    detailedScope: [
      "Environmental field investigations",
      "Soil and water assessment",
      "Environmental baseline studies",
      "Ground and site assessment"
    ],
    methodsAndDeliverables: [
      "Environmental field investigations",
      "Soil and water assessment",
      "Environmental baseline studies",
      "Ground and site assessment"
    ],
    targetSectors: [
      "Quarry & Mining Operators",
      "Energy & Industrial Infrastructure",
      "Regulatory & Environmental Compliance Bodies"
    ],
    featuredImage: "https://i.ibb.co/Wp41wWXw/Whats-App-Image-2026-10-23-at-6-39-44-PM.jpg",
    isPublished: true
  }
];

// Read companyData.ts
const companyDataPath = path.join(__dirname, '../src/data/companyData.ts');
let content = fs.readFileSync(companyDataPath, 'utf8');

const servicesTsString = 'export const INITIAL_SERVICES: ServiceItem[] = ' + JSON.stringify(services, null, 2) + ';';

content = content.replace(
  /export const INITIAL_SERVICES: ServiceItem\[\] = \[[\s\S]*?\n\];/,
  servicesTsString
);

fs.writeFileSync(companyDataPath, content, 'utf8');
console.log(`Successfully updated INITIAL_SERVICES with all 8 official services!`);
