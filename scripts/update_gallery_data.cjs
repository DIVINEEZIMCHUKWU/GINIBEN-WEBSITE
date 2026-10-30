const fs = require('fs');

const OFFICIAL_CATEGORIES = [
  'GEOLOGICAL MAPPING & EXPLORATION',
  'BOREHOLE CONSTRUCTION & WATER PROJECT',
  'GEOPHYSICS & MINERAL EXPLORATION',
  'CORE DRILLING & MINERAL EVALUATION',
  'GEOCHEMICAL MAPPING',
  'GIS & GEOSPATIAL DATA SERVICES',
  'GEOPHYSICAL SURVEYS',
  'ENVIRONMENTAL GEOSCIENCE SERVICES'
];

const newImages = [
  // 1. GEOLOGICAL MAPPING & EXPLORATION
  {
    url: "https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg",
    title: "Outcrop Geological Mapping & Lithologic Strike Measurement",
    caption: "Senior geoscientists measuring structural strike and dip on crystalline bedrock exposures in mineral concession.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Field geologists inspecting rock outcrop with structural compass and geological hammer",
    isHero: true,
    location: "Precambrian Mineral Belt, Nigeria"
  },
  {
    url: "https://i.ibb.co/qYFRNWwV/IMG-20261030-WA0003.jpg",
    title: "Structural Strike & Dip Measurement with Clar Compass",
    caption: "Precise bedding and foliation plane measurements recorded for 3D structural model reconstruction.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Close-up of geological compass placed on planar foliation surface",
    isHero: false,
    location: "Field Transect Corridor"
  },
  {
    url: "https://i.ibb.co/qLRqgd28/IMG-20261030-WA0004.jpg",
    title: "Mineralized Quartz Vein Fracture Analysis in Crystalline Bedrock",
    caption: "Inspection of secondary quartz-vein stockworks displaying visible sulfide mineral traces.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Silicified quartz vein cross-cutting metamorphic country rock",
    isHero: false,
    location: "Exploration Concession Zone"
  },
  {
    url: "https://i.ibb.co/6960b5V/IMG-20261030-WA0005.jpg",
    title: "Systematic Geological Traverse & Field Observation Post",
    caption: "Mapping geologists logging lithostratigraphic variations along a 5-kilometer reconnaissance traverse.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Field geology team traversing rugged lateritic terrain",
    isHero: false,
    location: "Regional Exploration Block"
  },
  {
    url: "https://i.ibb.co/27P0pMqG/IMG-20261030-WA0006.jpg",
    title: "Basement Complex Joint Orientation & Discontinuity Survey",
    caption: "Recording systematic joint sets and orthogonal fracturing for structural control analysis.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Geologist measuring vertical fracture spacing with steel scale",
    isHero: false,
    location: "Basement Complex Exposure"
  },
  {
    url: "https://i.ibb.co/yzZCbNH/IMG-20261030-WA0007.jpg",
    title: "Field Rock Exposure & Stratigraphic Contact Logging",
    caption: "Delineating boundary contact between schistose metasediments and intrusive granitic pluton.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Sharp lithological contact between granite and schist rock",
    isHero: false,
    location: "Metamorphic Belt Sector"
  },
  {
    url: "https://i.ibb.co/CsHJChq7/IMG-20261030-WA0008.jpg",
    title: "Field Geologist Inspecting Massive Mineralized Outcrop",
    caption: "In-situ examination of weathered gossanous caps and ironstone encrustations.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Geoscientist examining weathered iron-rich gossan with 20x hand lens",
    isHero: false,
    location: "Gossan Exploration Target"
  },
  {
    url: "https://i.ibb.co/jksS237N/IMG-20261030-WA0009.jpg",
    title: "Bedrock Shearing & Fold Axis Field Documentation",
    caption: "Mapping asymmetric micro-folds and shear zone fabric indicative of regional tectonic stress.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Folded quartz-mica schist outcrop with prominent crenulation cleavage",
    isHero: false,
    location: "Shear Zone Corridor"
  },
  {
    url: "https://i.ibb.co/G4jFS2wJ/IMG-20261030-WA0010.jpg",
    title: "Geological Mapping Transect & GPS Coordinate Pinpointing",
    caption: "Differential GPS coordinates recorded simultaneously with outcrop geological descriptions.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Handheld GPS navigation check at remote geological field station",
    isHero: false,
    location: "Field Station 42"
  },
  {
    url: "https://i.ibb.co/9mJW2QZR/IMG-20261030-WA0011.jpg",
    title: "Petrographic Sample Chip Selection from Fresh Exposures",
    caption: "Recovering unweathered representative rock specimens for thin-section optical microscopy.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Geologist chipping fresh rock sample with hardened chisel hammer",
    isHero: false,
    location: "Bedrock Quarry Outcrop"
  },
  {
    url: "https://i.ibb.co/GvgYzGYX/IMG-20261030-WA0012.jpg",
    title: "Foliation Strike & Metamorphic Fabric Field Evaluation",
    caption: "Plotting structural trend vectors on topographic field map sheets for strike continuity verification.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Geological map clipboard with plotted orientation symbols",
    isHero: false,
    location: "Field Basecamp"
  },
  {
    url: "https://i.ibb.co/qFjLCrrM/IMG-20261030-WA0013.jpg",
    title: "Lithostratigraphic Boundary Tracing across Concession",
    caption: "Ground-truthing satellite remote sensing anomalies through physical ground contact mapping.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Field geologists cross-referencing satellite image with ground terrain",
    isHero: false,
    location: "Concession West Perimeter"
  },
  {
    url: "https://i.ibb.co/gM8KVFYS/IMG-20261030-WA0014.jpg",
    title: "Regional Field Exploration Team on Outcrop Mapping Campaign",
    caption: "Full GiniBen geological exploration crew deployed for regional concession evaluation.",
    category: "GEOLOGICAL MAPPING & EXPLORATION",
    alt: "Team of geologists equipped with PPE and field packs on rocky summit",
    isHero: false,
    location: "Highland Survey Ridge"
  },

  // 2. BOREHOLE CONSTRUCTION & WATER PROJECT
  {
    url: "https://i.ibb.co/zWJ3f5RK/IMG-20261023-WA0048.jpg",
    title: "Heavy Duty Rotary Borehole Drilling Rig Deployment",
    caption: "Hydraulic mast erection and drilling rig stabilization for deep industrial groundwater exploration.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Heavy duty truck-mounted drilling rig with vertical mast raised",
    isHero: true,
    location: "Industrial Water Project Site"
  },
  {
    url: "https://i.ibb.co/9HrCtyrv/IMG-20261030-WA0015.jpg",
    title: "Deep Aquifer Drill Stem Assembly & Rotary Penetration",
    caption: "Continuous rotational drilling with tricone bit through consolidated sedimentary formations.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Rotary drill table turning drill rods into borehole collar",
    isHero: false,
    location: "Aquifer Development Site"
  },
  {
    url: "https://i.ibb.co/0jYMN8Xz/IMG-20261030-WA0016.jpg",
    title: "Rotary Rig Mud Circulation & Cuttings Return Channel",
    caption: "Drilling fluid carrying lithologic cuttings to settling pits for real-time stratigraphical sampling.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Borehole mud return flow carrying rock chips along ditch",
    isHero: false,
    location: "Drilling Circulation Pits"
  },
  {
    url: "https://i.ibb.co/kf2xsdS/IMG-20261030-WA0017.jpg",
    title: "Borehole Mud Pit Excavation & Bentonite Mixing System",
    caption: "Preparing high-yield bentonite drilling fluid to maintain hole stability and prevent wall collapse.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Engineers preparing drilling mud in earthen circulation tanks",
    isHero: false,
    location: "Drilling Pad Setup"
  },
  {
    url: "https://i.ibb.co/9kr27gzF/IMG-20261030-WA0018.jpg",
    title: "Subsurface Casing String Preparation & Alignment",
    caption: "Factory-slotted uPVC borehole screen and blind casings measured and coupled for downhole lowering.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "uPVC well casing pipes stacked on drilling staging platform",
    isHero: false,
    location: "Borehole Collar Zone"
  },
  {
    url: "https://i.ibb.co/6cHMj26M/IMG-20261030-WA0019.jpg",
    title: "High-Pressure Down-the-Hole (DTH) Hammering Advance",
    caption: "Air percussion hammer penetrating unweathered crystalline igneous basement at rapid penetration rates.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Air exhaust blowing dust and rock chips from borehole collar during DTH drilling",
    isHero: false,
    location: "Basement Borehole Siting"
  },
  {
    url: "https://i.ibb.co/SXVT0mCc/IMG-20261030-WA0020.jpg",
    title: "Borehole Well Screen & Gravel Pack Installation Setup",
    caption: "Graded silica gravel envelope placed around well screens to filter fine sand from the aquifer.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Washed river silica gravel bags being introduced downhole annulus",
    isHero: false,
    location: "Water Well Installation"
  },
  {
    url: "https://i.ibb.co/1tBv9HR5/IMG-20261030-WA0021.jpg",
    title: "Compressor Air-Lift Flushing & Well Development",
    caption: "High-capacity air compressor blowing drilling fines and mud cake to maximize aquifer permeability.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Turbulent geyser of groundwater and air discharging from borehole casing",
    isHero: false,
    location: "Well Development Phase"
  },
  {
    url: "https://i.ibb.co/d4ZDyLm8/IMG-20261030-WA0022.jpg",
    title: "Continuous Air Flushing Yielding Clean Aquifer Water",
    caption: "Clear water discharge emerging after intensive dual-tube air-lift development operations.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Crystal clear water stream discharging from borehole pipe onto ground",
    isHero: false,
    location: "Well Testing Sector"
  },
  {
    url: "https://i.ibb.co/1J2pyfGQ/IMG-20261030-WA0023.jpg",
    title: "Discharge Flow Rate Gauging & Suspended Sediment Cleansing",
    caption: "Measuring preliminary flow volume using V-notch weir and calibrated collection vessels.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Technician gauging water flow rate with digital timer and bucket",
    isHero: false,
    location: "Discharge Measuring Station"
  },
  {
    url: "https://i.ibb.co/tpbcLMD6/IMG-20261030-WA0024.jpg",
    title: "Submersible Pump Installation & Downhole Electric Cable Tie",
    caption: "Lowering multi-stage stainless steel submersible pump on heavy-duty uPVC riser pipes.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Installation crew lowering submersible pump motor into borehole mouth",
    isHero: false,
    location: "Pump Installation Site"
  },
  {
    url: "https://i.ibb.co/zHrmJ6VB/IMG-20261030-WA0025.jpg",
    title: "Production Well Head Capping & Sanitary Apron Casting",
    caption: "Forming reinforced concrete apron around wellhead to prevent surface water runoff contamination.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Cast concrete sanitary seal pad around steel borehole casing",
    isHero: false,
    location: "Sanitary Protection Zone"
  },
  {
    url: "https://i.ibb.co/tMncDnnN/IMG-20261030-WA0026.jpg",
    title: "Aquifer Constant Rate Pumping Test & Drawdown Monitoring",
    caption: "24-hour continuous pumping test with electric contact dipmeter measuring aquifer recovery curves.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Hydrogeologist recording water level drawdown readings with electric water dipmeter",
    isHero: false,
    location: "Hydrogeological Testing Station"
  },
  {
    url: "https://i.ibb.co/kVQW6TW4/IMG-20261030-WA0027.jpg",
    title: "Industrial Groundwater Reticulation Manifold Connection",
    caption: "Plumbing pressure valves, flowmeter, and check valves into facility distribution mains.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "High-pressure galvanized pipe manifold with flow meter and isolation valves",
    isHero: false,
    location: "Facility Water Network"
  },
  {
    url: "https://i.ibb.co/N6twTKHt/IMG-20261030-WA0028.jpg",
    title: "Community Water Supply Standpipe & Valve Chamber Setup",
    caption: "Construction of durable multi-tap dispensing facility for rural community water schemes.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Masonry valve box and distribution pipe network for public standpost",
    isHero: false,
    location: "Community Water Scheme"
  },
  {
    url: "https://i.ibb.co/fYMrymrK/IMG-20261030-WA0029.jpg",
    title: "Potable Water Chemistry Quality Assurance & In-Situ Testing",
    caption: "Digital testing of electrical conductivity, total dissolved solids, and pH before water commissioning.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Chemist dipping multi-parameter probe into water sample beaker",
    isHero: false,
    location: "Field Quality Test Post"
  },
  {
    url: "https://i.ibb.co/8nrgkSNd/IMG-20261030-WA0030.jpg",
    title: "Completed Borehole Concrete Platform & Surrounding Drainage",
    caption: "Finished borehole infrastructure built to WHO standards with integrated drainage soakaway.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "Completed clean concrete borehole headworks with secure steel lock cap",
    isHero: false,
    location: "Commissioned Wellsite"
  },
  {
    url: "https://i.ibb.co/CsQfTmbm/IMG-20261030-WA0031.jpg",
    title: "High-Yield Groundwater Well Commissioning & Client Handover",
    caption: "Successful commissioning of high-discharge production well delivering clean potable water.",
    category: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    alt: "GiniBen engineers and project sponsors celebrating successful clean water flow",
    isHero: false,
    location: "Project Handover Station"
  },

  // 3. GEOPHYSICS & MINERAL EXPLORATION
  {
    url: "https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg",
    title: "2D Electrical Resistivity Tomography (ERT) Multi-Electrode Line",
    caption: "Deployment of multi-channel resistivity imaging line across target mineralized shear zone.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Geophysicist setting up multi-electrode array along straight transect",
    isHero: true,
    location: "Mineral Exploration Target Line"
  },
  {
    url: "https://i.ibb.co/bM2B4MXr/IMG-20261030-WA0033.jpg",
    title: "Multi-Core Resistivity Cable Layout Across Exploration Grid",
    caption: "Laying calibrated takeout cables for automated Wenner-Schlumberger data acquisition.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Reel of geophysical multicore cable running through grassland transect",
    isHero: false,
    location: "Geophysical Survey Grid"
  },
  {
    url: "https://i.ibb.co/TxWcfQ6p/IMG-20261030-WA0034.jpg",
    title: "Stainless Steel Potential & Current Electrode Grounding",
    caption: "Hammering corrosion-resistant steel stakes into soil for optimal electrical contact.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Field technician hammering metal electrode stake into dry laterite",
    isHero: false,
    location: "Electrode Station 18"
  },
  {
    url: "https://i.ibb.co/tMdbXFQR/IMG-20261030-WA0035.jpg",
    title: "ABEM Terrameter / Resistivity Meter Station Calibration",
    caption: "Initializing central geophysical receiver for automated stacking and noise reduction testing.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Electronic geophysical console with digital LCD screen on folding field table",
    isHero: false,
    location: "Central Instrument Post"
  },
  {
    url: "https://i.ibb.co/bMFKd3hR/IMG-20261030-WA0036.jpg",
    title: "High-Precision Induced Polarization (IP) Data Acquisition",
    caption: "Acquiring chargeability curves to identify disseminated metallic sulfide deposits at depth.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Digital Induced Polarization meter operating in time-domain acquisition mode",
    isHero: false,
    location: "Sulfide Target Line 4"
  },
  {
    url: "https://i.ibb.co/dJHrfNgX/IMG-20261030-WA0037.jpg",
    title: "Ground Magnetometer Grid Profiling for Magnetic Ore Delineation",
    caption: "Proton magnetometer line survey measuring total magnetic field intensity anomalies.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Geophysicist carrying magnetometer sensor pole with chest console across survey grid",
    isHero: false,
    location: "Magnetic Survey Block"
  },
  {
    url: "https://i.ibb.co/JRwzMxb8/IMG-20261030-WA0038.jpg",
    title: "Geophysical Survey Transect Layout through Forest Terrain",
    caption: "Clearing survey cut-lines through dense bush with GPS line-of-sight tracking.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Geophysical survey crew cutting straight survey line in wooded brush",
    isHero: false,
    location: "Concession Traverse Line"
  },
  {
    url: "https://i.ibb.co/tT4LFcSR/IMG-20261030-WA0039.jpg",
    title: "Electrode Contact Resistance Measurement & Saline Salting",
    caption: "Minimizing contact resistance at dry rocky electrode stations with conductive saline solution.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Technician pouring saline electrolyte solution around grounded metal electrode",
    isHero: false,
    location: "Resistivity Line Station"
  },
  {
    url: "https://i.ibb.co/n8sFXNsV/IMG-20261030-WA0040.jpg",
    title: "Schlumberger Vertical Electrical Sounding (VES) Spreading",
    caption: "Deep 1D sounding spreading current electrodes up to 1,000 meters for regional fracture detection.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Wide-spread cable drums and signal wire extended across expansive savanna",
    isHero: false,
    location: "Regional VES Sounding Point"
  },
  {
    url: "https://i.ibb.co/PshnhJ71/IMG-20261030-WA0041.jpg",
    title: "Real-Time Pseudosection Quality Control on Field Toughbook",
    caption: "In-situ review of apparent resistivity pseudo-sections to verify anomalous conductor bodies.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Rugged field laptop showing color-contoured 2D resistivity pseudosection",
    isHero: false,
    location: "Field QC Station"
  },
  {
    url: "https://i.ibb.co/LDcHjsnR/IMG-20261030-WA0042.jpg",
    title: "Dipole-Dipole Deep Mineralized Shear Zone Profiling",
    caption: "Configuring dipole-dipole array geometry for enhanced horizontal resolution and deep targeting.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Surveyor setting electrode spacing along marked coordinate flags",
    isHero: false,
    location: "Deep Exploration Grid"
  },
  {
    url: "https://i.ibb.co/nMjnr1Rz/IMG-20261030-WA0043.jpg",
    title: "Proton Precession Magnetic Sensor Height & Heading Check",
    caption: "Calibrating magnetic base station to perform diurnal variation corrections on survey data.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Stationary base magnetometer setup on non-magnetic tripod stand",
    isHero: false,
    location: "Magnetic Base Station"
  },
  {
    url: "https://i.ibb.co/RmK7KZT/IMG-20261030-WA0044.jpg",
    title: "Electromagnetic (EM) Conductivity Mapping along Target Lines",
    caption: "Frequency-domain electromagnetic profiling to map conductive fault corridors and clay zones.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Geophysicist walking survey line carrying sling-style EM conductivity transmitter and receiver",
    isHero: false,
    location: "EM Survey Profile"
  },
  {
    url: "https://i.ibb.co/HLw1CdLG/IMG-20261030-WA0045.jpg",
    title: "Geophysical Field Crew Deploying Cable Spread on Concession",
    caption: "Coordinated fieldwork deployment operating safely under strict HSE protocols.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Field geophysical technicians in reflective high-vis vests along survey line",
    isHero: false,
    location: "Concession Line 12"
  },
  {
    url: "https://i.ibb.co/JjPm7nBf/IMG-20261030-WA0046.jpg",
    title: "Apparent Resistivity Anomaly Verification & Repetition Run",
    caption: "Re-measuring anomalous data points to eliminate cultural noise and verify true bedrock targets.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Technician operating keyboard controls of digital resistivity receiver",
    isHero: false,
    location: "Target Anomaly 03"
  },
  {
    url: "https://i.ibb.co/HLfXCq1n/IMG-20261030-WA0047.jpg",
    title: "Subsurface Resistivity Contrast Mapping for Gold Mineralization",
    caption: "Identifying resistive quartz reefs within conductive schistose shear zones for drilling targets.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Resistivity array crossing contact zone between distinct geological units",
    isHero: false,
    location: "Gold Exploration Sector"
  },
  {
    url: "https://i.ibb.co/v6CnPHFt/IMG-20261030-WA0048.jpg",
    title: "GPS Differential Base Station for Geophysical Line Georeferencing",
    caption: "Sub-centimeter RTK GNSS receiver providing high-accuracy topography for terrain correction.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "High-precision GNSS antenna mounted on yellow surveying tripod",
    isHero: false,
    location: "Geodetic Control Point"
  },
  {
    url: "https://i.ibb.co/ch3qSLDL/IMG-20261030-WA0049.jpg",
    title: "Comprehensive Geophysical Field Survey Team Debrief",
    caption: "Lead geophysicist reviewing daily raw data logs with field operators before basecamp departure.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Geophysics survey team gathered around field table reviewing data logs",
    isHero: false,
    location: "Field Base Operations"
  },
  {
    url: "https://i.ibb.co/nMNRQM6m/IMG-20261030-WA0050.jpg",
    title: "Integrated Subsurface Inversion Model Cross-Section Evaluation",
    caption: "Iterative RES2DINV finite-element inversion model revealing subsurface lithology and fracture depths.",
    category: "GEOPHYSICS & MINERAL EXPLORATION",
    alt: "Detailed 2D resistivity inverted model cross-section showing depth slices and color resistivity contours",
    isHero: false,
    location: "Technical Interpretation Desk"
  },

  // 4. CORE DRILLING & MINERAL EVALUATION
  {
    url: "https://i.ibb.co/4gTyqTQb/IMG-20261030-WA0051.jpg",
    title: "Diamond Core Drilling Rig Setup on Target Mineral Horizon",
    caption: "High-capacity diamond wireline core drill rig anchored for angled subsurface exploration hole.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Diamond core drilling rig with hydraulic chuck and inclined drilling mast",
    isHero: true,
    location: "Diamond Drill Collar 01"
  },
  {
    url: "https://i.ibb.co/6J4C3hF0/IMG-20261030-WA0052.jpg",
    title: "Wireline Core Barrel Retrieval & Core Extraction",
    caption: "Overshot assembly retrieving inner core tube from 150m downhole depth without pulling drill rods.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Drillers uncoupling wireline inner tube from diamond drill string",
    isHero: false,
    location: "Drill Floor Operation"
  },
  {
    url: "https://i.ibb.co/NnN3BD6x/IMG-20261030-WA0053.jpg",
    title: "Continuous HQ/NQ Rock Core Logging in Wooden Core Trays",
    caption: "Extracting complete cylindrical rock core cylinders into sequential wooden core boxes.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Freshly extracted rock core cylinders lying neatly inside labeled wooden core box",
    isHero: false,
    location: "Core Processing Pad"
  },
  {
    url: "https://i.ibb.co/v6HcJkXS/IMG-20261030-WA0054.jpg",
    title: "High-Recovery Mineralized Solid Core Interval Documentation",
    caption: "Solid rock core demonstrating >98% core recovery rate through competent mineralized shear zone.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Continuous solid rock core sticks exhibiting mineral banding",
    isHero: false,
    location: "Core Inspection Shed"
  },
  {
    url: "https://i.ibb.co/23vxMJPV/IMG-20261030-WA0055.jpg",
    title: "Core Orientation Markings & Lithological Contact Inspection",
    caption: "Drawing bottom-of-hole orientation lines and recording structural dip angles on core sticks.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Geologist marking orientation line on rock core cylinder with red grease pencil",
    isHero: false,
    location: "Logging Facility"
  },
  {
    url: "https://i.ibb.co/zVHgykf7/IMG-20261030-WA0056.jpg",
    title: "Rock Quality Designation (RQD) & Fracture Frequency Logging",
    caption: "Measuring intact core pieces greater than 10cm to calculate geotechnical rock mass indices.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Geotechnical technician measuring core stick lengths with steel rule",
    isHero: false,
    location: "Geotechnical Logging Table"
  },
  {
    url: "https://i.ibb.co/Nd7XqS3q/IMG-20261030-WA0057.jpg",
    title: "Sulfide Mineralization Bands in Fresh Crystalline Drill Core",
    caption: "Close-up macro inspection of pyrite, chalcopyrite, and galena mineralization within quartz vein core.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Glistening metallic sulfide grains embedded in cut diamond core specimen",
    isHero: false,
    location: "Mineral Evaluation Bench"
  },
  {
    url: "https://i.ibb.co/mVKHGprZ/IMG-20261030-WA0058.jpg",
    title: "Diamond Core Cutting & Half-Core Sampling for Assay",
    caption: "Water-cooled diamond blade saw cutting core longitudinally for chain-of-custody laboratory dispatch.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Electric rock core saw cutting drill core in half along marked center line",
    isHero: false,
    location: "Core Cutting Workshop"
  },
  {
    url: "https://i.ibb.co/LXHzq9KW/IMG-20261030-WA0059.jpg",
    title: "Systematic Core Box Labeling & Depth Interval Block Tagging",
    caption: "Inserting carved wooden depth blocks marking run start and end meters for accurate assay interval logging.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Wooden core box marked with hole ID, box number, and meter intervals",
    isHero: false,
    location: "Core Archive Section"
  },
  {
    url: "https://i.ibb.co/bjWpBJ1m/IMG-20261030-WA0060.jpg",
    title: "Specific Gravity Determination & Petrographic Core Analysis",
    caption: "Measuring dry and submerged core weight to calculate accurate bulk density for reserve estimation.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Precision electronic balance with suspended water basket determining core density",
    isHero: false,
    location: "On-Site Mineral Lab"
  },
  {
    url: "https://i.ibb.co/jP7736b2/IMG-20261030-WA0061.jpg",
    title: "Deep Exploration Diamond Drill String Rod Tripping",
    caption: "Drill crew hoisting 3m drill rods into mast tower during deep core drilling advancement.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Drillers in safety helmets handling heavy threaded steel drill rods on drilling platform",
    isHero: false,
    location: "Deep Exploration Drill Rig"
  },
  {
    url: "https://i.ibb.co/xKs1R2Pf/IMG-20261030-WA0062.jpg",
    title: "Core Yard Storage, Security & QA/QC Assay Sample Preparation",
    caption: "Organized galvanized steel racks holding core inventory with inserted blank and standard control samples.",
    category: "CORE DRILLING & MINERAL EVALUATION",
    alt: "Covered core storage facility with rows of labeled core boxes on elevated racks",
    isHero: false,
    location: "GiniBen Core Storage Facility"
  },

  // 5. GEOCHEMICAL MAPPING
  {
    url: "https://i.ibb.co/mV7tX06H/IMG-20261030-WA0064.jpg",
    title: "Active Stream Sediment Sampling & Mineral Grain Recovery",
    caption: "Collecting fine sediment from natural hydraulic traps along river beds to delineate upstream mineralization.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Geochemist in waders scooping stream sediment with non-magnetic plastic trowel",
    isHero: true,
    location: "Drainage Basin Sampling Station"
  },
  {
    url: "https://i.ibb.co/fGkN4tpj/IMG-20261030-WA0065.jpg",
    title: "Alluvial Heavy Mineral Panning at Drainage Intersections",
    caption: "Water panning of heavy minerals producing concentrated tails of gold, ilmenite, and cassiterite.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Gold pan displaying dense black sand concentrate and visible mineral specks",
    isHero: false,
    location: "Alluvial Stream Confluence"
  },
  {
    url: "https://i.ibb.co/0pHL4VzX/IMG-20261030-WA0066-1.jpg",
    title: "Sieving & Fine Fraction Separation for Trace Element Assay",
    caption: "Stack of ASTM stainless steel sieves (-80 mesh) isolating uniform fine fraction for ICP-MS assay.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Field sieves separating fine silt and clay from coarse pebbles",
    isHero: false,
    location: "Sample Processing Station"
  },
  {
    url: "https://i.ibb.co/KcJppTpk/IMG-20261030-WA0067.jpg",
    title: "B-Horizon Soil Sampling Grid Layout across Shear Zone",
    caption: "Systematic 50m x 200m soil sampling grid designed to detect dispersion halos over blind mineral bodies.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Surveyor placing marked wooden sample stake at soil grid coordinate",
    isHero: false,
    location: "Soil Geochemical Grid Block"
  },
  {
    url: "https://i.ibb.co/Y4ZSC0md/IMG-20261030-WA0069.jpg",
    title: "Soil Auger Core Extraction at 1.0m Uniform Depth",
    caption: "Hand auger sampling past humus and organic surface wash down to undisturbed residual B-horizon clay.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Technician turning manual Dutch soil auger into subsoil horizon",
    isHero: false,
    location: "Soil Sample Station 104"
  },
  {
    url: "https://i.ibb.co/v6KYyz6c/IMG-20261030-WA0070.jpg",
    title: "Geochemical Sample Bagging, Sealing & Barcode Cataloging",
    caption: "Kraft paper envelopes labeled with waterproof ink and registered into mobile GIS database.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Numbered Kraft sample pouches being sealed and packed in canvas field sacks",
    isHero: false,
    location: "Geochemical Mobile Lab"
  },
  {
    url: "https://i.ibb.co/S7KvN88Z/IMG-20261030-WA0071.jpg",
    title: "Laterite Profile Horizon Differentiation & Target Sampling",
    caption: "Sampling ferricrete carapace and mottled saprolite zones across residual laterite plateaus.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Exposed lateritic roadcut profile with marked soil sampling horizons",
    isHero: false,
    location: "Plateau Concession Block"
  },
  {
    url: "https://i.ibb.co/Xx62bGzr/IMG-20261030-WA0072.jpg",
    title: "Portable XRF Analyzer Rapid In-Situ Element Quantification",
    caption: "Handheld energy-dispersive XRF spectrometer measuring ppm concentrations of base and pathfinder metals.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Geochemist holding handheld pXRF analyzer nose against prepared soil cup",
    isHero: false,
    location: "Field In-Situ XRF Testing"
  },
  {
    url: "https://i.ibb.co/3y6KPnD6/IMG-20261030-WA0073.jpg",
    title: "Field Basecamp Geochemical Sample Drying & Homogenization",
    caption: "Natural air drying of sediment samples under mesh shade to prevent contamination before pulverizing.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Sample bags arranged neatly on elevated drying racks at field basecamp",
    isHero: false,
    location: "Basecamp Preparation Facility"
  },
  {
    url: "https://i.ibb.co/PG7KnL5d/IMG-20261030-WA0074.jpg",
    title: "Chain-of-Custody Packaging for Accredited Assay Laboratory",
    caption: "Security-tagged sample drums containing certified reference materials (CRMs), blanks, and duplicates.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Heavy duty sample shipping drums secured with tamper-evident seals",
    isHero: false,
    location: "Dispatch Depot"
  },
  {
    url: "https://i.ibb.co/fdKg1bvF/IMG-20261030-WA0075.jpg",
    title: "Regional Geochemical Soil Anomaly Grid Verification",
    caption: "Detailed infill soil sampling across high-threshold anomalous zones to pinpoint mineral targets.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Field geologist plotting analytical results on contour anomaly map",
    isHero: false,
    location: "Infill Grid Target A"
  },
  {
    url: "https://i.ibb.co/RTN23Q3v/IMG-20261029-WA0026.jpg",
    title: "Heavy Mineral Concentrate Inspection with Hand Lens",
    caption: "Micro-optical inspection of heavy mineral grains evaluating roundness, luster, and mineral species.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Close-up of mineral grains examined under illuminated triplet magnifier",
    isHero: false,
    location: "Field Petrography Station"
  },
  {
    url: "https://i.ibb.co/DP6DTcMY/IMG-20261029-WA0027.jpg",
    title: "Stream Trap Site Identification for High-Density Minerals",
    caption: "Selecting boulder-strewn plunge pools and bar heads where heavy minerals naturally concentrate.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Fast flowing rocky river with geologists identifying gravel bars",
    isHero: false,
    location: "River Confluence Sector"
  },
  {
    url: "https://i.ibb.co/CS1K0T8/IMG-20261029-WA0028.jpg",
    title: "Geochemical Traverse Team Sampling River Basin Sediment",
    caption: "Multi-point sediment composite sampling across wide alluvial channel for representative catchment analysis.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Field assistants gathering sediment from multiple sub-stations across stream bed",
    isHero: false,
    location: "Basin Catchment Area"
  },
  {
    url: "https://i.ibb.co/N2TcShB7/IMG-20261029-WA0029.jpg",
    title: "Lithogeochemical Outcrop Chip Sampling along Mineral Strike",
    caption: "Channel chip sampling across vein contacts to determine alteration halo and grade distribution.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Linear chip channel cut into rock face with collection tarpaulin beneath",
    isHero: false,
    location: "Vein Channel Sample Line"
  },
  {
    url: "https://i.ibb.co/gFcmkDqB/IMG-20261029-WA0030.jpg",
    title: "Multi-Element Anomaly Delineation & Target Prioritization",
    caption: "Statistical multivariate analysis correlating pathfinder elements (As, Sb, Bi) with precious metals.",
    category: "GEOCHEMICAL MAPPING",
    alt: "Geochemical scatter plots and spatial contour maps reviewed on laptop",
    isHero: false,
    location: "Exploration Evaluation Center"
  }
];

console.log("Total new user images:", newImages.length);

module.exports = { newImages, OFFICIAL_CATEGORIES };
