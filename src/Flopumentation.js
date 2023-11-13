import hljs from 'highlight.js';
import Page from './Page'

class Flopumentation {
  
  constructor(config) {

    this.page = new Page(config)
    this.config = config
    
    document.addEventListener('DOMContentLoaded', () => {
      this.page.generateDOM()
      this.initListener()
      this.loadPage(this.config.initialPage ?? '')
    })

    this.initListener.bind(this)
    this.loadPage.bind(this)
  }

  initListener = () => {
    const pages = this.page.getMenuItems()
    pages.forEach(item => {
      item.addEventListener('click', event => {
        this.loadPage( event.target.getAttribute('href').substring(1) )
      })
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
        this.page.element.main.classList.remove('fade')
        setTimeout(() => this.page.toggleLoading(false), 1000)
      })
  }

}

export default Flopumentation
