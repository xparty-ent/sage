/**
 * Compiler configuration
 *
 * @see {@link https://roots.io/docs/sage sage documentation}
 * @see {@link https://bud.js.org/guides/configure bud.js configuration guide}
 *
 * @param {import('@roots/bud').Bud} app
 */
export default async (app) => {
  /**
   * Configure bud hash
   * 
   * @see {@link https://bud.js.org/reference/bud.hash}
   */
  app.hash(false);
  
  /**
   * Configure bud minification
   * 
   * @see {@link https://bud.js.org/reference/bud.minimize}
   */
  app.minimize(true);

  /**
   * Configure chunks splitting
   * 
   * @see {@link https://bud.js.org/reference/bud.splitChunks}
   */
  app.splitChunks();


  /**
   * Configure the runtime settings
   * 
   * @see {@link https://bud.js.org/learn/config/optimization}
   */
  app.runtime();

  /**
   * Application assets & entrypoints
   *
   * @see {@link https://bud.js.org/docs/bud.entry}
   * @see {@link https://bud.js.org/docs/bud.assets}
   */
  app
    .entry('app', ['@scripts/app', '@styles/app'])
    .entry('editor', ['@scripts/editor', '@styles/editor'])
    .entry('xp', ['@scripts/xp'])
    .entry('scroll', ['@scripts/scroll'])
    .entry('mouse', ['@scripts/mouse'])
    .entry('navbar', ['@scripts/navbar'])
    .assets(['images', 'models', 'fonts'])
    .provide({
      jquery: ["jQuery", "$"],
    });
  
  /**
   * Enable bud sourcemaps
   * 
   * @see {@link https://bud.js.org/reference/bud.devtool}
   */
  //app.devtool('source-map');

  /**
   * Set public path
   *
   * @see {@link https://bud.js.org/docs/bud.setPublicPath}
   */
  app.setPublicPath('/app/themes/xp-theme/public/');

  /**
   * Development server settings
   *
   * @see {@link https://bud.js.org/docs/bud.setUrl}
   * @see {@link https://bud.js.org/docs/bud.setProxyUrl}
   * @see {@link https://bud.js.org/docs/bud.watch}
   */
  app
    .setUrl('http://localhost:80')
    .setProxyUrl('http://example.test')
    .watch(['resources/views', 'app']);


  /**
   * Generate WordPress `theme.json`
   *
   * @note This overwrites `theme.json` on every build.
   *
   * @see {@link https://bud.js.org/extensions/sage/theme.json}
   * @see {@link https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json}
   */
  app.wpjson
    .set('settings.color.custom', true)
    .set('settings.color.customDuotone', true)
    .set('settings.color.customGradient', true)
    .set('settings.color.defaultDuotone', true)
    .set('settings.color.defaultGradients', true)
    .set('settings.color.defaultPalette', true)
  
    .set('settings.appearanceTools', true)
    .set('settings.color.palette', [
      {
        color: '#e0e0e0',
        name: 'Base',
        slug: 'base'
      },
      {
        color: '#212121',
        name: 'Accent',
        slug: 'accent'
      }
    ])

    .set('settings.typography.fontFamilies', [
      {
        fontFamily: "comfortoaa",
        name: 'Comfortoaa',
        slug: 'comfortoaa',
        fontFace: [{
          fontFamily: "comfortoaa",
          src: ["file:./public/fonts/comfortoaa.ttf"],
       }],
      },
      {
        fontFamily: "sofiapro",
        name: 'Sofia Pro',
        slug: 'sofiapro',
        fontFace: [{
          fontFamily: "sofiapro",
          src: ["file:./public/fonts/sofiapro.otf"],
       }],
      },
      {
        fontFamily: "tstar",
        name: 'TStar',
        slug: 'tstar',
        fontFace: [{
          fontFamily: "tstar",
          src: ["file:./public/fonts/tstar.otf"],
       }],
      },
      {
        fontFamily: "ptmono",
        name: 'PT Mono',
        slug: 'ptmono',
        fontFace: [{
          fontFamily: "ptmono",
          src: ["file:./public/fonts/ptmono.ttf"],
       }],
      }
    ])


    .set('settings.color.duotone', [])
    .set('settings.custom.spacing', {})
    .set('settings.custom.typography.font-size', {})
    .set('settings.custom.typography.line-height', {})
    .set('settings.spacing.padding', true)
    .set('settings.spacing.units', ['px', '%', 'em', 'rem', 'vw', 'vh'])
    .set('settings.typography.customFontSize', false)
    .enable();
};
