const {tailwind: sage} = require('@roots/sage');

sage
  .entry('app', ['scripts/app.js', 'styles/app.scss'])
  .entry('editor', ['scripts/editor.js', 'styles/editor.scss'])
  .entry('customizer', ['scripts/customizer.js'])
  .run();
