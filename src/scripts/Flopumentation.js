import hljs from 'highlight.js';
import Page from './Page'

class Flopumentation {
  
  constructor(config) {

    this.page = new Page(config)
    this.config = config
    
    document.addEventListener('DOMContentLoaded', () => {
      this.page.generateDOM()
      this.initMenuListener()
      this.loadPage(this.config.initialPage ?? '')
    })

    this.initMenuListener.bind(this)
    this.initContentListener.bind(this)
    this.loadPage.bind(this)
  }

  initMenuListener = () => {
    const pages = this.page.getMenuItems()
    pages.forEach(item => {
      item.addEventListener('click', event => {
        this.loadPage( event.target.getAttribute('href').substring(1) )
      })
    })
  }

  initContentListener = () => {
    const links = this.page.getContentLinks()
    links.forEach(link => {
      const href = link.getAttribute('href')
      if( href.startsWith('http') || href.startsWith('#') ) return;
      link.setAttribute('href', `#${href}`)
      link.addEventListener('click', () => this.loadPage(href))
    })
  }

  loadPage = page => {

    this.page.toggleLoading(true)
    this.page.element.main.classList.add('fade')
    
    fetch(page) 
      .then(response => response.text())
      .then(this.page.setContent)
      .finally(() => {
        hljs.highlightAll()
        this.initContentListener()
        this.page.setContentAnchors()
        this.page.element.main.classList.remove('fade')
        this.page.element.main.scrollTop = 0
        setTimeout(() => this.page.toggleLoading(false), 1000)
      })
  }

}

export default Flopumentation
