const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('http://localhost:5000')) {
    if (!content.includes('import API_URL from')) {
      content = 'import API_URL from \'../config\';\n' + content;
    }
    
    // Replace URL
    content = content.replace(/http:\/\/localhost:5000/g, '${API_URL}');
    
    // Fix fetch and axios that were using single quotes
    content = content.replace(/fetch\('\$\{API_URL\}(.*?)'/g, 'fetch(`\\${API_URL}$1`');
    content = content.replace(/axios\.\w+\('\$\{API_URL\}(.*?)'/g, match => match.replace(/'/g, '`'));
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
}
