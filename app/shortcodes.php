<?php 

function menu_shortcode($atts, $content = null) {
    extract(
        shortcode_atts(
            array('name' => null, 'class' => null), 
            $atts
        )
    );

    return wp_nav_menu(array('menu' => $name, 'menu_class' => 'myclass', 'echo' => false));
}

add_shortcode('menu', 'menu_shortcode');    