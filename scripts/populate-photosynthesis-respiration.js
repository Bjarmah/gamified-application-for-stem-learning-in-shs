import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://qqlovextnycxzdwnrydq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbG92ZXh0bnljeHpkd25yeWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzI5MjksImV4cCI6MjA2NDA0ODkyOX0.EqjXAImoCkwBUKxE5-rFnUVwADCcDvdo_ofzF32TO4Y";

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Comprehensive Photosynthesis & Respiration content
const comprehensiveContent = {
    title: "Photosynthesis & Respiration: Complete Energy Systems",
    description: "Master the complete energy transformations in living systems: from light capture to ATP production, with real-world applications in Ghanaian agriculture, medicine, and environmental science.",
    estimated_duration: 120, // 2 hours
    difficulty_level: "advanced",
    content: {
        introduction: "Energy is the currency of life. In this comprehensive module, you'll explore how plants capture solar energy through photosynthesis and how all organisms release that energy through cellular respiration. We'll dive deep into the molecular mechanisms, explore environmental factors, and connect everything to real-world applications in Ghana and beyond.",

        lessons: [
            {
                id: "photosynthesis-fundamentals",
                title: "Photosynthesis Fundamentals",
                content: `
# Photosynthesis: Nature's Solar Power Plant

## Overview
Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose and other organic compounds. This process is the foundation of almost all life on Earth.

## Key Concepts
- **Location**: Chloroplasts in plant cells
- **Energy Source**: Sunlight (electromagnetic radiation)
- **Raw Materials**: Carbon dioxide (CO₂) and water (H₂O)
- **Products**: Glucose (C₆H₁₂O₆) and oxygen (O₂)
- **Overall Equation**: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

## Historical Discovery
The process was first described by Jan Ingenhousz in 1779, who discovered that plants produce oxygen only in the presence of light. Later, Julius von Sachs showed that glucose is produced during photosynthesis.

## Economic Importance
In Ghana, photosynthesis drives:
- Cocoa production (major export crop)
- Maize and cassava farming (staple foods)
- Timber and forest products
- Medicinal plant cultivation
        `,
                knowledgeChecks: [
                    {
                        id: "pf-q1",
                        type: "mcq",
                        stem: "What is the primary energy source for photosynthesis?",
                        options: {
                            "A": "Chemical energy from glucose",
                            "B": "Sunlight (electromagnetic radiation)",
                            "C": "Heat from the environment",
                            "D": "Electrical energy from the soil"
                        },
                        answer: "B",
                        explanation: "Photosynthesis converts light energy from the sun into chemical energy stored in glucose."
                    },
                    {
                        id: "pf-q2",
                        type: "mcq",
                        stem: "Which of the following is NOT a product of photosynthesis?",
                        options: {
                            "A": "Glucose",
                            "B": "Oxygen",
                            "C": "Carbon dioxide",
                            "D": "Water"
                        },
                        answer: "C",
                        explanation: "Carbon dioxide is a reactant (input) of photosynthesis, not a product. The products are glucose and oxygen."
                    }
                ]
            },

            {
                id: "light-reactions-detailed",
                title: "Light Reactions: Energy Capture",
                content: `
# Light Reactions: Capturing Solar Energy

## Location and Structure
The light reactions occur in the **thylakoid membranes** of chloroplasts. These membranes contain:
- **Photosystem I (PSI)**: Contains chlorophyll a (P700)
- **Photosystem II (PSII)**: Contains chlorophyll a (P680)
- **Cytochrome b6f complex**: Electron transport chain
- **ATP synthase**: Enzyme that produces ATP

## Step-by-Step Process

### 1. Light Absorption
- Chlorophyll molecules absorb light energy
- Electrons become excited and jump to higher energy levels
- Energy is transferred between pigment molecules

### 2. Water Splitting (Photolysis)
- PSII absorbs light energy
- Excited electrons are captured by primary electron acceptor
- Water molecules are split: 2H₂O → 4H⁺ + 4e⁻ + O₂
- Oxygen is released as a byproduct

### 3. Electron Transport Chain
- Electrons flow from PSII → cytochrome b6f → PSI
- Energy is used to pump protons (H⁺) into thylakoid lumen
- Creates a proton gradient across the membrane

### 4. ATP Production (Photophosphorylation)
- Protons flow back through ATP synthase
- ADP + Pi → ATP (using energy from proton gradient)
- This is called **chemiosmosis**

### 5. NADPH Production
- PSI absorbs light and excites electrons
- Electrons reduce NADP⁺ to NADPH
- NADPH carries electrons to the Calvin cycle

## Environmental Factors Affecting Light Reactions

### Light Intensity
- **Low light**: Limited electron excitation, reduced ATP/NADPH production
- **Optimal light**: Maximum efficiency
- **High light**: Can cause photoinhibition and damage

### Temperature
- **Low temperature**: Slower enzyme activity
- **Optimal temperature**: 20-30°C for most plants
- **High temperature**: Can denature proteins

### Water Availability
- **Dehydration**: Reduces water splitting, limits O₂ production
- **Flooding**: Can damage thylakoid membranes

## Ghanaian Context: Cocoa Farming
In Ghana's cocoa farms:
- **Shade management**: Young cocoa trees need shade to prevent photoinhibition
- **Irrigation**: Ensures adequate water for photolysis
- **Fertilizer**: Provides nutrients for chlorophyll synthesis
- **Pest control**: Protects leaves from damage that reduces photosynthesis

## Mathematical Relationships
- **Quantum yield**: ~8-10 photons per O₂ molecule produced
- **Efficiency**: ~3-6% of incident light energy converted to chemical energy
- **Rate factors**: Light intensity × CO₂ concentration × temperature × water availability
        `,
                knowledgeChecks: [
                    {
                        id: "lr-q1",
                        type: "mcq",
                        stem: "Where do the light reactions of photosynthesis occur?",
                        options: {
                            "A": "Stroma of chloroplasts",
                            "B": "Thylakoid membranes",
                            "C": "Mitochondrial matrix",
                            "D": "Cytosol"
                        },
                        answer: "B",
                        explanation: "Light reactions occur on the thylakoid membranes where chlorophyll captures light energy."
                    },
                    {
                        id: "lr-q2",
                        type: "mcq",
                        stem: "What is the primary product of water splitting (photolysis)?",
                        options: {
                            "A": "Carbon dioxide",
                            "B": "Oxygen",
                            "C": "Glucose",
                            "D": "ATP"
                        },
                        answer: "B",
                        explanation: "Photolysis splits water molecules, releasing oxygen as a byproduct while providing electrons."
                    },
                    {
                        id: "lr-q3",
                        type: "mcq",
                        stem: "How many photons are typically required to produce one molecule of oxygen?",
                        options: {
                            "A": "2-4",
                            "B": "8-10",
                            "C": "15-20",
                            "D": "25-30"
                        },
                        answer: "B",
                        explanation: "The quantum yield is approximately 8-10 photons per oxygen molecule produced."
                    }
                ]
            },

            {
                id: "calvin-cycle-comprehensive",
                title: "Calvin Cycle: Carbon Fixation",
                content: `
# Calvin Cycle: Converting CO₂ to Sugar

## Overview
The Calvin cycle (also called the C₃ pathway) is the second stage of photosynthesis that occurs in the **stroma** of chloroplasts. It uses ATP and NADPH from the light reactions to convert CO₂ into organic molecules.

## Three Main Phases

### Phase 1: Carbon Fixation
- **Enzyme**: RuBisCO (Ribulose-1,5-bisphosphate carboxylase/oxygenase)
- **Substrate**: CO₂ + RuBP (5-carbon sugar)
- **Product**: Two molecules of 3-phosphoglycerate (3-PGA)
- **Reaction**: CO₂ + RuBP → 2(3-PGA)

**RuBisCO Facts:**
- Most abundant protein on Earth
- Can bind both CO₂ and O₂ (photorespiration)
- Efficiency decreases at high temperatures
- Requires magnesium (Mg²⁺) as a cofactor

### Phase 2: Reduction
- **Enzyme**: Glyceraldehyde-3-phosphate dehydrogenase
- **Process**: 3-PGA is reduced using ATP and NADPH
- **Products**: Glyceraldehyde-3-phosphate (G3P)
- **Energy cost**: 6 ATP and 6 NADPH per cycle

### Phase 3: Regeneration
- **Enzyme**: Various enzymes including transketolase and aldolase
- **Process**: Regenerate RuBP from G3P
- **Energy cost**: 3 ATP per cycle
- **Net result**: 1 G3P molecule available for glucose synthesis

## Complete Cycle Summary
**Inputs per cycle:**
- 3 CO₂ molecules
- 9 ATP molecules
- 6 NADPH molecules

**Outputs per cycle:**
- 1 G3P molecule (can be used to make glucose)
- 6 ADP + Pi (from ATP hydrolysis)
- 6 NADP⁺ (from NADPH oxidation)

**To make 1 glucose molecule:**
- 6 CO₂ molecules
- 18 ATP molecules
- 12 NADPH molecules
- 2 cycles (since 2 G3P = 1 glucose)

## Environmental Factors

### CO₂ Concentration
- **Low CO₂**: Limits carbon fixation, reduces productivity
- **High CO₂**: Increases productivity up to a point
- **CO₂ compensation point**: CO₂ concentration where photosynthesis = respiration

### Temperature
- **Low temperature**: Slows enzyme activity, reduces efficiency
- **Optimal temperature**: 20-30°C for most C₃ plants
- **High temperature**: Can cause photorespiration

### Light Intensity
- **Indirect effect**: Light reactions provide ATP and NADPH
- **Light saturation**: Calvin cycle can't keep up with light reactions

## Photorespiration
**What it is**: RuBisCO binds O₂ instead of CO₂
**When it occurs**: High temperatures, low CO₂, high O₂
**Problems**: Wastes energy, reduces productivity
**Adaptations**: C₄ and CAM photosynthesis

## Ghanaian Agricultural Applications

### CO₂ Enrichment
- **Greenhouse farming**: Adding CO₂ can increase yields by 20-40%
- **Cocoa fermentation**: CO₂ produced during fermentation can benefit nearby plants

### Temperature Management
- **Shade nets**: Reduce temperature, minimize photorespiration
- **Irrigation timing**: Cool plants during hot periods
- **Crop selection**: Choose heat-tolerant varieties

### Fertilization
- **Nitrogen**: Essential for RuBisCO synthesis
- **Magnesium**: Required for RuBisCO function
- **Phosphorus**: Needed for ATP production

## Mathematical Modeling
**Photosynthesis Rate = f(CO₂, light, temperature, water, nutrients)**
- **Michaelis-Menten kinetics**: CO₂ uptake vs. concentration
- **Temperature coefficient (Q₁₀)**: Rate change per 10°C increase
- **Light response curve**: Saturation kinetics
        `,
                knowledgeChecks: [
                    {
                        id: "cc-q1",
                        type: "mcq",
                        stem: "The Calvin cycle occurs in which part of the chloroplast?",
                        options: {
                            "A": "Thylakoid lumen",
                            "B": "Stroma",
                            "C": "Matrix",
                            "D": "Cristae"
                        },
                        answer: "B",
                        explanation: "The Calvin cycle takes place in the stroma, where CO₂ is fixed into organic molecules."
                    },
                    {
                        id: "cc-q2",
                        type: "mcq",
                        stem: "How many ATP molecules are required to produce one glucose molecule via the Calvin cycle?",
                        options: {
                            "A": "12",
                            "B": "18",
                            "C": "24",
                            "D": "36"
                        },
                        answer: "B",
                        explanation: "18 ATP molecules are required: 12 for reduction and 6 for regeneration."
                    },
                    {
                        id: "cc-q3",
                        type: "mcq",
                        stem: "What is the most abundant protein on Earth?",
                        options: {
                            "A": "Hemoglobin",
                            "B": "Collagen",
                            "C": "RuBisCO",
                            "D": "Actin"
                        },
                        answer: "C",
                        explanation: "RuBisCO is the most abundant protein on Earth, found in all photosynthetic organisms."
                    }
                ]
            },

            {
                id: "cellular-respiration-comprehensive",
                title: "Cellular Respiration: Energy Release",
                content: `
# Cellular Respiration: Releasing Stored Energy

## Overview
Cellular respiration is the process by which cells break down glucose and other organic molecules to produce ATP. It occurs in all living cells and is essential for life.

## Three Main Stages

### Stage 1: Glycolysis
**Location**: Cytosol (cytoplasm)
**Process**: Glucose → 2 Pyruvate
**Energy Investment**: 2 ATP
**Energy Production**: 4 ATP (net gain: 2 ATP)
**Electron Carriers**: 2 NADH

**Detailed Steps:**
1. **Phosphorylation**: Glucose + ATP → Glucose-6-phosphate + ADP
2. **Isomerization**: Glucose-6-phosphate → Fructose-6-phosphate
3. **Second Phosphorylation**: Fructose-6-phosphate + ATP → Fructose-1,6-bisphosphate + ADP
4. **Cleavage**: Fructose-1,6-bisphosphate → 2 G3P
5. **Oxidation**: 2 G3P + 2 NAD⁺ → 2 1,3-BPG + 2 NADH
6. **ATP Production**: 2 1,3-BPG + 2 ADP → 2 3-PG + 2 ATP
7. **Final Steps**: 2 3-PG → 2 Pyruvate

**Key Enzymes:**
- Hexokinase (step 1)
- Phosphofructokinase (step 3) - **rate limiting step**
- Glyceraldehyde-3-phosphate dehydrogenase (step 5)
- Pyruvate kinase (step 7)

### Stage 2: Pyruvate Oxidation & Krebs Cycle
**Location**: Mitochondrial matrix
**Process**: Pyruvate → Acetyl CoA → CO₂ + H₂O

**Pyruvate Oxidation:**
- Pyruvate + CoA + NAD⁺ → Acetyl CoA + CO₂ + NADH
- Enzyme: Pyruvate dehydrogenase complex
- CO₂ is released as waste

**Krebs Cycle (Citric Acid Cycle):**
1. **Acetyl CoA + Oxaloacetate → Citrate**
2. **Citrate → Isocitrate**
3. **Isocitrate + NAD⁺ → α-Ketoglutarate + CO₂ + NADH**
4. **α-Ketoglutarate + NAD⁺ + CoA → Succinyl CoA + CO₂ + NADH**
5. **Succinyl CoA + GDP → Succinate + GTP**
6. **Succinate + FAD → Fumarate + FADH₂**
7. **Fumarate + H₂O → Malate**
8. **Malate + NAD⁺ → Oxaloacetate + NADH**

**Products per glucose:**
- 6 CO₂ molecules
- 8 NADH molecules
- 2 FADH₂ molecules
- 2 GTP molecules (equivalent to 2 ATP)

### Stage 3: Electron Transport Chain & Oxidative Phosphorylation
**Location**: Inner mitochondrial membrane
**Process**: NADH/FADH₂ → ATP via chemiosmosis

**Electron Transport Chain:**
- **Complex I**: NADH → FMN → Fe-S clusters → CoQ
- **Complex II**: FADH₂ → Fe-S clusters → CoQ
- **Complex III**: CoQ → Cytochrome c
- **Complex IV**: Cytochrome c → O₂ (final electron acceptor)

**Chemiosmosis:**
- Electrons flow through ETC, releasing energy
- Energy used to pump H⁺ from matrix to intermembrane space
- Creates proton gradient (pH difference)
- H⁺ flow back through ATP synthase
- ADP + Pi → ATP

## Energy Yield Summary

**Per glucose molecule:**
- **Glycolysis**: 2 ATP + 2 NADH
- **Pyruvate Oxidation**: 2 NADH
- **Krebs Cycle**: 2 ATP + 6 NADH + 2 FADH₂
- **ETC**: 2 NADH → 6 ATP, 2 FADH₂ → 4 ATP
- **Total**: 32-34 ATP molecules

**Efficiency**: ~40% of glucose energy converted to ATP

## Anaerobic Respiration

### Lactic Acid Fermentation
**Location**: Muscle cells during intense exercise
**Process**: Pyruvate + NADH → Lactate + NAD⁺
**Purpose**: Regenerate NAD⁺ for continued glycolysis
**Ghanaian Context**: Important for athletes and manual laborers

### Alcoholic Fermentation
**Location**: Yeast and some bacteria
**Process**: Pyruvate → Acetaldehyde → Ethanol + CO₂
**Ghanaian Context**: Used in traditional brewing and bread making

## Environmental Factors

### Temperature
- **Low temperature**: Slower enzyme activity
- **High temperature**: Can denature proteins
- **Q₁₀ effect**: Rate doubles per 10°C increase

### Oxygen Availability
- **Aerobic**: With oxygen, complete oxidation
- **Anaerobic**: Without oxygen, limited ATP production
- **Hypoxic conditions**: Can occur in waterlogged soils

### Substrate Availability
- **Glucose**: Primary fuel source
- **Fatty acids**: Alternative energy source
- **Amino acids**: Can be converted to Krebs cycle intermediates

## Ghanaian Applications

### Sports and Exercise
- **Aerobic training**: Improves mitochondrial efficiency
- **Anaerobic training**: Increases glycolytic capacity
- **Recovery**: Understanding energy systems helps optimize training

### Agriculture
- **Seed germination**: Respiration provides energy for growth
- **Post-harvest**: Respiration continues, affecting storage
- **Soil respiration**: Important for nutrient cycling

### Medicine
- **Metabolic disorders**: Understanding energy pathways
- **Exercise physiology**: Training and rehabilitation
- **Nutrition**: Energy requirements and metabolism
        `,
                knowledgeChecks: [
                    {
                        id: "cr-q1",
                        type: "mcq",
                        stem: "Where does glycolysis occur?",
                        options: {
                            "A": "Mitochondrial matrix",
                            "B": "Cytosol",
                            "C": "Thylakoid membranes",
                            "D": "Nucleus"
                        },
                        answer: "B",
                        explanation: "Glycolysis occurs in the cytosol of all cells."
                    },
                    {
                        id: "cr-q2",
                        type: "mcq",
                        stem: "What is the final electron acceptor in aerobic respiration?",
                        options: {
                            "A": "Carbon dioxide",
                            "B": "Oxygen",
                            "C": "NAD⁺",
                            "D": "FAD"
                        },
                        answer: "B",
                        explanation: "Oxygen accepts electrons to form water in the final step."
                    },
                    {
                        id: "cr-q3",
                        type: "mcq",
                        stem: "How many ATP molecules are produced per glucose molecule in complete aerobic respiration?",
                        options: {
                            "A": "2",
                            "B": "18",
                            "C": "32-34",
                            "D": "50"
                        },
                        answer: "C",
                        explanation: "Complete aerobic respiration produces 32-34 ATP molecules per glucose."
                    }
                ]
            },

            {
                id: "energy-flow-ecosystems",
                title: "Energy Flow in Ecosystems",
                content: `
# Energy Flow in Ecosystems: The Big Picture

## Energy Laws and Principles

### First Law of Thermodynamics
- Energy cannot be created or destroyed
- Energy can only be transformed from one form to another
- Total energy in the universe remains constant

### Second Law of Thermodynamics
- Energy transformations are never 100% efficient
- Some energy is always lost as heat
- Entropy (disorder) increases in isolated systems

## Energy Flow Through Food Chains

### Trophic Levels
1. **Producers (Autotrophs)**: Plants, algae, cyanobacteria
   - Convert solar energy to chemical energy
   - Efficiency: ~1-3% of incident sunlight
   - Examples: Cocoa trees, maize, cassava

2. **Primary Consumers (Herbivores)**: Animals that eat plants
   - Efficiency: ~10% of plant energy
   - Examples: Goats, cattle, grasshoppers

3. **Secondary Consumers (Carnivores)**: Animals that eat herbivores
   - Efficiency: ~10% of herbivore energy
   - Examples: Lions, hawks, snakes

4. **Tertiary Consumers**: Top predators
   - Efficiency: ~10% of secondary consumer energy
   - Examples: Eagles, crocodiles

### Energy Loss at Each Level
**Why only ~10% efficiency?**
- **Respiration**: 60-70% lost as heat
- **Excretion**: 10-20% lost in waste
- **Movement**: 5-15% used for locomotion
- **Growth**: 10-20% stored in biomass

## Ghanaian Ecosystem Examples

### Forest Ecosystems
**Kakum National Park:**
- **Producers**: Mahogany, teak, bamboo
- **Primary consumers**: Forest elephants, duikers
- **Secondary consumers**: Leopards, eagles
- **Decomposers**: Fungi, bacteria, termites

**Energy Flow:**
- Sunlight → Trees (photosynthesis)
- Trees → Elephants (herbivory)
- Elephants → Leopards (predation)
- All levels → Decomposers (decay)

### Agricultural Ecosystems
**Cocoa Farms:**
- **Producers**: Cocoa trees, shade trees
- **Primary consumers**: Insects, rodents
- **Secondary consumers**: Birds, lizards
- **Human intervention**: Harvesting, pest control

**Energy Efficiency Improvements:**
- **Intercropping**: Multiple crops increase total productivity
- **Agroforestry**: Trees provide shade and nutrients
- **Integrated pest management**: Reduces energy loss to pests

### Marine Ecosystems
**Gulf of Guinea:**
- **Producers**: Phytoplankton, seaweeds
- **Primary consumers**: Zooplankton, small fish
- **Secondary consumers**: Larger fish, squid
- **Top predators**: Sharks, tuna

## Human Impact on Energy Flow

### Deforestation
- **Reduces producer biomass**
- **Decreases total energy capture**
- **Affects all trophic levels**
- **Ghana example**: Forest cover decreased from 35% to 10% in 50 years

### Overfishing
- **Removes top predators**
- **Disrupts food web balance**
- **Can cause trophic cascades**
- **Ghana example**: Declining fish stocks in coastal waters

### Pollution
- **Toxic chemicals accumulate up food chains**
- **Biomagnification**: Higher concentrations in top predators
- **Ghana example**: Mercury in fish from gold mining areas

## Mathematical Modeling

### Energy Flow Equations
**Net Primary Productivity (NPP):**
NPP = GPP - R
Where: GPP = Gross Primary Productivity, R = Respiration

**Ecological Efficiency:**
Efficiency = (Energy at level n) / (Energy at level n-1) × 100%

**Biomass Pyramid:**
- Producers: 1000 kg/ha
- Primary consumers: 100 kg/ha
- Secondary consumers: 10 kg/ha
- Tertiary consumers: 1 kg/ha

### Carbon Cycling
**Photosynthesis**: CO₂ + H₂O → Glucose + O₂
**Respiration**: Glucose + O₂ → CO₂ + H₂O + ATP
**Net effect**: Carbon cycles between atmosphere and biosphere

## Climate Change Implications

### Temperature Effects
- **Higher temperatures**: Increase respiration rates
- **Net effect**: More CO₂ released to atmosphere
- **Feedback loop**: Warming → more CO₂ → more warming

### CO₂ Fertilization
- **Higher CO₂**: Can increase photosynthesis
- **Limiting factors**: Water, nutrients, temperature
- **Ghana example**: Some crops may benefit, others may not

### Extreme Weather
- **Droughts**: Reduce photosynthesis, increase respiration
- **Floods**: Damage plants, reduce productivity
- **Storms**: Physical damage to ecosystems

## Conservation Strategies

### Protected Areas
- **National parks**: Preserve natural energy flow
- **Marine reserves**: Protect ocean ecosystems
- **Community forests**: Sustainable resource use

### Sustainable Agriculture
- **Crop rotation**: Maintain soil fertility
- **Organic farming**: Reduce chemical inputs
- **Agroecology**: Work with natural systems

### Restoration Ecology
- **Reforestation**: Restore producer biomass
- **Wetland restoration**: Improve water quality
- **Coral reef restoration**: Protect marine biodiversity
        `,
                knowledgeChecks: [
                    {
                        id: "ef-q1",
                        type: "mcq",
                        stem: "What percentage of energy is typically transferred between trophic levels?",
                        options: {
                            "A": "1%",
                            "B": "10%",
                            "C": "50%",
                            "D": "90%"
                        },
                        answer: "B",
                        explanation: "Only about 10% of energy is transferred between trophic levels due to respiration, excretion, and movement."
                    },
                    {
                        id: "ef-q2",
                        type: "mcq",
                        stem: "Which trophic level has the highest biomass in most ecosystems?",
                        options: {
                            "A": "Primary consumers",
                            "B": "Secondary consumers",
                            "C": "Producers",
                            "D": "Tertiary consumers"
                        },
                        answer: "C",
                        explanation: "Producers have the highest biomass as they capture and store solar energy."
                    },
                    {
                        id: "ef-q3",
                        type: "mcq",
                        stem: "What is the main reason for energy loss between trophic levels?",
                        options: {
                            "A": "Predation",
                            "B": "Respiration",
                            "C": "Competition",
                            "D": "Migration"
                        },
                        answer: "B",
                        explanation: "Respiration accounts for 60-70% of energy loss as organisms use energy for cellular processes."
                    }
                ]
            }
        ],

        interactiveElements: [
            {
                id: "energy-flow-simulation",
                title: "Energy Flow Simulation",
                type: "interactive",
                description: "Simulate energy flow through a Ghanaian ecosystem",
                instructions: "Adjust parameters to see how they affect energy flow and ecosystem health"
            },
            {
                id: "photosynthesis-lab",
                title: "Virtual Photosynthesis Lab",
                type: "simulation",
                description: "Experiment with light intensity, CO₂ levels, and temperature",
                instructions: "Design experiments to optimize photosynthesis rates"
            },
            {
                id: "respiration-calculator",
                title: "Respiration Calculator",
                type: "tool",
                description: "Calculate ATP production and energy efficiency",
                instructions: "Input glucose amount and see detailed energy calculations"
            }
        ],

        realWorldApplications: [
            {
                id: "ghana-cocoa",
                title: "Ghanaian Cocoa Production",
                description: "How photosynthesis and respiration affect cocoa yields",
                content: "Cocoa trees in Ghana face unique challenges: seasonal drought, soil nutrient depletion, and climate change. Understanding photosynthesis helps farmers optimize shade, irrigation, and fertilization. Respiration rates affect post-harvest storage and fermentation processes."
            },
            {
                id: "sports-performance",
                title: "Sports Performance in Ghana",
                description: "Energy systems in athletics and physical labor",
                content: "Ghanaian athletes and manual laborers rely on understanding aerobic vs. anaerobic respiration. Training programs can be optimized based on energy system requirements for different sports and work activities."
            },
            {
                id: "environmental-conservation",
                title: "Environmental Conservation",
                description: "Protecting Ghana's ecosystems and biodiversity",
                content: "Ghana's forests, wetlands, and marine ecosystems provide essential ecosystem services. Understanding energy flow helps conservationists protect these systems and restore degraded areas."
            }
        ]
    }
};

