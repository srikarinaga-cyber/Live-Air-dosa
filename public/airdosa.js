// Main Interactive Functionality
        const __airDosaInit = () => {
            
            // Theme switcher persistent state handler
            const themeToggleBtn = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            
            // Sync with local storage preferences
            const savedTheme = localStorage.getItem('theme') || 'dark';
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                themeIcon.className = 'fa-solid fa-moon';
            } else {
                themeIcon.className = 'fa-solid fa-sun';
            }
            
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', () => {
                    document.body.classList.toggle('light-theme');
                    const isLight = document.body.classList.contains('light-theme');
                    
                    if (isLight) {
                        themeIcon.className = 'fa-solid fa-moon';
                        localStorage.setItem('theme', 'light');
                    } else {
                        themeIcon.className = 'fa-solid fa-sun';
                        localStorage.setItem('theme', 'dark');
                    }
                });
            }

            // Increment served count naturally
            const servedCount = document.getElementById('doses-served');
            if (servedCount) {
                let startCount = 14892;
                setInterval(() => {
                    startCount += Math.floor(Math.random() * 2) + 1;
                    servedCount.textContent = startCount.toLocaleString();
                }, 4000);
            }

            // Mobile menu toggle
            const menuToggle = document.getElementById('menu-toggle');
            const navLinks = document.getElementById('nav-links');
            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                    const icon = menuToggle.querySelector('i');
                    if (navLinks.classList.contains('active')) {
                        icon.className = 'fa-solid fa-xmark';
                    } else {
                        icon.className = 'fa-solid fa-bars';
                    }
                });

                // Close nav menu on link clicks
                navLinks.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        navLinks.classList.remove('active');
                        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
                    });
                });
            }

            // Header shrink scroll effect
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // Reveal scroll animations (Intersection Observer)
            const revealElements = document.querySelectorAll('.reveal');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => observer.observe(el));
            
            // Customizer Live Calculations
            const batterBtns = document.querySelectorAll('.batter-btn');
            const gheeSlider = document.getElementById('ghee-slider');
            const gheeVal = document.getElementById('ghee-val');
            const spiceSlider = document.getElementById('spice-slider');
            const spiceVal = document.getElementById('spice-val');
            
            const checkPodi = document.getElementById('fill-podi');
            const checkCheese = document.getElementById('fill-cheese');
            const checkAloo = document.getElementById('fill-aloo');

            // Interactive elements mapping
            const podiSvg = document.getElementById('podi-svg');
            const cheeseSvg = document.getElementById('cheese-svg');
            const dosaGlow = document.getElementById('dosa-glow');

            // Output targets
            const calcCalories = document.getElementById('calc-calories');
            const calcCrisp = document.getElementById('calc-crisp');
            const calcPrice = document.getElementById('calc-price');

            // Form dynamic data state
            let currentBatter = 'classic';
            let batterCalories = 240;
            let batterCrisp = '85%';

            const spiceLevels = ['Mild', 'Techie (Medium)', 'Firewall (Spicy)', 'Riot (Indian Hot)'];

            function updateCustomizerOutput() {
                // Read states
                const gheeValue = parseInt(gheeSlider.value);
                const spiceIndex = parseInt(spiceSlider.value);
                
                gheeVal.textContent = gheeValue + '%';
                spiceVal.textContent = spiceLevels[spiceIndex];

                // Checkboxes
                let additionalPrice = 0;
                let additionalCalories = 0;
                let activeFillings = [];

                if (checkPodi.checked) {
                    podiSvg.classList.add('visible');
                    additionalPrice += parseInt(checkPodi.dataset.price);
                    additionalCalories += parseInt(checkPodi.dataset.calories);
                    activeFillings.push('Gunpowder Podi');
                } else {
                    podiSvg.classList.remove('visible');
                }

                if (checkCheese.checked) {
                    cheeseSvg.classList.add('visible');
                    additionalPrice += parseInt(checkCheese.dataset.price);
                    additionalCalories += parseInt(checkCheese.dataset.calories);
                    activeFillings.push('Mozzarella');
                } else {
                    cheeseSvg.classList.remove('visible');
                }

                if (checkAloo.checked) {
                    additionalPrice += parseInt(checkAloo.dataset.price);
                    additionalCalories += parseInt(checkAloo.dataset.calories);
                    activeFillings.push('Aloo Masala');
                }

                if (activeFillings.length === 0) {
                    activeFillings.push('None');
                }

                // Crunch Calculations
                // Ghee levels above 80% reduce crispness slightly, Rava is always crisper
                let customCrisp = parseInt(batterCrisp);
                if (gheeValue > 85) {
                    customCrisp -= Math.round((gheeValue - 85) / 2);
                } else if (gheeValue < 20) {
                    customCrisp -= 10; // dry batter loses structural crisp
                }
                
                // Ghee glow intensity
                const opacityGlow = 0.1 + (gheeValue / 200);
                dosaGlow.style.opacity = opacityGlow;

                // Calories
                const totalCalories = batterCalories + additionalCalories + Math.round(gheeValue * 1.5);
                // Fare
                const baseFare = 79;
                const totalFare = baseFare + additionalPrice + Math.round(gheeValue * 0.25);

                // Update text fields
                calcCalories.textContent = totalCalories + ' kcal';
                calcCrisp.textContent = customCrisp + '%';
                calcPrice.textContent = 'â‚¹' + totalFare;

                // Sync modal details implicitly
                document.getElementById('modal-batter-val').textContent = document.querySelector('.batter-btn.active span').textContent;
                document.getElementById('modal-ghee-val').textContent = gheeValue + '% (Coeff)';
                document.getElementById('modal-fillings-val').textContent = activeFillings.join(', ');
                document.getElementById('modal-price-val').textContent = 'â‚¹' + totalFare;
            }

            // Customizer Event Listeners
            batterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    batterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    currentBatter = btn.dataset.batter;
                    batterCalories = parseInt(btn.dataset.calories);
                    batterCrisp = btn.dataset.crisp;
                    
                    updateCustomizerOutput();
                });
            });

            gheeSlider.addEventListener('input', updateCustomizerOutput);
            spiceSlider.addEventListener('input', updateCustomizerOutput);
            checkPodi.addEventListener('change', updateCustomizerOutput);
            checkCheese.addEventListener('change', updateCustomizerOutput);
            checkAloo.addEventListener('change', updateCustomizerOutput);

            // Initialize customizer
            updateCustomizerOutput();

            // Toggle Pricing Plan Switcher
            const pricingToggle = document.getElementById('pricing-toggle');
            const priceClassic = document.getElementById('price-classic');
            const pricePremium = document.getElementById('price-premium');
            const labelMonthly = document.getElementById('label-monthly');
            const labelAnnual = document.getElementById('label-annual');

            if (pricingToggle) {
                pricingToggle.addEventListener('change', () => {
                    if (pricingToggle.checked) {
                        // Switch to Monthly passes with active toggle
                        priceClassic.textContent = '799';
                        pricePremium.textContent = '399'; // discounted price
                        
                        document.querySelectorAll('.pricing-card:not(.premium) .period').forEach(p => p.textContent = '/ month');
                        document.querySelectorAll('.pricing-card.premium .period').forEach(p => p.textContent = '/ month (Promo)');
                        
                        labelMonthly.classList.remove('active');
                        labelAnnual.classList.add('active');
                    } else {
                        // Pay per flight rates
                        priceClassic.textContent = '99';
                        pricePremium.textContent = '499';
                        
                        document.querySelectorAll('.pricing-card:not(.premium) .period').forEach(p => p.textContent = '/ flight');
                        document.querySelectorAll('.pricing-card.premium .period').forEach(p => p.textContent = '/ month');

                        labelMonthly.classList.add('active');
                        labelAnnual.classList.remove('active');
                    }
                });
            }

            // Accordion FAQs
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close others
                    faqItems.forEach(i => {
                        i.classList.remove('active');
                        i.querySelector('.faq-answer').style.maxHeight = null;
                    });

                    if (!isActive) {
                        item.classList.add('active');
                        const answer = item.querySelector('.faq-answer');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', __airDosaInit);
        } else {
            __airDosaInit();
        }

        // Modal triggers
        const modalOverlay = document.getElementById('checkout-modal');
        const summaryView = document.getElementById('checkout-summary-view');
        const flightView = document.getElementById('checkout-flight-view');

        function openModal() {
            modalOverlay.classList.add('active');
            summaryView.style.display = 'block';
            flightView.style.display = 'none';
        }

        function openModalWithDetails() {
            openModal();
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            // reset flight simulator values if running
            stopFlightSimulation();
        }

        let simInterval = null;

        function startFlightSimulation() {
            // Swap views in modal
            summaryView.style.display = 'none';
            flightView.style.display = 'flex';

            const statusText = document.getElementById('flight-status-text');
            const drone = document.getElementById('sim-drone');
            const pathActive = document.getElementById('flight-path-active');

            const altVal = document.getElementById('sim-alt');
            const tempVal = document.getElementById('sim-temp');
            const speedVal = document.getElementById('sim-speed');

            // Trigger CSS animated map progress
            pathActive.style.strokeDashoffset = '0';
            
            // Position coordinates of simulated curve
            // Launch Node: Left: 20%, Top: 70%
            // Des Node: Left: 80%, Top: 30%
            // We animate the drone along a bezier-like linear interpolation
            let progress = 0;
            statusText.textContent = "Launching drone from Bengaluru vertical pad...";
            
            // Sounds or vibrations could happen here
            
            simInterval = setInterval(() => {
                progress += 2.5; // percent progress

                if (progress > 100) {
                    progress = 100;
                    clearInterval(simInterval);
                    statusText.textContent = "Hovering for plate release... Precision dropped! Dosa arrived crisp!";
                    drone.className = "fa-solid fa-circle-check flight-drone-icon";
                    drone.style.color = "var(--accent-green)";
                    drone.style.fontSize = "26px";
                    
                    altVal.textContent = "0m";
                    tempVal.textContent = "72°C";
                    speedVal.textContent = "0 km/h";
                    
                    setTimeout(() => {
                        alert("Bake Completed! Check your imaginary doorstep for a golden, steaming crispy dosa!");
                        closeModal();
                    }, 1200);
                    return;
                }

                // Calculate curved coordinate positioning for map animation
                const startX = 20; // %
                const endX = 80; // %
                const currentX = startX + (endX - startX) * (progress / 100);

                // Quadratic Bezier curve interpolation: y = (1-t)^2 * y0 + 2(1-t)t * y1 + t^2 * y2
                const t = progress / 100;
                const y0 = 70; // start y %
                const y1 = -10; // peak height control y %
                const y2 = 30; // target y %
                const currentY = Math.round((1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2);

                drone.style.left = currentX + '%';
                drone.style.top = currentY + '%';

                // Rotate drone based on slope
                const angle = -35 + (progress * 0.7);
                drone.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

                // Dynamic telemetry updates
                let alt = 0;
                let temp = 25;
                let speed = 0;

                if (progress < 15) {
                    alt = Math.round((progress / 15) * 45);
                    temp = 25 + Math.round((progress / 15) * 110);
                    speed = Math.round((progress / 15) * 85);
                    statusText.textContent = "Ascending to commercial flight corridor (45m)...";
                } else if (progress >= 15 && progress < 80) {
                    alt = 45;
                    temp = 135 + Math.round(((progress - 15) / 65) * 69); // cook up to 204C
                    speed = 120;
                    statusText.textContent = "Cruising... In-flight induction baking in full progress!";
                } else {
                    alt = Math.round(45 - ((progress - 80) / 20) * 45);
                    temp = 204 - Math.round(((progress - 80) / 20) * 132); // cooling slightly to perfect serving temp
                    speed = Math.round(120 - ((progress - 80) / 20) * 120);
                    statusText.textContent = "Locked onto balcony signal. Deploying altitude deceleration...";
                }

                altVal.textContent = alt + "m";
                tempVal.textContent = temp + "°C";
                speedVal.textContent = speed + " km/h";
            }, 100);
        }

        function stopFlightSimulation() {
            if (simInterval) {
                clearInterval(simInterval);
                simInterval = null;
            }
            
            // Reset active drone classes
            const drone = document.getElementById('sim-drone');
            if (drone) {
                drone.className = "fa-solid fa-helicopter flight-drone-icon";
                drone.style.left = '20%';
                drone.style.top = '70%';
                drone.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                drone.style.color = '';
                drone.style.fontSize = '';
            }

            const pathActive = document.getElementById('flight-path-active');
            if (pathActive) {
                pathActive.style.strokeDashoffset = '200';
            }

            document.getElementById('sim-alt').textContent = "0m";
            document.getElementById('sim-temp').textContent = "25°C";
            document.getElementById('sim-speed').textContent = "0 km/h";
        }
