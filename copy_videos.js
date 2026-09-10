const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Hp/Desktop/TRAM';
const destDir = 'c:/Users/Hp/Desktop/TRAM/meridian-estates/public/videos';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
const mp4Files = files.filter(f => f.endsWith('.mp4'));

console.log(`Found ${mp4Files.length} MP4 files in source directory.`);

// Copy all original files
mp4Files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${file}`);
});

// Semantic mappings
const aliases = [
  { match: 'Futuristic_architectural_landmar', alias: 'hero-skyline.mp4' },
  { match: 'Drone_descending_toward_waterfro', alias: 'hero-waterfront.mp4' },
  { match: 'Drone_pass_luxury_property_exter', alias: 'hero-grove.mp4' },
  { match: 'Modern_villa_exterior_and_pool', alias: 'hero-island.mp4' },
  { match: 'Camera_moving_through_living_room', alias: 'living-volume.mp4' },
  { match: 'Marble_kitchen_island_with_lighting', alias: 'culinary-atelier.mp4' },
  { match: 'Camera_moving_through_luxury_liv', alias: 'master-sanctuary.mp4' },
  { match: 'Camera_moving_through_grand_entr', alias: 'grand-entrance.mp4' },
  { match: 'Interior_view_overlooking_rollin', alias: 'ocean-view.mp4' },
  { match: 'Drone_gliding_over_calm_marina', alias: 'marina-slip.mp4' },
  { match: 'Exterior_architecture_at_dusk', alias: 'sunset-dusk.mp4' },
  { match: 'Modern_estate_exterior_at_sunset', alias: 'sunset-estate.mp4' },
  { match: 'Aerial_shot_of_neighborhood_feature_202609011006.mp4', alias: 'neighborhoods-aerial.mp4' },
  { match: 'Panning_luxury_amenity_spaces_fo', alias: 'amenity-tour.mp4' },
  { match: 'Futuristic_building_tour_1080p', alias: 'building-tour.mp4' },
  { match: 'Architectural_details_montage', alias: 'details-montage.mp4' },
  { match: 'Building_construction_timelapse', alias: 'timelapse-construction.mp4' }
];

aliases.forEach(({ match, alias }) => {
  const found = mp4Files.find(f => f.includes(match));
  if (found) {
    const src = path.join(srcDir, found);
    const dest = path.join(destDir, alias);
    fs.copyFileSync(src, dest);
    console.log(`Aliased: ${found} -> ${alias}`);
  }
});

console.log('Finished setting up video assets.');
