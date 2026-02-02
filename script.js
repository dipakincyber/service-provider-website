// Matrix Rain Background Effect
const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテト';
const fontSize = 14;
const columns = Math.floor(matrixCanvas.width / fontSize);
const drops = Array(columns).fill(0);

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixCtx.fillStyle = '#d4af37';
    matrixCtx.font = `${fontSize}px monospace`;
    matrixCtx.globalAlpha = 0.1;

    for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        matrixCtx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.95) {
            drops[i] = 0;
        }
        drops[i]++;
    }

    matrixCtx.globalAlpha = 1;
}

setInterval(drawMatrix, 50);

// Particle System
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.opacity = 1;
        this.size = Math.random() * 2 + 0.5;
        this.life = 300;
        this.maxLife = 300;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300) {
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * 0.2;
            this.vy += Math.sin(angle) * 0.2;
        }

        this.vx *= 0.99;
        this.vy *= 0.99;

        const maxVelocity = 10;
        const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (velocity > maxVelocity) {
            this.vx = (this.vx / velocity) * maxVelocity;
            this.vy = (this.vy / velocity) * maxVelocity;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.opacity = this.life / this.maxLife;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

let particles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (Math.random() > 0.8) {
        particles.push(new Particle(mouseX, mouseY));
    }
});

function animate() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(mouseX, mouseY);
        particles[i].draw(ctx);

        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // Draw connecting lines
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.globalAlpha = (1 - distance / 150) * 0.3;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // Glow effect
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;
    ctx.fillRect(mouseX - 200, mouseY - 200, 400, 400);

    requestAnimationFrame(animate);
}

animate();

// Raven particle trail
const raven = document.querySelector('.flying-raven');
setInterval(() => {
    if (raven && particles.length < 500) {
        const ravenRect = raven.getBoundingClientRect();
        particles.push(new Particle(
            ravenRect.left + ravenRect.width / 2,
            ravenRect.top + ravenRect.height / 2
        ));
    }
}, 100);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .tech-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Smooth navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Parallax effect
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    
    if (scrolled < window.innerHeight) {
        canvas.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
});

// Form submission
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.submit-button');
        const originalText = button.textContent;
        button.textContent = '➜ TRANSMITTED()';
        button.style.color = '#00ff00';
        
        form.reset();
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.color = '';
        }, 3000);
    });
}

// Cursor tech effect
const createTechCursor = () => {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 30px;
        height: 30px;
        border: 2px solid #d4af37;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: screen;
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    `;
    document.body.appendChild(cursor);

    const line1 = document.createElement('div');
    line1.style.cssText = `
        position: fixed;
        width: 50px;
        height: 1px;
        background: linear-gradient(to right, #d4af37, transparent);
        pointer-events: none;
        z-index: 10000;
    `;
    document.body.appendChild(line1);

    const line2 = document.createElement('div');
    line2.style.cssText = `
        position: fixed;
        width: 1px;
        height: 50px;
        background: linear-gradient(to bottom, #d4af37, transparent);
        pointer-events: none;
        z-index: 10000;
    `;
    document.body.appendChild(line2);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = (e.clientX - 15) + 'px';
        cursor.style.top = (e.clientY - 15) + 'px';
        line1.style.left = e.clientX + 'px';
        line1.style.top = e.clientY + 'px';
        line2.style.left = e.clientX + 'px';
        line2.style.top = e.clientY + 'px';
    });
};

createTechCursor();

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

// Typing effect for hero title
const typewriter = (element, speed = 100) => {
    const text = element.textContent;
    element.textContent = '';
    let index = 0;

    const type = () => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(type, speed);
        }
    };

    type();
};

// Tech stats counter
const countUp = (element) => {
    const target = parseFloat(element.innerText);
    const increment = target / 50;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = element.innerText;
            clearInterval(timer);
        } else {
            if (element.innerText.includes('+')) {
                element.innerText = Math.floor(current) + '+';
            } else if (element.innerText.includes('$')) {
                element.innerText = '$' + Math.floor(current) + 'M';
            } else if (element.innerText.includes('%')) {
                element.innerText = Math.floor(current) + '%';
            }
        }
    }, 30);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.terminal-line').forEach(line => {
    if (line.textContent.includes('250') || line.textContent.includes('98') || 
        line.textContent.includes('15') || line.textContent.includes('50')) {
        statsObserver.observe(line);
    }
});

// Animate progress bars on scroll
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target.querySelector('.progress-fill');
            if (fill) {
                const width = fill.style.width;
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = width;
                }, 10);
            }
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.feature-card').forEach(card => {
    progressObserver.observe(card);
});

// Enhanced scroll animations for new sections
document.querySelectorAll('.feature-card, .timeline-item, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// CTA button animations
document.querySelectorAll('.cta-primary, .cta-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.08)';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Enhanced cursor with trail
let trail = [];
const trailLength = 30;

document.addEventListener('mousemove', (e) => {
    trail.push({ x: e.clientX, y: e.clientY });
    if (trail.length > trailLength) {
        trail.shift();
    }
});

// Floating particles from CTA buttons
document.querySelectorAll('.cta-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(centerX, centerY));
        }
    });
});

// Keyboard interactions
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        const form = document.querySelector('.contact-form');
        if (form) form.dispatchEvent(new Event('submit'));
    }
});

// Smooth reveal animations on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add tilt effect to cards on mouse move
document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y / rect.height - 0.5) * 10;
        const rotateY = (x / rect.width - 0.5) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Glitch effect on section titles
document.querySelectorAll('.glitch').forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = '';
        }, 10);
    });
});
