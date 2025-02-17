document.addEventListener('DOMContentLoaded', function() {
    // Particles.js Configuration
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#A3FF47'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#A3FF47',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });

    // GSAP Animations
    gsap.from('.navbar', {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: 'power4.out'
    });

    gsap.from('.card', {
        duration: 0.8,
        scale: 0.5,
        opacity: 0,
        delay: 0.5,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.3)',
        y: 40
    });

    gsap.from('.sidebar', {
        duration: 1,
        x: -100,
        opacity: 0,
        ease: 'power4.out'
    });

    // Animate numbers in cards
    const cards = document.querySelectorAll('.card-value');
    cards.forEach(card => {
        const finalValue = parseInt(card.textContent);
        gsap.from(card, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            stagger: 1,
            delay: 1
        });
    });

    // Three.js Background Animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Set renderer properties
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#A3FF47',
        transparent: true,
        opacity: 0.5
    });

    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 2;

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Hover effects for cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            gsap.to(e.target, {
                scale: 1.05,
                duration: 0.3,
                boxShadow: '0 20px 30px rgba(163, 255, 71, 0.3)'
            });
        });
        
        card.addEventListener('mouseleave', (e) => {
            gsap.to(e.target, {
                scale: 1,
                duration: 0.3,
                boxShadow: '0 10px 20px rgba(163, 255, 71, 0.2)'
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        // Find the SRA button
        const sraButton = document.getElementById('sra-btn');
    
        // Add a click event listener
        if (sraButton) {
            sraButton.addEventListener('click', openSRA);
        } else {
            console.error("SRA button not found in DOM");
        }
    });

    function openSRA() {
        console.log("SRA button clicked"); // Debug log
        window.location.href = 'sra.html';
    }

    function closeModal() {
        const modal = document.querySelector('.sra-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// Add console log to check if script is running
console.log('Script loaded');
