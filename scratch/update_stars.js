const fs = require('fs');

let html = fs.readFileSync('contact.html', 'utf8');
const beforeCount = (html.match(/ \*<\/label>/g) || []).length;
html = html.split(' *</label>').join(' <span class="req-star">*</span></label>');
fs.writeFileSync('contact.html', html, 'utf8');

console.log(`Replaced ${beforeCount} asterisks in contact.html`);
