const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const FEED_URL = 'https://www.keralalotteries.net/feeds/posts/default/-/Kerala%20Lottery%20Results?alt=rss';
const TEMPLATE_PATH = path.join(__dirname, 'index.template.html');
const DETAIL_TEMPLATE_PATH = path.join(__dirname, 'detail.template.html');
const OUTPUT_PATH = path.join(__dirname, 'index.html');

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return today.getFullYear() === d.getFullYear() &&
         today.getMonth() === d.getMonth() &&
         today.getDate() === d.getDate();
}

function makeSafeFilename(title, date) {
  // Try to extract code and number from title, fallback to sanitized title
  let code = '';
  let number = '';
  let match = title.match(/([A-Z]{2,})[\s,-]+(\d{1,4})/i);
  if (match) {
    code = match[1].toUpperCase();
    number = match[2];
  } else {
    code = title.replace(/[^A-Z0-9]+/gi, '').substring(0, 4).toUpperCase();
    number = '';
  }
  const datePart = date.replace(/\//g, '-');
  return `${code}${number ? '-' + number : ''}-${datePart}.html`;
}

(async () => {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);

  // Get latest 11 posts
  const posts = feed.items.slice(0, 11);

  const detailTemplate = fs.readFileSync(DETAIL_TEMPLATE_PATH, 'utf8');

  let postsHtml = '';
  for (const item of posts) {
    const title = item.title || 'Untitled';
    const link = item.link || '#';
    const snippet = item.contentSnippet || '';
    const content = item['content:encoded'] || item.content || snippet;
    const pubDate = item.pubDate ? formatDate(item.pubDate) : '';
    const today = item.pubDate && isToday(item.pubDate);
    const filename = makeSafeFilename(title, pubDate);

    // Generate detail page
    const detailHtml = detailTemplate
      .replace(/<!-- TITLE -->/g, title)
      .replace(/<!-- DATE -->/g, pubDate)
      .replace(/<!-- CONTENT -->/g, content);
    fs.writeFileSync(path.join(__dirname, filename), detailHtml, 'utf8');

    // Link card to local detail page
    postsHtml += `
      <div class="result-card${today ? ' today' : ''}">
        <a class="result-title" href="${filename}" target="_blank" rel="noopener">${title}</a>
        ${pubDate ? `<span class="result-date">${pubDate}</span>` : ''}
        <div class="result-snippet">${snippet}</div>
        ${today ? `<span class="badge-today">TODAY</span>` : ''}
      </div>
    `;
  }

  // Read template and inject posts
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const output = template.replace('<!-- POSTS_PLACEHOLDER -->', postsHtml);

  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log('index.html and detail pages generated successfully!');
})(); 