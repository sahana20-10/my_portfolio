const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.split('href="assets/Sahana_R_Resume.pdf"').join('href="assets/resume/Sahana_R_Resume.pdf"');
html = html.split('href="assets/resume.html"').join('href="assets/resume/resume.html"');
fs.writeFileSync('index.html', html);

let count = (html.match(/assets\/resume\/Sahana_R_Resume\.pdf/g) || []).length;
console.log('Done. Resume links updated: ' + count + ' occurrences now pointing to assets/resume/');

