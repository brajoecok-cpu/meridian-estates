const fs = require('fs');

let file = fs.readFileSync('app/admin/page.tsx', 'utf8');

const handleSaveCode = `
  const handleSaveAboutContent = async (updatedAbout: AboutContent) => {
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAbout),
      });
      if (res.ok) {
        const saved = await res.json();
        setAboutContent(saved);
        setSaveStatus('About Content Saved!');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error saving about content:', error);
    }
  };
`;

file = file.replace('  const handleSaveSiteSettings = async', handleSaveCode + '\n  const handleSaveSiteSettings = async');
fs.writeFileSync('app/admin/page.tsx', file);
