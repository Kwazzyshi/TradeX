const fs = require('fs');
const files = [
  'backend/routes/news.js',
  'backend/services/priceScraper.js',
  'frontend/src/components/news/VelocityChart.jsx',
  'frontend/src/components/news/NarrativeMap.jsx',
  'frontend/src/components/news/NewsVolumeHeatmap.jsx',
  'frontend/src/pages/News.jsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed', f);
});
