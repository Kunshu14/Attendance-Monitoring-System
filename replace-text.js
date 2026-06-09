const fs = require('fs');

const replaceInFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Layout
  content = content.replace('bg-page-bg text-white', 'bg-page-bg text-fg-primary');
  
  // Dashboard
  content = content.replace(/text-sm font-semibold text-white/g, 'text-sm font-semibold text-fg-primary');
  content = content.replace(/text-3xl font-bold text-white/g, 'text-3xl font-bold text-fg-primary');
  content = content.replace(/text-xl font-bold text-white/g, 'text-xl font-bold text-fg-primary');
  
  // TopBar
  content = content.replace('text-base font-semibold text-white', 'text-base font-semibold text-fg-primary');
  
  // Sidebar
  content = content.replace('<Wifi size={18} className="text-white" />', '<Wifi size={18} className="text-fg-primary" />');
  
  // Inputs (LectureFilters, ProfessorModal, StudentModal)
  content = content.replace(/text-sm text-white placeholder:text-fg-muted/g, 'text-sm text-fg-primary placeholder:text-fg-muted');
  
  fs.writeFileSync(file, content, 'utf8');
}

const filesToProcess = [
  'src/app/layout.tsx',
  'src/app/dashboard/page.tsx',
  'src/components/layout/TopBar.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/ui/Modal.tsx',
  'src/components/history/LectureFilters.tsx',
  'src/components/history/AttendeeSlideOver.tsx',
  'src/components/roster/ProfessorModal.tsx',
  'src/components/roster/ProfessorTable.tsx',
  'src/components/roster/StudentTable.tsx',
  'src/components/roster/StudentSlideOver.tsx',
  'src/components/roster/StudentModal.tsx',
  'src/components/live/LiveSessionCard.tsx',
  'src/components/dashboard/AttendanceChart.tsx',
];

filesToProcess.forEach(replaceInFile);

console.log('Done replacement part 2');