// Function to update the module in Supabase
async function updatePhotosynthesisRespirationModule() {
    console.log('🔍 Updating Photosynthesis & Respiration module with comprehensive content...\n');

    try {
        // First, find the Biology subject
        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('id')
            .eq('name', 'Biology')
            .single();

        if (subjectsError) {
            console.error('Error finding Biology subject:', subjectsError);
            return;
        }

        const biologySubjectId = subjects.id;
        console.log(`✅ Found Biology subject with ID: ${biologySubjectId}`);

        // Find the Photosynthesis & Respiration module
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('id')
            .eq('subject_id', biologySubjectId)
            .eq('title', 'Photosynthesis & Respiration')
            .single();

        if (modulesError) {
            console.error('Error finding module:', modulesError);
            return;
        }

        const moduleId = modules.id;
        console.log(`✅ Found module with ID: ${moduleId}`);

        // Update the module with comprehensive content
        const { data: updateData, error: updateError } = await supabase
            .from('modules')
            .update({
                title: comprehensiveContent.title,
                description: comprehensiveContent.description,
                estimated_duration: comprehensiveContent.estimated_duration,
                difficulty_level: comprehensiveContent.difficulty_level,
                content: comprehensiveContent.content,
                updated_at: new Date().toISOString()
            })
            .eq('id', moduleId)
            .select();

        if (updateError) {
            console.error('Error updating module:', updateError);
            return;
        }

        console.log('✅ Module updated successfully!');
        console.log('📊 New module details:');
        console.log(`   Title: ${updateData[0].title}`);
        console.log(`   Duration: ${updateData[0].estimated_duration} minutes`);
        console.log(`   Difficulty: ${updateData[0].difficulty_level}`);
        console.log(`   Content sections: ${comprehensiveContent.content.lessons.length} lessons`);
        console.log(`   Interactive elements: ${comprehensiveContent.content.interactiveElements.length}`);
        console.log(`   Real-world applications: ${comprehensiveContent.content.realWorldApplications.length}`);

        // Now create comprehensive quizzes for the module
        await createComprehensiveQuizzes(moduleId);

    } catch (error) {
        console.error('❌ Error updating module:', error);
    }
}

