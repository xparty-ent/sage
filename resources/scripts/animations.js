import domReady from '@roots/sage/client/dom-ready';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

const animations = {
    _registerParallax() {
        $('.wp-block-cover.parallax img').each((i, elem) => {
            const element = $(elem);
            const position = element.css('object-position').replace('%', '');
            const positionY = parseInt(position.indexOf(' ') >= 0 ? position.split(' ')[1] : '0');
            const positionX = parseInt(position.indexOf(' ') >= 0 ? position.split(' ')[0] : position);

            const state = {
                y: positionY
            };


            gsap.fromTo(state, {
                y: () => i ? positionY - 20 : positionY
              }, {
                y: () => positionY + 20,
                ease: "none",
                scrollTrigger: {
                  trigger: element,
                  start: () => i ? "top bottom" : "top top", 
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true // to make it responsive
                },
                onUpdate: () => {
                    const pos = `${positionX}% ${state.y}%`;
                    element.css('object-position', pos);
                    console.log(element, pos);
                }
              });

            console.log(state.y);
        });
    },
    
    register() {
        gsap.registerPlugin(ScrollTrigger);
        this._registerParallax();
    }
};

export default animations;