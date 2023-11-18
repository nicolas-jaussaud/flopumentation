## Usage

**Flopumentation** is a small library to create a documentation from markdown files. It is meant to be easy and fast to implement, and it does not rely on a build process.

### Copy scripts

To integrate **Flopumentation** into your project, you need to copy this two CSS and JavaScript files and include them in your project:
- [flopumentation.min.js](https://nicolas-jaussaud.github.io/flopumentation/build/flopumentation.min.js)
- [flopumentation.min.css](https://nicolas-jaussaud.github.io/flopumentation/build/flopumentation.min.css)

### Add your markdown file

Create a folder that will contain all your markdown files. In this example we will call it `/pages/` but it can be anything.

### Create index.html

You can then create a create an html file simlilar to this one:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="https://nicolas-jaussaud.github.io/flopumentation/build/flopumentation.min.css">
    <!-- highlight.js theme - can be changed or removed -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.css">
    <script src="https://nicolas-jaussaud.github.io/flopumentation/build/flopumentation.min.js"></script>
  </head>
  <body>
  <body>
    <script>
      flopumentation({
        title       : 'Flopumentation',
        initialPage : './pages/usage.md',
        sections    : [
          {
            title : 'Getting started',
            pages : [
              { 
                title   : 'Usage',
                content : './pages/usage.md'
              },
            ]
          }
        ]
      })
    </script>
  </body>
</html>
```