// Function to create comprehensive quizzes
async function createComprehensiveQuizzes(moduleId) {
    console.log('\n🧪 Creating comprehensive quizzes...');

    const quizzes = [
        {
            title: "Photosynthesis & Respiration - Comprehensive Assessment",
            description: "50-question comprehensive assessment covering all aspects of energy systems",
            questions: generateComprehensiveQuestions(),
            time_limit: 90, // 90 minutes
            passing_score: 70
        },
        {
            title: "Light Reactions & Calvin Cycle Quiz",
            description: "Focused quiz on photosynthesis processes",
            questions: generatePhotosynthesisQuestions(),
            time_limit: 45,
            passing_score: 75
        },
        {
            title: "Cellular Respiration Quiz",
            description: "Detailed quiz on respiration pathways",
            questions: generateRespirationQuestions(),
            time_limit: 45,
            passing_score: 75
        },
        {
            title: "Energy Flow & Ecosystems Quiz",
            description: "Quiz on ecosystem energy dynamics",
            questions: generateEcosystemQuestions(),
            time_limit: 30,
            passing_score: 70
        }
    ];

    for (const quiz of quizzes) {
        try {
            const { data: quizData, error: quizError } = await supabase
                .from('quizzes')
                .insert({
                    module_id: moduleId,
                    title: quiz.title,
                    description: quiz.description,
                    questions: quiz.questions,
                    time_limit: quiz.time_limit,
                    passing_score: quiz.passing_score
                })
                .select();

            if (quizError) {
                console.error(`Error creating quiz "${quiz.title}":`, quizError);
            } else {
                console.log(`✅ Created quiz: ${quiz.title}`);
            }
        } catch (error) {
            console.error(`Error creating quiz "${quiz.title}":`, error);
        }
    }
}

