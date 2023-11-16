import domReady from '@roots/sage/client/dom-ready';
import gsap from 'gsap';

const mouse = {
    _pos: { x: 0, y: 0},
    _mouseElement: null,
    _mouseOuterElement: null,
    _updatePosition() {
        const scroll = $(window).scrollTop();
        const position = {
            x: Math.min(this._pos.x, $(window).width() - (this._mouseElement.width() / 2) - 1),
            y: Math.min(this._pos.y, $(window).height() - (this._mouseElement.height() / 2) - 1) + scroll,
        };
        
        const outerPosition = {
            x: Math.min(this._pos.x, $(window).width() - (this._mouseOuterElement.width() / 2) - 1),
            y: Math.min(this._pos.y, $(window).height() - (this._mouseOuterElement.height() / 2) - 1) + scroll,
        };
        
        this._mouseElement.css({
            left: Math.max(position.x, (this._mouseElement.width() / 2) + 1),
            top: Math.max(position.y, (this._mouseElement.height() / 2) + 1),
        });
        
        gsap.to(this._mouseOuterElement, {
            left: Math.max(outerPosition.x, (this._mouseOuterElement.width() / 2) + 1),
            top: Math.max(outerPosition.y, (this._mouseOuterElement.height() / 2) + 1),
            duration: 0.5,
            ease: 'ease-in'
        });
    },

    _onMouseMove(event) {
        this._pos.x = event.clientX;
        this._pos.y = event.clientY;

        this._updatePosition();
    },

    register() {
        this._mouseElement = $('.mouse').first();
        this._mouseOuterElement = $('.mouse-outer').first();

        $(document).on('mousemove', event => this._onMouseMove(event));
        $(document).on('scroll', event => this._updatePosition());
    }
};

export default mouse;