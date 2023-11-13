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
   * </header>
   * <div id="container">
   *   <aside>
   *     <nav id="menu"></nav>
   *   </aside>
   *   <main id="content"></main>
   * </div>
   * <footer id="footer"></footer>
   * 
   */
  generateDOM = () => {

    this.element = {
      aside      : document.createElement('aside'),
      container  : document.createElement('div'),
      loadingBar : document.createElement('span'),
      header     : document.createElement('header'),
      title      : document.createElement('h1'),
      menu       : document.createElement('nav'),
      main       : document.createElement('main'),
      footer     : document.createElement('footer')
    }

    const ids = ['container', 'header', 'main', 'title', 'footer']
    ids.forEach(name => {
      this.element[ name ].id = name  
    })

    this.element.textContent = this.config.title ?? ''

    this.element.loadingBar.className = 'loading-bar'
    this.element.header.className = 'load'
    
    this.element.header.appendChild(this.element.title)
    this.element.aside.appendChild(this.element.menu)
    this.element.container.appendChild(this.element.aside)
    this.element.container.appendChild(this.element.main)
  
    document.body.appendChild(this.element.loadingBar)
    document.body.appendChild(this.element.header)
    document.body.appendChild(this.element.container)
    document.body.appendChild(this.element.footer)

    this.generateMenu()
  }

  generateMenu = () => {

    const sections = document.createElement('ul')
    this.element.menu.appendChild(sections)

    this.config.sections.forEach(
      section => sections.appendChild( this.addSection(section) )
    )
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

  setContent = content => this.element.main.innerHTML = marked.parse(content) 
  getMenuItems = () => this.element.menu.querySelectorAll('nav a')    
  toggleLoading = loading => (
    this.element.loadingBar.setAttribute('data-loading', loading ? 'on' : 'off')
  )
}

export default Page
