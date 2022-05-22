import './styles/styles.less'

function initialize () {
    includeHtml();
  buildTableOfContents()
}

function includeHtml () {
  let z, i, elmnt, file, xhttp
  /* Loop through a collection of all HTML elements: */
  let elements = document.querySelectorAll('.include')
  elements.forEach( element => {

    /*search for elements with a certain atrribute:*/
    file = element.getAttribute('include-html');
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            element.innerHTML = this.responseText
          }
          if (this.status == 404) {
            element.innerHTML = 'Page not found.'
          }
          /* Remove the attribute, and call this function once more: */
          element.removeAttribute('include-html')
          includeHTML();
        }
      }
      xhttp.open('GET', 'includes/' + file, true)
      xhttp.send()
      /* Exit the function: */
      return
    }
  });
}

function buildTableOfContents () {
  const sidebar = document.querySelector('.sidebar')
  const toc = document.createElement('div')
  toc.className = 'table-of-contents'

  const categories = document.querySelectorAll('.main .category')
  categories.forEach(category => {
    const titleEl = category.querySelector('h2')
    const menu = document.createElement('div')
    menu.className = 'menu'

    const items = category.querySelectorAll('.items h3')
    if (items.length) {
      const title = createCollapsibleTitle(titleEl.innerHTML)
      menu.appendChild(title)

      menu.appendChild(createContent(items))
    } else {
      const title = createLinkTitle(titleEl.innerHTML, titleEl.id)

      menu.appendChild(title)
    }

    toc.appendChild(menu)
  })

  sidebar.appendChild(toc)
}

function createCollapsibleTitle (text) {
  const title = document.createElement('div')
  title.innerHTML = text
  title.className = 'menu-title'
  title.classList.add('collapsible')
  title.addEventListener('click', function () {
    this.classList.toggle('active')

    let content = this.nextElementSibling
    if (content.style.maxHeight) {
      content.style.maxHeight = null
    } else {
      content.style.maxHeight = content.scrollHeight + 'px'
    }
  })

  return title
}

function createLinkTitle (text, id) {
  const title = createLinkEl(text, id)
  title.className = 'menu-title'

  return title
}

function createLinkEl (text, id) {
  const link = document.createElement('a')
  link.innerHTML = text
  link.href = `#${id}`

  return link
}

function createContent (items) {
  const content = document.createElement('div')
  content.className = 'menu-content'

  const itemsEl = document.createElement('ul')

  items.forEach(item => {
    const itemEl = document.createElement('li')
    const link = createLinkEl(item.innerHTML, item.id)
    itemEl.className = 'menu-item'
    itemEl.appendChild(link)

    itemsEl.appendChild(itemEl)
  })

  content.appendChild(itemsEl)

  return content
}

document.body.onload = initialize
