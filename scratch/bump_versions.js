const fs = require('fs');

const files = ['index.html', 'about.html', 'services.html', 'coaches.html', 'contact.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/css\/style\.css(\?v=[\d\.]+)?/g, 'css/style.css?v=3.2');
  content = content.replace(/js\/main\.js(\?v=[\d\.]+)?/g, 'js/main.js?v=3.2');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated cache versions in ${file}`);
});
