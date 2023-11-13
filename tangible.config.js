module.exports = {
  build: [
    {
      src: './src/index.js',
      dest: './docs/build/flopumentation.min.js',
      watch: './src/**',
    },
    {
      src: './src/index.scss',
      dest: './docs/build/flopumentation.min.css',
      watch: './src/**',
    },
  ],
  serve: {
    dir: '.',
    port: 4343
  }
}
