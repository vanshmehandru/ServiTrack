const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('\\${API_URL}')) {
    // String replacement without regex to avoid escaping hell
    content = content.split('\\${API_URL}').join('${API_URL}');
    fs.writeFileSync(filePath, content);
    console.log('Fixed backslash in', file);
  }
}
