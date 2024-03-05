<?php

/**
 * Theme filters.
 */

namespace App;

/**
 * Add "… Continued" to the excerpt.
 *
 * @return string
 */
add_filter('excerpt_more', function () {
    return sprintf(' &hellip; <a href="%s">%s</a>', get_permalink(), __('Continued', 'sage'));
});

/**
 * Disables the block editor from managing the widget system
 */
add_filter('gutenberg_use_widgets_block_editor', '__return_false');
add_filter( 'use_widgets_block_editor', '__return_false' );