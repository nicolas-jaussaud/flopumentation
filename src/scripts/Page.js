import { marked } from 'marked'

class Page {

  constructor(config) {
    this.config = config
    this.element = {}
  }

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
      content    : document.createElement('div')
    }

    const ids = ['container', 'header', 'main', 'title', 'theme', 'content']
    ids.forEach(name => {
      this.element[ name ].id = name  
    })

    this.element.title.textContent = this.config.title ?? ''

    this.element.loadingBar.className = 'loading-bar'
    this.element.header.className = 'load'

    this.element.main.appendChild(this.element.content)
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

  generateMenu = () => {

    const sections = document.createElement('ul')
    this.element.menu.appendChild(sections)

    this.config.sections.forEach(
      section => sections.appendChild( this.addSection(section) )
    )

    this.initMobileEvents()
    this.initThemeEvents()
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
    pageLink.href = `#${page.content}`
    pageElement.appendChild(pageLink)

    return pageElement
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
  getContentLinks = () => this.element.content.querySelectorAll('a')
  toggleLoading = loading => (
    this.element.loadingBar.setAttribute('data-loading', loading ? 'on' : 'off')
  )
}

export default Page
