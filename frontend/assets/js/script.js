document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active'); // For styling the button itself (e.g., X icon)
        });
    }

    // --- Sticky Header on Scroll ---
    const header = document.querySelector('.main-header');
    if (header) {
        const headerHeight = header.offsetHeight; // Get header height for potential offset later
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Ensure it's a valid internal link and not just "#"
            if (hrefAttribute && hrefAttribute.length > 1 && document.querySelector(hrefAttribute)) {
                e.preventDefault();
                let targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    // Optional: Adjust for fixed header height if necessary
                    // const headerOffset = header ? header.offsetHeight : 0;
                    // const elementPosition = targetElement.getBoundingClientRect().top;
                    // const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // window.scrollTo({
                    //     top: offsetPosition,
                    //     behavior: "smooth"
                    // });

                    // Simpler scrollIntoView:
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Set Current Year in Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Navigation Link Highlighting ---
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const currentUrl = window.location.href;

    navLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add('active');
        }
        // Special case for "Trang chủ" on index.html without hash
        if ((window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) && link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        }
    });

    // --- Simple Animate on Scroll ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) { // Element comes 1/4 into view
                displayScrollElement(el);
            }
            // Optional: To hide elements again when they scroll out of view
            // else {
            //     hideScrollElement(el);
            // }
        });
    }

    if (scrollElements.length > 0) {
        // Initial check
        handleScrollAnimation();
        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });
    }

    // --- Newsletter Form Submission (Placeholder) ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert(`Cảm ơn bạn đã đăng ký với email: ${emailInput.value}! (Đây là chức năng demo)`);
                emailInput.value = ''; // Clear input
            }
        });
    }

  

}); // End DOMContentLoaded