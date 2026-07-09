import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Update index.html
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/href="\/style\.css"/g, 'href="./style.css"');
indexHtml = indexHtml.replace(/src="\/main\.js"/g, 'src="./main.js"');
indexHtml = indexHtml.replace(/href="\/assets\//g, 'href="assets/');
indexHtml = indexHtml.replace(/src="\/assets\//g, 'src="assets/');
indexHtml = indexHtml.replace(/poster="\/assets\//g, 'poster="assets/');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('index.html updated successfully with relative paths.');

// 2. Update style.css
const styleCssPath = path.join(__dirname, '..', 'style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');
styleCss = styleCss.replace(/url\("\/assets\//g, 'url("assets/');
fs.writeFileSync(styleCssPath, styleCss, 'utf8');
console.log('style.css updated successfully with relative paths.');
