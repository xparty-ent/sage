/**
 * Compiler configuration
 *
 * @see {@link https://roots.io/sage/docs sage documentation}
 * @see {@link https://bud.js.org/learn/config bud.js configuration guide}
 *
 * @param {import('@roots/bud').Bud} app
 */
export default async (app) => {
  /**
   * Apply production-only settings
   * 
   * @see {@link https://bud.js.org/reference/bud.when}
   */
  app.when(app.isProduction, 
    /**
     * Configure bud hash
     * 
     * @see {@link https://bud.js.org/reference/bud.hash}
     */
    () => app.hash(false),

    /**
     * Configure bud minification
     * 
     * @see {@link https://bud.js.org/reference/bud.minimize}
     */
    () => app.minimize(true),

    /**
     * Configure chunks splitting
     * 
     * @see {@link https://bud.js.org/reference/bud.splitChunks}
     */
    () => app.splitChunks(),

    /**
     * Setup image compression
     * 
     * @see {@link https://bud.js.org/extensions/bud-imagemin}
     */
    () => app.imagemin
      .encode(`png`, { quality: 100 })
      .addPreset(`webp`, {
        options: {
          encodeOptions: {
            webp: { quality: 100 },
          },
        },
      })
  );
  
  /**
   * Application assets & entrypoints
   *
   * @see {@link https://bud.js.org/reference/bud.entry}
   * @see {@link https://bud.js.org/reference/bud.assets}
   */
  app
    .entry({
      app: ['@scripts/app', '@styles/app'],
      editor: ['@scripts/editor', '@styles/editor'],
      animations: ['@scripts/animations', '@styles/animations/animations'],
      critical: ['@styles/critical'],
      home: ['@scripts/home', '@styles/home/home']
    })
    .assets(['images', 'fonts'])
    .provide({
      jquery: ["jQuery", "$"],
    });

  /**
   * Setup image compression
   * 
   * @see {@link https://bud.js.org/extensions/bud-imagemin}
   */
  app.when(app.isProduction, 
    () => app.imagemin
      .encode(`png`, { quality: 100 })
      .addPreset(`webp`, {
        options: {
          encodeOptions: {
            webp: { quality: 100 },
          },
        },
      })
  );
  
  /**
   * Enable bud sourcemaps
   * 
   * @see {@link https://bud.js.org/reference/bud.devtool}
   */
  //app.devtool('source-map');

  /**
   * Set public path
   *
   * @see {@link https://bud.js.org/reference/bud.setPublicPath}
   */
  app.setPublicPath('/app/themes/xp-theme/public/');

  /**
   * Development server settings
   *
   * @see {@link https://bud.js.org/reference/bud.setUrl}
   * @see {@link https://bud.js.org/reference/bud.setProxyUrl}
   * @see {@link https://bud.js.org/reference/bud.watch}
   */
  app.when(app.isDevelopment, 
    () => app.setUrl('http://localhost:3000'),
    () => app.setPublicUrl('http://localhost:3000'),
    () => app.setProxyUrl('http://localhost'),
    () => app.serve('http://localhost:3000'),
    () => app.warn([
      'resources/views', 
      'app'
    ])
  );


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
      },
      {
        color: "#bdbdbd",
        name: "Contrast",
        slug: "contrast"
      }
    ])

    .set('settings.typography.fontFamilies', [
      {
        fontFamily: "comfortoaa",
        name: 'Comfortoaa',
        slug: 'comfortoaa',
        fontFace: [{
          fontFamily: "comfortoaa",
          fontDisplay: "swap",
          src: ["file:./public/fonts/comfortoaa.ttf"],
       }],
      },
      {
        fontFamily: "sofiapro",
        name: 'Sofia Pro',
        slug: 'sofiapro',
        fontFace: [{
          fontFamily: "sofiapro",
          fontDisplay: "swap",
          src: ["file:./public/fonts/sofiapro.otf"],
       }],
      },
      {
        fontFamily: "tstar",
        name: 'TStar',
        slug: 'tstar',
        fontFace: [{
          fontFamily: "tstar",
          fontDisplay: "swap",
          src: ["file:./public/fonts/tstar.otf"],
       }],
      },
      {
        fontFamily: "ptmono",
        name: 'PT Mono',
        slug: 'ptmono',
        fontFace: [{
          fontFamily: "ptmono",
          fontDisplay: "swap",
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
