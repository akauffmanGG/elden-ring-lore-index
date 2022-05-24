import './styles/styles.less';
import { default as autocomplete } from './autocomplete.js';

async function initialize () {
  await includeHtml();
  autocomplete();
  buildTableOfContents();
}

async function includeHtml () {
  let elements = document.querySelectorAll('.include');
  let promises = Array.from(elements).map(async element => {
    /*search for elements with a certain atrribute:*/
    let file = element.getAttribute('include-html');
    if (file) {
      let response = await fetch(`includes/${file}.html`);
      let body;
      if (response.ok) {
        body = await response.text();
      } else {
        body = 'Could not load content';
      }

      element.innerHTML = body;

      return body;
    }
  });

  return Promise.all(promises);
}

function buildTableOfContents () {
  const sidebar = document.querySelector('.sidebar');
  const toc = document.createElement('div');
  toc.className = 'table-of-contents';

  const categories = document.querySelectorAll('.main .category');
  categories.forEach(category => {
    const titleEl = category.querySelector('h2');
    const menu = document.createElement('div');
    menu.className = 'menu';

    const items = category.querySelectorAll('.items h3');
    if (items.length) {
      const title = createCollapsibleTitle(titleEl.innerHTML);
      menu.appendChild(title);

      menu.appendChild(createContent(items));
    } else {
      const title = createLinkTitle(titleEl.innerHTML, titleEl.id);

      menu.appendChild(title);
    }

    toc.appendChild(menu);
  });

  sidebar.appendChild(toc);
}

function createCollapsibleTitle (text) {
  const title = document.createElement('div');
  title.innerHTML = text;
  title.className = 'menu-title';
  title.classList.add('collapsible');
  title.addEventListener('click', function () {
    this.classList.toggle('active');

    let content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });

  return title;
}

function createLinkTitle (text, id) {
  const title = createLinkEl(text, id);
  title.className = 'menu-title';

  return title;
}

function createLinkEl (text, id) {
  const link = document.createElement('a');
  link.innerHTML = text;
  link.href = `#${id}`;

  return link;
}

function createContent (items) {
  const content = document.createElement('div');
  content.className = 'menu-content';

  const itemsEl = document.createElement('ul');

  items.forEach(item => {
    const itemEl = document.createElement('li');
    const link = createLinkEl(item.innerHTML, item.id);
    itemEl.className = 'menu-item';
    itemEl.appendChild(link);

    itemsEl.appendChild(itemEl);
  });

  content.appendChild(itemsEl);

  return content;
}

export function toggleOpen() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

export function toggleExpand() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('expanded');
}

document.body.onload = initialize;
