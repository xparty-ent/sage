import domReady from '@roots/sage/client/dom-ready';
import gsap from 'gsap';

const mouse = {
    register: () => {
        const mouseElement = $('.mouse').first();
        const mouseOuterElement = $('.mouse-outer').first();

        $(document).on('mousemove', event => {
            const scroll = $(window).scrollTop();
            const position = {
                x: Math.min(event.clientX, $(window).width() - (mouseElement.width() / 2) - 1),
                y: Math.min(event.clientY + scroll, $(window).height() - (mouseElement.height() / 2) - 1),
            };

            const outerPosition = {
                x: Math.min(event.clientX, $(window).width() - (mouseOuterElement.width() / 2) - 1),
                y: Math.min(event.clientY + scroll, $(window).height() - (mouseOuterElement.height() / 2) - 1),
            }

            mouseElement.css({
                left: Math.max(position.x, (mouseElement.width() / 2) + 1),
                top: Math.max(position.y, (mouseElement.height() / 2) + 1),
            });

            gsap.to(mouseOuterElement, {
                left: Math.max(outerPosition.x, (mouseOuterElement.width() / 2) + 1),
                top: Math.max(outerPosition.y, (mouseOuterElement.height() / 2) + 1),
                duration: 0.5,
                ease: 'ease-in'
            });
        });
    }
};

domReady(() => {
    mouse.register();
});

window.mouse = mouse;