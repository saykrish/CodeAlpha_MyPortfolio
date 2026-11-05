/* ==========================================================================
   DILEEP KUMAR - PORTFOLIO INTERACTIVE SCRIPTS
   Frontend Developer & UI/UX Designer | B.Tech CSE
   CodeAlpha Task 3: Build Your Own Portfolio Site
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------------
       1. 3-OPTION THEME SWITCHER (Dark | Light | Peach)
       --------------------------------------------------------- */
    const themeButtons = document.querySelectorAll('.theme-option-btn');
    const htmlElement = document.documentElement;

    // Retrieve saved theme or use system preference (default: dark)
    const savedTheme = localStorage.getItem('dileep-portfolio-theme');
    const validThemes = ['dark', 'light', 'peach'];
    
    let currentTheme = 'dark';
    if (savedTheme && validThemes.includes(savedTheme)) {
        currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        currentTheme = 'light';
    }

    // Apply initial theme
    applyTheme(currentTheme, false);

    // Event listener for theme buttons
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-theme-val');
            if (validThemes.includes(selectedTheme)) {
                applyTheme(selectedTheme, true);
            }
        });
    });

    function applyTheme(theme, notify = false) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('dileep-portfolio-theme', theme);

        // Update active class on buttons
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme-val') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (notify) {
            let message = "Switched to Dark Mode 🌙";
            if (theme === 'light') message = "Switched to Light Mode ☀️";
            if (theme === 'peach') message = "Switched to Peach Mode 🍑";
            showToast(message);
        }
    }


    /* ---------------------------------------------------------
       2. TYPEWRITER EFFECT IN HERO SECTION
       --------------------------------------------------------- */
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "Frontend Developer",
        "UI / UX Designer",
        "Web Developer",
        "C Programmer",
        "B.Tech CSE Student"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDelay = 1800;

    function typeEffect() {
        if (!typewriterElement) return;

        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }

    if (typewriterElement) {
        typeEffect();
    }


    /* ---------------------------------------------------------
       3. NAVBAR SCROLL EFFECT & MOBILE MENU
       --------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }


    /* ---------------------------------------------------------
       4. SCROLLSPY (Highlight active link while scrolling)
       --------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');

    function scrollSpy() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);


    /* ---------------------------------------------------------
       5. SKILL BARS PROGRESS ON SCROLL (Intersection Observer)
       --------------------------------------------------------- */
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.getPropertyValue('--target-width');
                if (targetWidth) {
                    bar.style.width = targetWidth;
                }
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.25 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });


    /* ---------------------------------------------------------
       6. PROJECTS FILTER (All, Web Dev, UI/UX, JS)
       --------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hide');
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    /* ---------------------------------------------------------
       7. COPY TO CLIPBOARD BUTTONS (Email)
       --------------------------------------------------------- */
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-copy');

            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--success);"></i>';
                    showToast(`Copied to clipboard: ${textToCopy}`);

                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                    }, 2000);
                }).catch(() => {
                    showToast(`Email: ${textToCopy}`);
                });
            }
        });
    });


    /* ---------------------------------------------------------
       8. CONTACT FORM VALIDATION & SUBMISSION
       --------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            // Name Validation
            if (!nameInput.value.trim()) {
                setError(nameInput, true);
                isValid = false;
            } else {
                setError(nameInput, false);
            }

            // Email Validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                setError(emailInput, true);
                isValid = false;
            } else {
                setError(emailInput, false);
            }

            // Subject Validation
            if (!subjectInput.value.trim()) {
                setError(subjectInput, true);
                isValid = false;
            } else {
                setError(subjectInput, false);
            }

            // Message Validation (at least 10 chars)
            if (messageInput.value.trim().length < 10) {
                setError(messageInput, true);
                isValid = false;
            } else {
                setError(messageInput, false);
            }

            if (isValid) {
                // UI feedback: Loading state
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

                // Simulate smooth transmission
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent Successfully!';
                    
                    showToast(`Thank you ${nameInput.value.trim()}! Dileep received your message.`);
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                    }, 3500);
                }, 1200);
            }
        });

        // Real-time error clearing
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.parentElement.parentElement.classList.contains('has-error')) {
                    setError(input, false);
                }
            });
        });
    }

    function setError(inputElement, hasError) {
        const group = inputElement.closest('.form-group');
        if (group) {
            if (hasError) {
                group.classList.add('has-error');
            } else {
                group.classList.remove('has-error');
            }
        }
    }


    /* ---------------------------------------------------------
       9. BACK TO TOP BUTTON
       --------------------------------------------------------- */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ---------------------------------------------------------
       10. DYNAMIC YEAR
       --------------------------------------------------------- */
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});


/* ---------------------------------------------------------
   GLOBAL HELPERS (Toast Notification & Project Demos)
   --------------------------------------------------------- */
let toastTimeout;

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
}

// Window helper for live preview buttons
window.showDemoToast = function(projectName) {
    showToast(`Opening preview for ${projectName} ✨`);
};