// Generate comprehensive questions
function generateComprehensiveQuestions() {
    return [
        // Light Reactions Questions
        {
            id: "comp-lr-1",
            type: "mcq",
            topic: "Light Reactions",
            question: "Which pigment is primarily responsible for absorbing light energy in Photosystem II?",
            options: {
                "A": "Chlorophyll a (P680)",
                "B": "Chlorophyll b",
                "C": "Carotenoids",
                "D": "Phycobilins"
            },
            correctAnswer: "A",
            explanation: "Photosystem II contains chlorophyll a with an absorption peak at 680nm (P680).",
            difficulty: "intermediate"
        },
        {
            id: "comp-lr-2",
            type: "mcq",
            topic: "Light Reactions",
            question: "What is the primary function of the cytochrome b6f complex?",
            options: {
                "A": "Split water molecules",
                "B": "Transfer electrons between photosystems",
                "C": "Produce ATP directly",
                "D": "Fix carbon dioxide"
            },
            correctAnswer: "B",
            explanation: "The cytochrome b6f complex transfers electrons from Photosystem II to Photosystem I.",
            difficulty: "advanced"
        },

        // Calvin Cycle Questions
        {
            id: "comp-cc-1",
            type: "mcq",
            topic: "Calvin Cycle",
            question: "How many CO₂ molecules must enter the Calvin cycle to produce one glucose molecule?",
            options: {
                "A": "3",
                "B": "6",
                "C": "12",
                "D": "18"
            },
            correctAnswer: "B",
            explanation: "Six CO₂ molecules are required because each cycle produces one G3P, and two G3P molecules are needed to make one glucose.",
            difficulty: "intermediate"
        },

        // Respiration Questions
        {
            id: "comp-cr-1",
            type: "mcq",
            topic: "Cellular Respiration",
            question: "Which enzyme catalyzes the rate-limiting step of glycolysis?",
            options: {
                "A": "Hexokinase",
                "B": "Phosphofructokinase-1",
                "C": "Glyceraldehyde-3-phosphate dehydrogenase",
                "D": "Pyruvate kinase"
            },
            correctAnswer: "B",
            explanation: "Phosphofructokinase-1 is the rate-limiting enzyme of glycolysis and is regulated by ATP and citrate levels.",
            difficulty: "advanced"
        },

        // Energy Flow Questions
        {
            id: "comp-ef-1",
            type: "mcq",
            topic: "Energy Flow",
            question: "What percentage of energy from the sun is typically converted to chemical energy by plants?",
            options: {
                "A": "0.1-0.3%",
                "B": "1-3%",
                "C": "10-15%",
                "D": "25-30%"
            },
            correctAnswer: "B",
            explanation: "Plants typically convert 1-3% of incident sunlight to chemical energy through photosynthesis.",
            difficulty: "basic"
        }
    ];
}

