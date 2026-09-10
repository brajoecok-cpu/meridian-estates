const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'content/site-content.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

data.aboutContent = {
  heroTitle: 'The Architects <br /> <span class="italic bg-gradient-to-r from-[#AEE2FF] via-[#B5BAFF] to-[#9FA1FF] bg-clip-text text-transparent font-normal">of Permanence</span>',
  heroSubtitle: 'The Master Developer',
  heroDescription: 'Sculpting monumental landmarks across Miami for over two decades. Real architectural monuments, built with uncompromising precision.',
  heroVideoMp4: '/videos/details-montage.mp4',
  heroPoster: '/images/im4.jpeg',
  philosophyTitle: 'Sculpting Monuments <br /> <span class="gold-gradient-text font-normal">for Generations</span>',
  philosophySubtitle: 'Founding Philosophy',
  philosophyParagraph1: 'Over two decades in South Florida, Kings Real Estate has developed landmark residential towers and private island enclaves that continuously redefine the standard of waterfront living.',
  philosophyParagraph2: 'We partner exclusively with Pritzker Prize laureates, bespoke Parisian interior ateliers, and master botanical landscape architects to ensure every building stands as an enduring work of art.',
  philosophyImage: '/images/im4.jpeg',
  philosophyStat1Value: '25+ Years',
  philosophyStat1Label: 'Miami Heritage',
  philosophyStat2Value: '14 Landmarks',
  philosophyStat2Label: 'Delivered on Schedule',
  portfolioTitle: 'The Real Estate <span class="gold-gradient-text font-normal">Portfolio</span>',
  portfolioSubtitle: 'Architectural Monuments',
  portfolioDescription: 'Examine our flagship landmark towers and private waterfront estates through real architectural photography.',
  deliveredProjects: [
    {
      id: 'proj-1',
      title: 'The Marquis Brickell',
      neighborhood: 'Brickell Financial District',
      architect: 'Arquitectonica & Kings Atelier',
      units: '84 Sky Mansions',
      valuation: '$12,500,000+',
      status: 'Flagship Delivered',
      image: '/images/im1.jpg',
      description: 'A 64-story monumental glass beacon on Brickell Avenue featuring double-height ceiling volumes and private helipad access.',
      slug: 'the-marquis-brickell'
    },
    {
      id: 'proj-2',
      title: 'Aura Biscayne',
      neighborhood: 'Edgewater Waterfront',
      architect: 'KPF International',
      units: '60 Flow-Through Residences',
      valuation: '$8,200,000+',
      status: 'Delivered Landmark',
      image: '/images/im2.jpg',
      description: 'Sinuous nautical architecture directly on the bay with private deep-water superyacht slips and vanishing glass loggias.',
      slug: 'aura-biscayne'
    },
    {
      id: 'proj-3',
      title: 'The Palma Grove',
      neighborhood: 'Coconut Grove',
      architect: 'Studio Liaigre Paris',
      units: '18 Botanical Villas',
      valuation: '$14,000,000+',
      status: 'Private Enclave',
      image: '/images/im15.webp',
      description: 'Gated tropical modernism hidden among century-old banyan canopies, framing private lagoons and boat basins.',
      slug: 'the-palma-grove'
    },
    {
      id: 'proj-4',
      title: 'Vela Star Island',
      neighborhood: 'Star Island / Miami Beach',
      architect: 'Zaha Hadid Architects',
      units: '12 Trophy Compounds',
      valuation: '$24,000,000+',
      status: 'Private Commission',
      image: '/images/im18.jpg',
      description: 'Ultra-exclusive island compounds with direct deep-water superyacht dockage, private helipads, and fortified biometric perimeter.',
      slug: 'vela-star-island'
    }
  ],
  tenetsTitle: 'The Four Tenets of Kings',
  tenetsSubtitle: 'Core Tenets',
  tenets: [
    {
      id: 'tenet-1',
      iconName: 'Landmark',
      title: 'Architectural Sovereignty',
      desc: 'Working strictly with world-renowned architects to create generational skyline signatures.'
    },
    {
      id: 'tenet-2',
      iconName: 'Shield',
      title: 'Extreme Discretion',
      desc: 'Engineered for family offices and discerning global buyers with biometric privacy.'
    },
    {
      id: 'tenet-3',
      iconName: 'Award',
      title: 'Flawless Execution',
      desc: 'Over $2.8B in luxury assets delivered without schedule or budget compromises.'
    },
    {
      id: 'tenet-4',
      iconName: 'Diamond',
      title: 'Enduring Legacy',
      desc: 'Constructed with marine-grade materials built to withstand centuries.'
    }
  ],
  ctaTitle: 'Schedule a Private Briefing',
  ctaDescription: 'Connect directly with our senior managing partners to explore upcoming off-market releases and bespoke commissioning.'
};

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Updated site-content.json");
