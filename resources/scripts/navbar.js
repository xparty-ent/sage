
const navbar = {
    register: () => {
        const toggle = $('.mobile-menu-toggle');
        const nav = $('nav.nav-primary');

        toggle.on('click', (e) => {
            e.preventDefault();
            toggle.toggleClass('active');
            nav.toggleClass('active');
        });
    }
};

domReady(() => {
    navbar.register();
});

window.navbar = navbar;