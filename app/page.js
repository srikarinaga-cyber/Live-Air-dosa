"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Drone,
  Menu,
  X,
  Sun,
  Moon,
  Zap,
  Play,
  Sliders,
  Sparkles,
  Flame,
  Check,
  ChevronDown,
  ArrowRight,
  Cpu,
  Satellite,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Thermometer,
  Gauge,
  MapPin,
  Send,
  Compass,
  ArrowUpRight,
  Leaf
} from 'lucide-react';

export default function Page() {
  // Theme state
  const [theme, setTheme] = useState('dark');

  // Interactive menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stats served state
  const [dosasServed, setDosasServed] = useState(14892);

  // Customizer state
  const [batterType, setBatterType] = useState('classic'); // 'classic', 'rava', 'ragi'
  const [gheeValue, setGheeValue] = useState(60);
  const [spiceLevel, setSpiceLevel] = useState(1); // 0 = Mild, 1 = Techie, 2 = Firewall, 3 = Riot
  const [podiChecked, setPodiChecked] = useState(false);
  const [cheeseChecked, setCheeseChecked] = useState(false);
  const [alooChecked, setAlooChecked] = useState(true);

  // Pricing state
  const [pricingPeriod, setPricingPeriod] = useState('flight'); // 'flight', 'monthly'

  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);

  // Modal checkout state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1 = Summary, 2 = Flight Tracker

  // Flight simulation telemetry state
  const [simProgress, setSimProgress] = useState(0);
  const [simStatusText, setSimStatusText] = useState('Calibrating drone launch parameters...');
  const [simDroneStyle, setSimDroneStyle] = useState({ left: '20%', top: '70%', transform: 'translate(-50%, -50%) rotate(0deg)' });
  const [simAltitude, setSimAltitude] = useState(0);
  const [simHearthTemp, setSimHearthTemp] = useState(25);
  const [simSpeed, setSimSpeed] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);

  const simIntervalRef = useRef(null);

  // Scroll Header state
  const [isScrolled, setIsScrolled] = useState(false);

  // Sync theme with local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  // Synchronize Scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reveal Animations on Scroll
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
    };
  }, []);

  // Natural counter increments
  useEffect(() => {
    const counterTimer = setInterval(() => {
      setDosasServed((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 4000);
    return () => clearInterval(counterTimer);
  }, []);

  // Customizer Calcs
  const spiceLevels = ['Mild', 'Techie (Medium)', 'Firewall (Spicy)', 'Riot (Indian Hot)'];
  const batterNameMap = {
    classic: 'Classic Masala',
    rava: 'Crispy Rava',
    ragi: 'Organic Ragi'
  };

  const getBatterSpecs = () => {
    switch (batterType) {
      case 'rava':
        return { calories: 290, crisp: 98 };
      case 'ragi':
        return { calories: 190, crisp: 75 };
      case 'classic':
      default:
        return { calories: 240, crisp: 85 };
    }
  };

  const batterSpecs = getBatterSpecs();
  const additionalPrice = (podiChecked ? 20 : 0) + (cheeseChecked ? 35 : 0) + (alooChecked ? 15 : 0);
  const additionalCalories = (podiChecked ? 45 : 0) + (cheeseChecked ? 110 : 0) + (alooChecked ? 80 : 0);

  const totalCalories = batterSpecs.calories + additionalCalories + Math.round(gheeValue * 1.5);
  const totalPrice = 79 + additionalPrice + Math.round(gheeValue * 0.25);

  let calculatedCrisp = batterSpecs.crisp;
  if (gheeValue > 85) {
    calculatedCrisp -= Math.round((gheeValue - 85) / 2);
  } else if (gheeValue < 20) {
    calculatedCrisp -= 10;
  }

  const activeFillings = [];
  if (podiChecked) activeFillings.push('Gunpowder Podi');
  if (cheeseChecked) activeFillings.push('Mozzarella');
  if (alooChecked) activeFillings.push('Aloo Masala');
  if (activeFillings.length === 0) activeFillings.push('None');

  const opacityGlow = 0.1 + gheeValue / 200;

  // Simulator controls
  const openModal = () => {
    setIsModalOpen(true);
    setModalStep(1);
    setSimProgress(0);
    setSimCompleted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    stopFlightSimulation();
  };

  const startFlightSimulation = () => {
    setModalStep(2);
    setSimProgress(0);
    setSimCompleted(false);

    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
    }

    let progress = 0;
    setSimStatusText('Launching drone from Bengaluru vertical pad...');

    simIntervalRef.current = setInterval(() => {
      progress += 2.5;
      setSimProgress(progress);

      if (progress >= 100) {
        setSimProgress(100);
        clearInterval(simIntervalRef.current);
        setSimStatusText('Hovering for plate release... Precision dropped! Dosa arrived crisp!');
        setSimCompleted(true);
        setSimAltitude(0);
        setSimHearthTemp(72);
        setSimSpeed(0);

        setTimeout(() => {
          alert('Bake Completed! Check your imaginary doorstep for a golden, steaming crispy dosa!');
          setIsModalOpen(false);
        }, 1200);
        return;
      }

      // Calculate path coords
      const startX = 20;
      const endX = 80;
      const currentX = startX + (endX - startX) * (progress / 100);

      const t = progress / 100;
      const y0 = 70;
      const y1 = -10;
      const y2 = 30;
      const currentY = Math.round((1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2);

      const angle = -35 + progress * 0.7;

      setSimDroneStyle({
        left: `${currentX}%`,
        top: `${currentY}%`,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`
      });

      // Telemetry dynamics
      let alt = 0;
      let temp = 25;
      let speed = 0;

      if (progress < 15) {
        alt = Math.round((progress / 15) * 45);
        temp = 25 + Math.round((progress / 15) * 110);
        speed = Math.round((progress / 15) * 85);
        setSimStatusText('Ascending to commercial flight corridor (45m)...');
      } else if (progress >= 15 && progress < 80) {
        alt = 45;
        temp = 135 + Math.round(((progress - 15) / 65) * 69);
        speed = 120;
        setSimStatusText('Cruising... In-flight induction baking in full progress!');
      } else {
        alt = Math.round(45 - ((progress - 80) / 20) * 45);
        temp = 204 - Math.round(((progress - 80) / 20) * 132);
        speed = Math.round(120 - ((progress - 80) / 20) * 120);
        setSimStatusText('Locked onto balcony signal. Deploying altitude deceleration...');
      }

      setSimAltitude(alt);
      setSimHearthTemp(temp);
      setSimSpeed(speed);
    }, 100);
  };

  const stopFlightSimulation = () => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  };

  return (
    <>
      {/* Ambient glows */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Floating Order Now Button */}
      <button className="floating-order-btn" onClick={openModal} aria-label="Order Now">
        <Send style={{ width: '28px', height: '28px' }} />
        <span className="tooltip">Order Instant Dosa</span>
      </button>

      {/* Header / Navigation */}
      <header id="header" className={isScrolled ? 'scrolled' : ''}>
        <div className="container nav-wrapper">
          <a href="#" className="logo">
            <Drone style={{ animation: 'spin-pulse 3s linear infinite' }} />
            AirDosa
          </a>
          <button
            className="menu-toggle"
            id="menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ display: 'block' }} // Keep toggle available for responsive view states
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links">
            <li><a href="#features" onClick={() => setIsMobileMenuOpen(false)}>AI Features</a></li>
            <li><a href="#swarm" onClick={() => setIsMobileMenuOpen(false)}>Multi-Agent Swarm</a></li>
            <li><a href="#customizer" onClick={() => setIsMobileMenuOpen(false)}>Dosa Lab</a></li>
            <li><a href="#tech" onClick={() => setIsMobileMenuOpen(false)}>Flight Tech</a></li>
            <li><a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Sub-plans</a></li>
            <li><a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a></li>
            <li><button className="nav-btn" onClick={openModal}>Order Flight</button></li>
            <li>
              <button id="theme-toggle" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun id="theme-icon" /> : <Moon id="theme-icon" />}
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap style={{ color: 'var(--accent-green)', width: '14px', height: '14px' }} /> Bengaluru Hub Active (32 Drones Airborne)
            </div>
            <h1 className="hero-title">
              From Batter to Plate in <span>180 Seconds.</span>
            </h1>
            <p className="hero-tagline">
              The ultimate convergence of ancient recipe and aerospace automation. Perfectly baked at 200°C mid-air and precision-dropped by supersonic AI-powered drones.
            </p>
            <div className="hero-ctas">
              <a href="#customizer" className="btn-primary">
                Bake In-Flight <ArrowRight style={{ width: '18px', height: '18px' }} />
              </a>
              <a href="#tech" className="btn-secondary">
                How it bakes <Cpu style={{ width: '18px', height: '18px' }} />
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-val" id="doses-served">{dosasServed.toLocaleString()}</span>
                <span className="stat-lbl">Dosas Delivered Today</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">2.8 min</span>
                <span className="stat-lbl">Average Flight ETA</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">100%</span>
                <span className="stat-lbl">Crunch Index</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="drone-container">
              <img src="/airdosa_hero.png" alt="Futuristic AirDosa Delivery Drone Art" className="drone-image" />
              
              <div className="floating-badge badge-1">
                <Flame style={{ color: 'var(--primary-light)', width: '24px', height: '24px' }} />
                <div className="text">
                  <span className="title">Baking Mid-Air</span>
                  <span className="subtitle">Induction Grid Active</span>
                </div>
              </div>
              <div className="floating-badge badge-2">
                <MapPin style={{ color: 'var(--accent-green)', width: '24px', height: '24px' }} />
                <div className="text">
                  <span className="title">Indiranagar Sector 4</span>
                  <span className="subtitle">Altitude: 45m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Swarm Section */}
      <section className="features-section reveal" id="swarm" style={{ background: 'rgba(10, 10, 15, 0.4)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '100px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Autonomous swarm</span>
            <h2 className="section-title">Multi-Agent Grid Architecture</h2>
            <p className="section-desc">Collaborative, localized AI swarm coordinating the millisecond-accurate flight operations, baking control, and balcony descent pipeline.</p>
          </div>

          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {/* Agent 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
                <Flame style={{ color: 'var(--primary-light)' }} />
              </div>
              <h3 style={{ marginTop: '16px', fontSize: '20px' }}>ChefAgent</h3>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--primary-light)', fontWeight: 'bold', display: 'block', margin: '4px 0 12px' }}>Thermal & Induction Control</span>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Runs a <strong>Convolutional Thermal Net (CTN)</strong> for baking optimization and real-time crispiness control.
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent-green)', display: 'inline', marginRight: '6px' }} /> <strong>Viscosity Analysis:</strong> Electromagnetic friction check.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent-green)', display: 'inline', marginRight: '6px' }} /> <strong>Induction Tuning:</strong> 18kHz - 24kHz altitude tracking.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent-green)', display: 'inline', marginRight: '6px' }} /> <strong>Crunch Index:</strong> Acoustic crackle feedback loop.</li>
              </ul>
            </div>

            {/* Agent 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                <Compass style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ marginTop: '16px', fontSize: '20px' }}>NavigatorAgent</h3>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', display: 'block', margin: '4px 0 12px' }}>Flight Vectoring & Avoidance</span>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Implements a <strong>Deep Q-Network</strong> for continuous routing, crosswind stabilizer thrust, and avoidance.
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent)', display: 'inline', marginRight: '6px' }} /> <strong>Micro-routing:</strong> Sub-50m corridor lidar grids.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent)', display: 'inline', marginRight: '6px' }} /> <strong>Avian Redirect:</strong> Non-harmful bird avoidance pulses.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent)', display: 'inline', marginRight: '6px' }} /> <strong>Wind Compensation:</strong> Real-time sway prevention.</li>
              </ul>
            </div>

            {/* Agent 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.3)' }}>
                <Cpu style={{ color: 'var(--accent-green)' }} />
              </div>
              <h3 style={{ marginTop: '16px', fontSize: '20px' }}>LogisticsAgent</h3>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-green)', fontWeight: 'bold', display: 'block', margin: '4px 0 12px' }}>Hub Coordinator & Fleet Manager</span>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Leverages <strong>Multi-Agent Reinforcement Learning</strong> for launch queue logistics and thermal prep operations.
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent-green)', display: 'inline', marginRight: '6px' }} /> <strong>Queue Scheduling:</strong> Drone allocation at nearest pads.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent-green)', display: 'inline', marginRight: '6px' }} /> <strong>Glide Swap:</strong> Battery regeneration path vectors.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--accent-green)', display: 'inline', marginRight: '6px' }} /> <strong>Thermal Vaults:</strong> Pre-checks sambar (80°C) / chutney (4°C).</li>
              </ul>
            </div>

            {/* Agent 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(255, 56, 56, 0.1)', border: '1px solid rgba(255, 56, 56, 0.3)' }}>
                <Satellite style={{ color: 'var(--crimson)' }} />
              </div>
              <h3 style={{ marginTop: '16px', fontSize: '20px' }}>ChutneyDispenseAgent</h3>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 'bold', display: 'block', margin: '4px 0 12px' }}>Pressurized Release & Cryo Vaults</span>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Utilizes a <strong>Mechanical Physics Predictor</strong> for high-speed hover alignment and release.
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--crimson)', display: 'inline', marginRight: '6px' }} /> <strong>Nitrogen isolation:</strong> Keeps cryo chutney fresh.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--crimson)', display: 'inline', marginRight: '6px' }} /> <strong>Deceleration Drop:</strong> Millisecond hover payload release.</li>
                <li style={{ color: 'var(--text-muted)' }}><Check style={{ width: '12px', height: '12px', color: 'var(--crimson)', display: 'inline', marginRight: '6px' }} /> <strong>Air Curtain:</strong> Hydrophobic rain-guard thruster.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customizer Section (Dosa Lab) */}
      <section className="customizer-section reveal" id="customizer">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Dosa Lab 3.0</span>
            <h2 className="section-title">Configure In-Flight Bake Parameters</h2>
            <p className="section-desc">Tailor your aerodynamic breakfast. Select batter thickness, ghee thermal dispersion, and custom fillings. Our neural nets calculate the rest.</p>
          </div>
          
          <div className="customizer-grid">
            <div className="customizer-card">
              <h3><Sliders /> Thermal Specs</h3>
              
              {/* Batter select */}
              <div className="form-group">
                <label className="form-label">Batter Type</label>
                <div className="batter-grid">
                  <button
                    className={`batter-btn ${batterType === 'classic' ? 'active' : ''}`}
                    onClick={() => setBatterType('classic')}
                  >
                    <Sparkles />
                    <span>Classic Masala</span>
                  </button>
                  <button
                    className={`batter-btn ${batterType === 'rava' ? 'active' : ''}`}
                    onClick={() => setBatterType('rava')}
                  >
                    <Zap />
                    <span>Crispy Rava</span>
                  </button>
                  <button
                    className={`batter-btn ${batterType === 'ragi' ? 'active' : ''}`}
                    onClick={() => setBatterType('ragi')}
                  >
                    <Leaf style={{ width: '18px', height: '18px' }} />
                    <span>Organic Ragi</span>
                  </button>
                </div>
              </div>

              {/* Ghee Slider */}
              <div className="form-group">
                <label className="form-label">Ghee Friction Level <span className="val">{gheeValue}%</span></label>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="100"
                  value={gheeValue}
                  onChange={(e) => setGheeValue(parseInt(e.target.value))}
                />
              </div>

              {/* Spice Slider */}
              <div className="form-group">
                <label className="form-label">Chilli Coating Density <span className="val">{spiceLevels[spiceLevel]}</span></label>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="3"
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(parseInt(e.target.value))}
                />
              </div>

              {/* Fillings Checkboxes */}
              <div className="form-group">
                <label className="form-label">Quantum Fillings</label>
                <div className="fillings-grid">
                  <input
                    type="checkbox"
                    id="fill-podi"
                    className="filling-checkbox"
                    checked={podiChecked}
                    onChange={(e) => setPodiChecked(e.target.checked)}
                  />
                  <label htmlFor="fill-podi" className="filling-label">
                    <Flame style={{ width: '14px', height: '14px' }} /> Gunpowder Podi
                  </label>

                  <input
                    type="checkbox"
                    id="fill-cheese"
                    className="filling-checkbox"
                    checked={cheeseChecked}
                    onChange={(e) => setCheeseChecked(e.target.checked)}
                  />
                  <label htmlFor="fill-cheese" className="filling-label">
                    <Sparkles style={{ width: '14px', height: '14px' }} /> Shredded Mozzarella
                  </label>

                  <input
                    type="checkbox"
                    id="fill-aloo"
                    className="filling-checkbox"
                    checked={alooChecked}
                    onChange={(e) => setAlooChecked(e.target.checked)}
                  />
                  <label htmlFor="fill-aloo" className="filling-label">
                    <Zap style={{ width: '14px', height: '14px' }} /> Classic Aloo Masala
                  </label>
                </div>
              </div>
            </div>

            <div className="preview-card">
              <h3 style={{ color: 'var(--accent-green)' }}><Satellite style={{ width: '20px', height: '20px' }} /> Vector Preview</h3>
              
              <div className="dosa-visualizer">
                <div className="svg-dosa-wrapper">
                  <div className="dosa-glow-bg" style={{ opacity: opacityGlow }}></div>
                  
                  {/* SVG Base Dosa */}
                  <svg className="svg-dosa" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="42" fill="#d87e07" stroke="#ffaa00" strokeWidth="2" />
                    {/* Dosa texture swirls */}
                    <circle cx="50" cy="50" r="32" fill="none" stroke="#e08f1f" strokeWidth="1.5" strokeDasharray="20 10" />
                    <circle cx="50" cy="50" r="22" fill="none" stroke="#f1a945" strokeWidth="1" strokeDasharray="10 5" />
                    {/* Golden brown roasted patches */}
                    <circle cx="35" cy="40" r="8" fill="#a05d04" opacity="0.6" />
                    <circle cx="65" cy="55" r="10" fill="#874e01" opacity="0.6" />
                    <circle cx="48" cy="65" r="6" fill="#a05d04" opacity="0.5" />
                  </svg>
                  
                  {/* Steam Overlay */}
                  <svg className="svg-ghee-steam visible" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path className="steam-line" d="M 40 45 Q 38 35 43 25 Q 40 15 42 5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                    <path className="steam-line" d="M 50 45 Q 52 35 48 25 Q 53 15 50 5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                    <path className="steam-line" d="M 60 45 Q 58 35 63 25 Q 60 15 62 5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>

                  {/* Podi Gunpowder Overlay (SVG) */}
                  <svg className={`svg-podi ${podiChecked ? 'visible' : ''}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="2" fill="#8b260b" />
                    <circle cx="34" cy="45" r="1.5" fill="#a93a1a" />
                    <circle cx="45" cy="35" r="2" fill="#8b260b" />
                    <circle cx="55" cy="42" r="1.8" fill="#a93a1a" />
                    <circle cx="60" cy="30" r="2" fill="#8b260b" />
                    <circle cx="68" cy="48" r="1.5" fill="#a93a1a" />
                    <circle cx="48" cy="58" r="2.2" fill="#8b260b" />
                    <circle cx="40" cy="62" r="1.7" fill="#a93a1a" />
                    <circle cx="58" cy="60" r="2" fill="#8b260b" />
                  </svg>

                  {/* Cheese Overlay (SVG) */}
                  <svg className={`svg-cheese ${cheeseChecked ? 'visible' : ''}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="35" y="32" width="10" height="2" transform="rotate(30 35 32)" fill="#ffd32c" rx="1" />
                    <rect x="52" y="40" width="12" height="2" transform="rotate(-15 52 40)" fill="#ffeaa7" rx="1" />
                    <rect x="42" y="55" width="8" height="2" transform="rotate(45 42 55)" fill="#ffd32c" rx="1" />
                    <rect x="58" y="28" width="10" height="2.5" transform="rotate(75 58 28)" fill="#ffeaa7" rx="1" />
                    <rect x="62" y="50" width="11" height="2" transform="rotate(-40 62 50)" fill="#ffd32c" rx="1" />
                    <rect x="28" y="48" width="8" height="2" transform="rotate(10 28 48)" fill="#ffeaa7" rx="1" />
                  </svg>
                </div>
              </div>

              {/* Realtime Telemetry Stats */}
              <div className="stats-display">
                <div className="stat-block">
                  <span className="stat-block-val">{totalCalories} kcal</span>
                  <span className="stat-block-lbl">Total Energy</span>
                </div>
                <div className="stat-block">
                  <span className="stat-block-val highlight">{calculatedCrisp}%</span>
                  <span className="stat-block-lbl">Crunch Index</span>
                </div>
                <div className="stat-block">
                  <span className="stat-block-val">₹{totalPrice}</span>
                  <span className="stat-block-lbl">Drone Fare</span>
                </div>
              </div>

              <button className="customizer-order-btn" onClick={openModal}>
                <Send style={{ width: '16px', height: '16px' }} /> Transmit Order to Swarm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section reveal" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">High-Tech breakfast</span>
            <h2 className="section-title">The Engineering Behind The Crunch</h2>
            <p className="section-desc">Why settle for soggy cardboard-box delivery when you can have aerospace-grade culinary hardware cooking inside cloud corridors?</p>
          </div>
          
          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Cpu />
              </div>
              <h3>AI-Crisp Induction Grid</h3>
              <p>Our drones don't just carry food; they bake it. A modular mid-air induction hearth monitors batter viscosity in real-time, baking it to crispy golden perfection exactly 30 seconds before descent.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap />
              </div>
              <h3>Supersonic Thermal Pods</h3>
              <p>Equipped with thermal vacuum cabins and carbon-fiber hulls, our custom jet-drones travel through dedicated rooftop flight vectors, keeping chutney chilled and sambar piping hot at 80°C.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Satellite />
              </div>
              <h3>Launchpad Hypernetworks</h3>
              <p>Operating out of smart vertical launcher arrays stationed across major tech parks in Bengaluru, Chennai, and Hyderabad. We minimize ground friction for instantaneous deployment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flight Tech Simulator Section */}
      <section className="tech-section reveal" id="tech">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Aerospace Pipeline</span>
            <h2 className="section-title">Drone Flight Pipeline</h2>
            <p className="section-desc">Witness the 3-minute journey from algorithmic order transmission to zero-impact backyard landing.</p>
          </div>

          <div className="flight-path-wrapper">
            <div className="flight-steps">
              <div className="step-card active">
                <div className="step-num">01</div>
                <h4>Order Ingested</h4>
                <p>Thermal recipes compiled and transmitted directly to the drone hearth.</p>
              </div>
              <div className="step-card active">
                <div className="step-num">02</div>
                <h4>Launch Sequence</h4>
                <p>Pressurized vertical launcher fires drone to cruising altitude of 45m.</p>
              </div>
              <div className="step-card">
                <div className="step-num">03</div>
                <h4>Mid-Air Bake</h4>
                <p>Induction grid cooks batter while tracking air temperature and humidity.</p>
              </div>
              <div className="step-card">
                <div className="step-num">04</div>
                <h4>Precision Descent</h4>
                <p>Autonomous lidar navigation delivers fresh crispy dosa onto your plate.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section reveal" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Select Plan</span>
            <h2 className="section-title">Zero Friction Breakfast Subscriptions</h2>
            <p className="section-desc">Whether you are a casual Sunday foodie or an absolute coding machine fueled by ghee, we have the flight parameters for you.</p>
          </div>

          <div className="pricing-toggle-wrapper">
            <span className={`pricing-toggle-label ${pricingPeriod === 'flight' ? 'active' : ''}`} id="label-monthly">Single Flights</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="pricing-toggle"
                checked={pricingPeriod === 'monthly'}
                onChange={(e) => setPricingPeriod(e.target.checked ? 'monthly' : 'flight')}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className={`pricing-toggle-label ${pricingPeriod === 'monthly' ? 'active' : ''}`} id="label-annual">
              Monthly Pass <span style={{ color: 'var(--accent-green)', fontSize: '11px' }}>(Save 20%)</span>
            </span>
          </div>

          <div className="pricing-grid">
            {/* Plan 1 */}
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Batter-as-a-Service (BaaS)</h3>
                <p className="pricing-desc">Perfect for pay-as-you-go techies who crave occasional crispy perfection.</p>
                <div className="pricing-price">
                  <span className="symbol">₹</span>
                  <span>{pricingPeriod === 'flight' ? '99' : '799'}</span>
                  <span className="period">{pricingPeriod === 'flight' ? '/ flight' : '/ month'}</span>
                </div>
              </div>
              
              <ul className="pricing-features">
                <li><Check style={{ width: '16px', height: '16px' }} /> Standard Delivery Jet-Drone (5-8 min)</li>
                <li><Check style={{ width: '16px', height: '16px' }} /> Classic Masala or Plain Batters</li>
                <li><Check style={{ width: '16px', height: '16px' }} /> 2 Standard Chutneys (Teal & Pink)</li>
                <li className="disabled"><X style={{ width: '16px', height: '16px' }} /> Priority Air Corridor Access</li>
                <li className="disabled"><X style={{ width: '16px', height: '16px' }} /> Free piping hot Sambar Thermos</li>
              </ul>

              <button className="btn-pricing" onClick={openModal}>Select Flights</button>
            </div>

            {/* Plan 2 */}
            <div className="pricing-card premium">
              <div className="pricing-header">
                <h3>Dosa Pro Elite</h3>
                <p className="pricing-desc">For heavy culinary power-users. Priority supersonic lanes, gourmet spreads, and unlimited sambar.</p>
                <div className="pricing-price">
                  <span className="symbol">₹</span>
                  <span>{pricingPeriod === 'flight' ? '499' : '399'}</span>
                  <span className="period">{pricingPeriod === 'flight' ? '/ month' : '/ month (Promo)'}</span>
                </div>
              </div>
              
              <ul className="pricing-features">
                <li><Check style={{ width: '16px', height: '16px' }} /> Priority Hyper-Lane (ETA &lt; 3 mins)</li>
                <li><Check style={{ width: '16px', height: '16px' }} /> All Batters (Classic, Ragi, Rava, Podi)</li>
                <li><Check style={{ width: '16px', height: '16px' }} /> Triple Gourmet Chutneys (Mint, Coconut, Garlic)</li>
                <li><Check style={{ width: '16px', height: '16px' }} /> Sambar Insulated Thermos Included</li>
                <li><Check style={{ width: '16px', height: '16px' }} /> Free Unlimited Deliveries</li>
              </ul>

              <button className="btn-pricing" onClick={openModal}>Ignite Membership</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section reveal" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Quick Answers</span>
            <h2 className="section-title">Frequently Algorithmic Questions</h2>
            <p className="section-desc">Everything you need to know about our drone vectors, batter science, and safety metrics.</p>
          </div>

          <div className="faq-grid">
            {[
              {
                q: 'Can a drone drop a dosa directly onto my high-rise balcony?',
                a: 'Yes, absolutely. Our custom drones use millimetric LiDAR sensors and RTK-GPS to target landing zones with under 10cm accuracy. As long as your balcony has a 1x1m clear overhead sky vector, our flight coordinates will lock on perfectly.'
              },
              {
                q: 'How does the dosa stay crispy in the rain?',
                a: "Our cooking pods utilize a pressurized hydrophobic air barrier. Even during major monsoon season downpours, a clean curtain of dry, warm air surrounds the dosa payload chamber, maintaining a 98% crunch index value."
              },
              {
                q: 'Are the chutneys fresh and cold?',
                a: "Always. The drone's carbon fiber chassis houses two separate compartments: a hot induction hearth (bakes at 200°C) and a liquid-nitrogen-cooled cryo-vault that keeps coconut and tomato chutneys at a perfect chilled 4°C."
              },
              {
                q: 'What happens if a bird intercepts the drone?',
                a: 'Our flight computers operate a neural net that detects avian obstacles within 50 meters. The drone dynamically maneuvers to yield the airspace, utilizing high-frequency sound pulses to gently redirect birds away from the flight path.'
              }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
                  <div
                    className="faq-question"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown style={{ width: '16px', height: '16px' }} />
                  </div>
                  <div
                    className="faq-answer"
                    style={{
                      maxHeight: isOpen ? '200px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s ease'
                    }}
                  >
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo-desc">
              <a href="#" className="logo">
                <Drone style={{ width: '24px', height: '24px' }} />
                AirDosa
              </a>
              <p className="footer-desc">
                Pioneering the future of South Indian breakfast automation. High-speed culinary hovercraft networks delivering crunchy happiness at 45 meters above ground level.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-link" aria-label="Twitter"><Twitter style={{ width: '16px', height: '16px' }} /></a>
                <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin style={{ width: '16px', height: '16px' }} /></a>
                <a href="#" className="social-link" aria-label="GitHub"><Github style={{ width: '16px', height: '16px' }} /></a>
                <a href="#" className="social-link" aria-label="Instagram"><Instagram style={{ width: '16px', height: '16px' }} /></a>
              </div>
            </div>

            <div className="footer-links-col">
              <h4>Launch Hubs</h4>
              <ul>
                <li><a href="#">Bengaluru Tech Corridor</a></li>
                <li><a href="#">Chennai OMR Belt</a></li>
                <li><a href="#">Hyderabad Hitec Hub</a></li>
                <li><a href="#">Pune Hinjewadi Pods</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Research</h4>
              <ul>
                <li><a href="#">Induction Pod Patent</a></li>
                <li><a href="#">Flight Path AI Routing</a></li>
                <li><a href="#">Batter Thermal Dynamics</a></li>
                <li><a href="#">Safety & Decibels</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Stay Updated</h4>
              <p className="footer-desc" style={{ marginBottom: '12px', fontSize: '13px' }}>Receive alerts when new drone launchpads open in your postal code.</p>
              <div className="footer-newsletter">
                <form
                  className="newsletter-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Telemetry linked! Welcome to the loop.');
                  }}
                >
                  <input type="email" className="newsletter-input" placeholder="Enter postal code or email" required />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">&copy; 2026 AirDosa Labs Inc. All rights reserved in all airspace vectors.</p>
            <p className="disclaimer">
              Disclaimer: AirDosa, drone flight lines, and mid-air dosa induction arrays are completely fictional and designed for elite tech enthusiasts. Dosas should not actually be consumed from supersonic missile altitudes. Enjoy breakfast responsibly!
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Checkout & Launch Simulation Modal */}
      {isModalOpen && (
        <div className="modal-overlay active" id="checkout-modal">
          {/* Close overlay clicking background */}
          <div
            style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0 }}
            onClick={closeModal}
          ></div>
          
          <div className="modal-container" style={{ position: 'relative', zIndex: 1 }}>
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
              <X style={{ width: '18px', height: '18px' }} />
            </button>
            
            {/* Step 1: Summary */}
            {modalStep === 1 && (
              <div id="checkout-summary-view">
                <div className="modal-header">
                  <h3>Confirm Launch Parameters</h3>
                  <p>Review the thermal specifications before firing the payload thrusters.</p>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <div className="modal-summary-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Batter Composition</span>
                    <span style={{ fontWeight: 700 }}>{batterNameMap[batterType]}</span>
                  </div>
                  <div className="modal-summary-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Ghee Friction Coeff.</span>
                    <span>{gheeValue}% (Coeff)</span>
                  </div>
                  <div className="modal-summary-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Fillings Integrated</span>
                    <span>{activeFillings.join(', ')}</span>
                  </div>
                  <div className="modal-summary-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Bake Destination</span>
                    <span style={{ color: 'var(--accent-green)' }}>Your Geo Coordinates</span>
                  </div>
                  <div className="modal-summary-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Launch Fare</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>₹{totalPrice}</span>
                  </div>
                </div>

                <button className="customizer-order-btn" onClick={startFlightSimulation}>
                  <Play style={{ width: '14px', height: '14px' }} /> Initiate Launch Protocol
                </button>
              </div>
            )}

            {/* Step 2: Live Flight Map Tracker */}
            {modalStep === 2 && (
              <div id="checkout-flight-view" className="flight-simulator" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header">
                  <h3>Active Delivery Telemetry</h3>
                  <p id="flight-status-text">{simStatusText}</p>
                </div>

                <div className="flight-map" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div className="map-grid-bg"></div>
                  <div className="map-node node-launchpad"></div>
                  <div className="map-node node-destination"></div>
                  
                  <svg className="flight-path-svg">
                    {/* Curved flight route paths */}
                    <path className="flight-line" id="flight-path-dash" d="M 100 126 Q 250 20 400 54" fill="none" />
                    <path
                      className="flight-line-active"
                      id="flight-path-active"
                      d="M 100 126 Q 250 20 400 54"
                      fill="none"
                      style={{ strokeDashoffset: `${200 - (simProgress * 2)}px` }}
                    />
                  </svg>
                  
                  {simCompleted ? (
                    <Check
                      className="flight-drone-icon"
                      id="sim-drone"
                      style={{
                        ...simDroneStyle,
                        color: 'var(--accent-green)',
                        fontSize: '26px'
                      }}
                    />
                  ) : (
                    <Drone
                      className="flight-drone-icon"
                      id="sim-drone"
                      style={simDroneStyle}
                    />
                  )}
                </div>

                <div className="stats-display" style={{ width: '100%', borderTop: 'none', marginTop: 0 }}>
                  <div className="stat-block">
                    <span className="stat-block-val" id="sim-alt">{simAltitude}m</span>
                    <span className="stat-block-lbl">Altitude</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block-val" id="sim-temp">{simHearthTemp}°C</span>
                    <span className="stat-block-lbl">Hearth Temp</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block-val" id="sim-speed">{simSpeed} km/h</span>
                    <span className="stat-block-lbl">Speed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
