module.exports = {
  build: [
    {
      src: './src/scripts/index.js',
      dest: './docs/build/flopumentation.min.js',
      watch: './src/**',
    },
    {
      src: './src/styles/index.scss',
      dest: './docs/build/flopumentation.min.css',
      watch: './src/**',
    },
  ],
  serve: {
    dir: '.',
    port: 4343
  }
}