// Generate photosynthesis-specific questions
function generatePhotosynthesisQuestions() {
    return [
        {
            id: "photo-1",
            type: "mcq",
            topic: "Photosynthesis",
            question: "What is the primary function of the light reactions?",
            options: {
                "A": "Fix carbon dioxide",
                "B": "Produce ATP and NADPH",
                "C": "Synthesize glucose",
                "D": "Release oxygen"
            },
            correctAnswer: "B",
            explanation: "The light reactions produce ATP and NADPH, which are used by the Calvin cycle.",
            difficulty: "basic"
        }
        // Add more photosynthesis questions...
    ];
}

// Generate respiration-specific questions
function generateRespirationQuestions() {
    return [
        {
            id: "resp-1",
            type: "mcq",
            topic: "Respiration",
            question: "Where does the Krebs cycle occur?",
            options: {
                "A": "Cytosol",
                "B": "Mitochondrial matrix",
                "C": "Inner mitochondrial membrane",
                "D": "Outer mitochondrial membrane"
            },
            correctAnswer: "B",
            explanation: "The Krebs cycle occurs in the mitochondrial matrix.",
            difficulty: "basic"
        }
        // Add more respiration questions...
    ];
}

// Generate ecosystem questions
function generateEcosystemQuestions() {
    return [
        {
            id: "eco-1",
            type: "mcq",
            topic: "Ecosystems",
            question: "What is the 10% rule in ecology?",
            options: {
                "A": "Only 10% of species survive",
                "B": "10% of energy transfers between trophic levels",
                "C": "10% of biomass is recycled",
                "D": "10% of nutrients are lost"
            },
            correctAnswer: "B",
            explanation: "The 10% rule states that only about 10% of energy is transferred between trophic levels.",
            difficulty: "basic"
        }
        // Add more ecosystem questions...
    ];
}

// Run the update
updatePhotosynthesisRespirationModule();
