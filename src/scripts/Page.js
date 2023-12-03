import { marked } from 'marked'

class Page {

  constructor(config) {
    this.config = config
    this.element = {}
    this.pages = this.setPages()
  }

  setPages = () => (
    this.config.sections.reduce(
      (pages, section) => ({
        ...(pages), 
        ...(section.pages.reduce(
          (pages, page) => ({ 
            ...pages, 
            [page.content]: { ...page } 
          }), {}
        ))
      }), {}
    )
  )

  /**
   * Generate the following html:
   * 
   * <span class="loading-bar"></span>
   * <header id="header" class="load">
   *   <h1 id="title"></h1>
   *   <span id="theme"></span>
   * </header>
   * <div id="container">
   *   <aside>
   *     <nav id="menu"></nav>
   *   </aside>
   *   <main id="main">
   *     <div id="content"></div>
   *   </main>
   * </div>
   */
  generateDOM = () => {

    this.element = {
      aside      : document.createElement('aside'),
      container  : document.createElement('div'),
      loadingBar : document.createElement('span'),
      header     : document.createElement('header'),
      theme      : document.createElement('span'),
      title      : document.createElement('h1'),
      menu       : document.createElement('nav'),
      main       : document.createElement('main'),
      content    : document.createElement('div'),
      footer     : document.createElement('footer')
    }

    const ids = ['container', 'header', 'main', 'title', 'theme', 'content', 'footer']
    ids.forEach(name => {
      this.element[ name ].id = name
    })

    this.element.title.textContent = this.config.title ?? ''

    this.element.loadingBar.className = 'loading-bar'
    this.element.header.className = 'load'

    this.element.main.appendChild(this.element.content)
    this.element.main.appendChild(this.element.footer)
    this.element.header.appendChild(this.element.title)
    this.element.header.appendChild(this.element.theme)
    this.element.aside.appendChild(this.element.menu)
    this.element.container.appendChild(this.element.aside)
    this.element.container.appendChild(this.element.main)
  
    document.body.appendChild(this.element.loadingBar)
    document.body.appendChild(this.element.header)
    document.body.appendChild(this.element.container)

    this.generateMenu()
  }
  
  /**
   * <ul>
   *   <li>
   *     Secton Title
   *     <ul>
   *       <li><a href="#./path/to/page.md">Page name 1</a></li>
   *       <li><a href="#./path/to/page.md">Page name 2</a></li>
   *     </ul>
   *   </li>
   *   // ...
   * </ul>
   */
  generateMenu = () => {

    const sections = document.createElement('ul')
    this.element.menu.appendChild(sections)

    this.config.sections.forEach(
      section => sections.appendChild( this.addSection(section) )
    )

    this.initMobileEvents()
    this.initThemeEvents()
  }

  addSection = section => {

    const element = document.createElement('li')
    element.textContent = section.title ?? ''
    
    const pages = document.createElement('ul')
    element.appendChild(pages)

    section.pages.forEach(
      page => pages.appendChild( this.addPage(page) )
    )

    return element
  }

  addPage = page => {

    const pageElement = document.createElement('li')
    const pageLink = document.createElement('a')
    
    pageLink.textContent = page.title
    pageLink.href = `#!${page.content}`
    pageElement.appendChild(pageLink)

    return pageElement
  }


  /**
   * <a href="./section-content/md">
   *   <strong>Previous:</strong>  
   *   <span>Section name</span>  
   * </a>
   * <a href="./section-content/md">
   *   <strong>Next:</strong>  
   *   <span>Section name</span>  
   * </a>
   */
  generateFooter = page => {

    this.element.footer.textContent = ''

    const prev = this.getPreviousPage(page)
    const next = this.getNextPage(page)

    if( prev ) this.generateFooterNav(prev, 'previous')
    if( next ) this.generateFooterNav(next, 'next')
  }

  generateFooterNav = (page, position) => {

    const link = document.createElement('a')
    link.id = `footer-nav-${position}`
    link.href = page.content

    const title = document.createElement('strong')
    title.textContent = `${position === 'next' ? 'Next' : 'Previous'} page:`
    link.appendChild(title)

    const content = document.createElement('span')
    content.textContent = page.title
    link.appendChild(content)

    this.element.footer.appendChild(link)
  }

  getPage = page => this.pages[page] ?? false
  
  getPreviousPage = page => {
    const currentPosition = Object.keys(this.pages).indexOf(page)
    const previousPage = Object.keys(this.pages)[ currentPosition - 1] ?? false
    return this.getPage(previousPage) 
  } 

  getNextPage = page => {
    const currentPosition = Object.keys(this.pages).indexOf(page)
    const nextPage = Object.keys(this.pages)[ currentPosition + 1] ?? false
    return this.getPage(nextPage) 
  }

  initMobileEvents() {
    this.element.aside.addEventListener('click', () => {
      const isOpen = this.element.aside.getAttribute('data-open') !== 'true'
      this.element.aside.setAttribute('data-open', isOpen ? 'true' : 'false')
      if( isOpen ) this.element.menu.scrollTop = 0
    })
  }

  initThemeEvents() {
    this.element.theme.addEventListener('click', () => {
      const theme = document.body.getAttribute('data-theme')
      document.body.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light')
    })
  }

  setContentAnchors = () => {
    const title = this.getContentTitles()
    title.forEach(
      title => title.setAttribute(
        'id', 
        title.textContent.toLowerCase().replaceAll(' ', '-')
      )
    )
  }

  setContent = content => this.element.content.innerHTML = marked.parse(content) 
  getMenuItems = () => this.element.menu.querySelectorAll('nav a')
  getContentTitles = () => this.element.content.querySelectorAll('h1, h2, h3, h4, h5, h6')
  getContentLinks = () => this.element.main.querySelectorAll('a')
  toggleLoading = loading => (
    this.element.loadingBar.setAttribute('data-loading', loading ? 'on' : 'off')
  )
}

export default Page
