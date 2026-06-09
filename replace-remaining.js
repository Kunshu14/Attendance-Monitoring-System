const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Borders
  content = content.replace(/border-white\/(?:\[0\.\d+\]|10)/g, 'border-panel-border');
  
  // Hover Backgrounds (bg-white/alpha)
  content = content.replace(/bg-white\/(?:\[0\.\d+\]|10)/g, 'bg-panel-hover');
  
  // Also fix from-white/alpha and to-white/alpha in gradients
  // e.g. from-white/[0.05] to-white/[0.02] -> these should be from-panel-hover to-transparent
  content = content.replace(/from-white\/\[0\.05\] to-white\/\[0\.02\]/g, 'from-panel-hover to-transparent');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Done replacement part 3');
