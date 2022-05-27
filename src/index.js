import './styles/styles.less';
import { default as autocomplete } from './autocomplete.js';
import { default as tableOfContents  } from './table-of-contents.js';

async function initialize () {
  await includeHtml();
  autocomplete();
  tableOfContents();
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

export function toggleOpen () {
  const sidebar = document.querySelector('.sidebar');
  const icon = sidebar.querySelector('.button-bar .open-btn i');
  sidebar.classList.toggle('open');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
}

export function toggleExpand () {
  const sidebar = document.querySelector('.sidebar');
  const icon = sidebar.querySelector('.button-bar .expand-btn i');
  sidebar.classList.toggle('expanded');
  icon.classList.toggle('fa-angles-right');
  icon.classList.toggle('fa-angles-left');
}

document.body.onload = initialize;
