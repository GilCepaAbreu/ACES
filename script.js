document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const interactables = document.querySelectorAll('[data-cursor="hover"], a, button, input, textarea');

    if (window.matchMedia("(any-pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth follow
        const render = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.transform = `translate(-50%, -50%) translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // Hover effect
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // Preloader and Initial Animation
    const tl = gsap.timeline();

    tl.to('.progress', { width: '100%', duration: 1.5, ease: 'power3.inOut' })
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
        .to('.hero-visual', { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }, '-=0.5')
        .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 }, '-=1')
        .from('.hero-title .word', { y: '100%', duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=1')
        .to('.hero-subtitle', { opacity: 1, duration: 1 }, '-=0.5')
        .to('.hero-actions', { opacity: 1, duration: 1 }, '-=0.5');

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    lenis.on('scroll', (e) => {
        if (e.scroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });



    // Services Interactive List Hover Effect
    const serviceItems = document.querySelectorAll('.service-item');
    const imgWraps = document.querySelectorAll('.services-images .img-wrap');

    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const index = item.getAttribute('data-id');

            // Remove active classes
            imgWraps.forEach(img => img.classList.remove('active'));

            // Add active class to corresponding image
            document.getElementById(`img-${index}`).classList.add('active');
        });
    });

    // Reveal Elements on Scroll
    const revealElements = document.querySelectorAll('.reveal-elem');
    revealElements.forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const obj = { val: 0 };

        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: counter,
                start: 'top 80%',
                once: true
            },
            onUpdate: () => {
                counter.innerText = Math.floor(obj.val);
            }
        });
    });

});
