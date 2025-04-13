document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active'); // Toggle visibility of the nav
            mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            
            // Also toggle the navigation ul inside the mobile menu
            const navLinks = document.querySelector('.nav ul');
            if (navLinks) {
                navLinks.classList.toggle('active'); // This will show the menu on mobile
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                const navLinks = document.querySelector('.nav ul');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,  // Adjust to account for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
    
    // File upload interaction
    const fileUploads = document.querySelectorAll('.file-upload');
    fileUploads.forEach(upload => {
        const input = upload.querySelector('input[type="file"]');
        
        upload.addEventListener('click', function() {
            if (input) input.click();
        });
        
        if (input) {
            input.addEventListener('change', function() {
                if (this.files && this.files.length > 0) {
                    upload.querySelector('p').textContent = this.files[0].name;
                }
            });
        }
    });
    
    // Testimonial slider (simple version)
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length > 0) {
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        // Show first testimonial initially
        showTestimonial(0);
    }
});
