import hljs from 'highlight.js';
import Page from './Page'

class Flopumentation {
  
  constructor(config) {

    this.config = config

    this.page = new Page(config)
    
    document.addEventListener('DOMContentLoaded', () => {
      this.page.generateDOM()
      this.initMenuListener()
      this.loadInitialPage()
      this.initHistoryListener()
    })

    this.initMenuListener.bind(this)
    this.initContentListener.bind(this)
    this.loadPage.bind(this)
  }

  loadInitialPage = () => { 
    
    if( ! window.location.hash.includes('#!') ) {
      return this.loadPage(this.config.initialPage ?? '')
    }

    const initialPage = window.location.hash.split('#!').pop()
    this.loadPage(initialPage)
  }

  initHistoryListener = () => {
    window.addEventListener('popstate', event => {
      const target = event.target.window.location.hash
      if( ! target.includes('#!') ) return;
      const page = target.split('#!').pop()
      if( page !== this.page.current ) this.loadPage(page)
    })
  }

  initMenuListener = () => {
    const pages = this.page.getMenuItems()
    pages.forEach(item => {
      item.addEventListener('click', event => {
        this.loadPage( event.target.getAttribute('href').substring(2) )
      })
    })
  }

  initContentListener = () => {
    const links = this.page.getContentLinks()
    links.forEach(link => {
      const href = link.getAttribute('href')
      if( href.startsWith('http') || href.startsWith('#') ) return;
      link.setAttribute('href', `#!${href}`)
      link.addEventListener('click', () => this.loadPage(href))
    })
  }

  loadPage = page => {

    this.page.toggleLoading(true)
    this.page.current = page 
    this.page.element.main.classList.add('fade')
    
    fetch(page) 
      .then(response => response.text())
      .then(this.page.setContent)
      .finally(() => {
        this.page.generateFooter(page)
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
