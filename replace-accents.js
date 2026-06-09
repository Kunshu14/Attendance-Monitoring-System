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
  
  content = content.replace(/text-indigo-400(?!\/)/g, 'text-indigo-600 dark:text-indigo-400');
  content = content.replace(/text-indigo-300(?!\/)/g, 'text-indigo-700 dark:text-indigo-300');
  content = content.replace(/text-indigo-200(?!\/)/g, 'text-indigo-800 dark:text-indigo-200');
  
  content = content.replace(/text-violet-400(?!\/)/g, 'text-violet-600 dark:text-violet-400');
  content = content.replace(/text-violet-300(?!\/)/g, 'text-violet-700 dark:text-violet-300');
  
  content = content.replace(/text-red-400(?!\/)/g, 'text-red-600 dark:text-red-400');

  content = content.replace(/border-t-indigo-400/g, 'border-t-indigo-600 dark:border-t-indigo-400');
  content = content.replace(/border-t-violet-400/g, 'border-t-violet-600 dark:border-t-violet-400');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Done replacement part 4');
