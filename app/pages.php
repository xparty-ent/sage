<?php

/**
 * Theme pages.
 */

 function xp_template_redirects() {
    $post = get_post();

    if(!$post)
        return;

    switch($post->post_name) {
        case 'login':
            /*
            if(is_user_logged_in()) {
                wp_redirect(get_home_url());
                return;
            }
            */
            break;
    }
}

function xp_get_header() {
    echo view('sections.header');
}

function xp_get_footer() {
    echo view('sections.footer');
}

add_action('get_header', 'xp_get_header');
add_action('get_footer', 'xp_get_footer');
add_action('template_redirect', 'xp_template_redirects');