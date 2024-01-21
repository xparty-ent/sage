import domReady from '@roots/sage/client/dom-ready';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

const animations = {
    _registerSmoothScroll() {
        const lenis = new Lenis();
        
        lenis.on('scroll', ScrollTrigger.update)
          
        gsap.ticker.add((time)=>{
            lenis.raf(time * 1000)
        });
          
        gsap.ticker.lagSmoothing(0)
    },
    
    register() {
        gsap.registerPlugin(ScrollTrigger);
        this._registerSmoothScroll();
    }
};

export default animations;