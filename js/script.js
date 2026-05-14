/**
 * ═══════════════════════════════════════════════════════════════════
 * PORTFOLIO – Manuel Dominguez
 * script.js – Vanilla JavaScript
 *
 * Módulos:
 *  1. Inicialización de iconos Lucide
 *  2. Cursor personalizado
 *  3. Navbar (scroll + mobile toggle + active links)
 *  4. Hero Canvas (partículas reactivas al ratón)
 *  5. Scroll Reveal (IntersectionObserver)
 *  6. Animación de barras de skills
 *  7. Efecto glow en tarjetas (seguimiento del ratón)
 *  8. Formulario de contacto (validación + envío simulado)
 *  9. Footer: año dinámico
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/* ──────────────────────────────────────────────────
   1. ICONOS LUCIDE
   Se inicializan después de que el DOM esté listo
   ────────────────────────────────────────────────── */
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}


/* ──────────────────────────────────────────────────
   2. CURSOR PERSONALIZADO
   Punto (CSS ::after) + Anillo exterior (div JS)
   Solo en dispositivos con hover (no táctiles)
   Respeta prefers-reduced-motion
   ────────────────────────────────────────────────── */
function initCustomCursor() {
  // Detectar si el dispositivo soporta hover real (no táctil) y preferencias de movimiento
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.matchMedia('(hover: hover)').matches || prefersReducedMotion) return;

  /* Crear el anillo exterior del cursor */
  const ring = document.createElement('div');
  ring.classList.add('cursor-ring');
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  /* Actualizar posición del punto (CSS vars) y del anillo (transform) */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // El punto pequeño sigue el cursor inmediatamente vía CSS vars
    document.body.style.setProperty('--cursor-x', mouseX + 'px');
    document.body.style.setProperty('--cursor-y', mouseY + 'px');
  });

  /* El anillo sigue con un lag suave (lerp) */
  function animateCursor() {
    const lerp = 0.12; // Factor de interpolación (0 = lento, 1 = instantáneo)
    ringX += (mouseX - ringX) * lerp;
    ringY += (mouseY - ringY) * lerp;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  /* Efecto hover al pasar sobre elementos interactivos */
  const hoverTargets = 'a, button, .project-card, .skill-badge, .stack-badge, .form-input';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.remove('hovering');
    }
  });

  /* Ocultar cursor al salir de la ventana */
  document.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    ring.style.opacity = '1';
  });
}


/* ──────────────────────────────────────────────────
   3. NAVBAR
   a) Clase 'scrolled' al desplazarse
   b) Toggle del menú móvil
   c) Cierre del menú al hacer clic en un link
   d) Resaltado del enlace activo al hacer scroll
   ────────────────────────────────────────────────── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('navMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.nav-mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  /* ── a) Clase scrolled ── */
  const scrollThreshold = 30;

  function handleNavScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Ejecutar al inicio

  /* ── b) Toggle menú móvil ── */
  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.classList.add('open');
    // Bloquear scroll del body mientras el menú está abierto
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  /* ── c) Cerrar menú al pulsar un link ── */
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Cerrar menú al pulsar fuera de él */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      closeMenu();
    }
  });

  /* ── d) Link activo según scroll (IntersectionObserver) ── */
  const observerOptions = {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));
}


/* ──────────────────────────────────────────────────
   4. HERO CANVAS – PARTÍCULAS REACTIVAS AL RATÓN
   Sistema de partículas con:
   - Movimiento autónomo suave
   - Conexiones entre partículas cercanas
   - Atracción/repulsión suave hacia el ratón
   - Redimensionamiento responsive
   ────────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* Configuración de partículas
   * ░ PERSONALIZABLE: ajusta estos valores para cambiar el efecto ░ */
  const CONFIG = {
    particleCount: window.innerWidth < 768 ? 30 : 60, // Más partículas en desktop
    maxConnectDist: 130,     // Distancia máxima para dibujar conexiones (px)
    mouseRadius: 150,        // Radio de influencia del ratón (px)
    mouseForce: 0.018,       // Fuerza de atracción/repulsión del ratón
    particleSpeed: 0.3,      // Velocidad base de movimiento
    particleMinSize: 1,      // Tamaño mínimo de partícula (px)
    particleMaxSize: 2.5,    // Tamaño máximo de partícula (px)
    accentColor: '0, 212, 255',  // Color base (RGB) – cian eléctrico
    accentColor2: '0, 255, 157', // Color secundario (RGB) – menta
  };

  let particles = [];
  let mouse = { x: null, y: null };
  let animFrameId;
  let dpr = window.devicePixelRatio || 1;

  /* ── Clase Partícula ── */
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x    = Math.random() * canvas.width  / dpr;
      this.y    = Math.random() * canvas.height / dpr;
      this.vx   = (Math.random() - 0.5) * CONFIG.particleSpeed;
      this.vy   = (Math.random() - 0.5) * CONFIG.particleSpeed;
      this.size = CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize);
      // Mezcla aleatoria de los dos colores de acento
      this.color = Math.random() > 0.3 ? CONFIG.accentColor : CONFIG.accentColor2;
      this.opacity = 0.2 + Math.random() * 0.5;
      this.pulsePhase = Math.random() * Math.PI * 2; // Para el efecto de pulso
    }

    update(t) {
      /* Pulso suave de opacidad */
      const pulse = Math.sin(t * 0.001 + this.pulsePhase) * 0.15;
      this._opacity = Math.max(0.05, this.opacity + pulse);

      /* Influencia del ratón */
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius) {
          // Repulsión suave: las partículas se apartan del ratón
          const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
          this.vx -= dx * force;
          this.vy -= dy * force;
        }
      }

      /* Fricción para evitar velocidades excesivas */
      this.vx *= 0.99;
      this.vy *= 0.99;

      /* Mover partícula */
      this.x += this.vx;
      this.y += this.vy;

      /* Rebotar en los bordes del canvas */
      const w = canvas.width  / dpr;
      const h = canvas.height / dpr;

      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;

      // Mantener dentro de los límites
      this.x = Math.max(0, Math.min(w, this.x));
      this.y = Math.max(0, Math.min(h, this.y));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this._opacity})`;
      ctx.fill();

      /* Halo suave alrededor de la partícula */
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this._opacity * 0.15})`;
      ctx.fill();
    }
  }

  /* ── Inicializar partículas ── */
  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  /* ── Dibujar conexiones entre partículas cercanas ── */
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxConnectDist) {
          /* Opacidad de la línea proporcional a la distancia */
          const alpha = (1 - dist / CONFIG.maxConnectDist) * 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.accentColor}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Loop de animación ── */
  function animate(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update(t);
      p.draw();
    });

    drawConnections();

    animFrameId = requestAnimationFrame(animate);
  }

  /* ── Redimensionar el canvas ── */
  function resizeCanvas() {
    const hero = canvas.parentElement;
    dpr = window.devicePixelRatio || 1;

    canvas.width  = hero.offsetWidth  * dpr;
    canvas.height = hero.offsetHeight * dpr;
    canvas.style.width  = hero.offsetWidth  + 'px';
    canvas.style.height = hero.offsetHeight + 'px';

    ctx.scale(dpr, dpr);

    // Reinicializar partículas con el nuevo tamaño
    initParticles();
  }

  /* ── Seguimiento del ratón ── */
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  /* ── Eventos táctiles (mobile) ── */
  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  /* ── Arrancar ── */
  resizeCanvas();
  requestAnimationFrame(animate);

  /* Redimensionar al cambiar el tamaño de ventana (debounced) */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 200);
  });

  /* Pausar animación cuando la pestaña no es visible (ahorro de CPU) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      requestAnimationFrame(animate);
    }
  });
}


/* ──────────────────────────────────────────────────
   5. SCROLL REVEAL
   Usa IntersectionObserver para revelar elementos
   con la clase [data-reveal] al entrar en el viewport
   Respeta prefers-reduced-motion
   ────────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!elements.length) return;

  // Si el usuario prefiere movimiento reducido, mostrar todos los elementos inmediatamente
  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Dejar de observar una vez revelado (mejor performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ──────────────────────────────────────────────────
   6. ANIMACIÓN DE BARRAS DE SKILLS
   Las barras se animan cuando entran en el viewport
   ────────────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') + '%';
          // Un pequeño retraso para que el efecto sea más vistoso
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 150);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.1 }
  );

  bars.forEach(bar => observer.observe(bar));
}


/* ──────────────────────────────────────────────────
   7. EFECTO GLOW EN TARJETAS DE PROYECTOS
   Actualiza las CSS vars --mouse-x y --mouse-y
   en cada tarjeta para el gradiente radial de brillo
   ────────────────────────────────────────────────── */
function initCardGlow() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });

    card.addEventListener('mouseleave', () => {
      // Resetear al centro al salir
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}


/* ──────────────────────────────────────────────────
   8. FORMULARIO DE CONTACTO
   Validación en tiempo real + envío simulado
   ░ PERSONALIZABLE: conecta aquí tu backend real,
     EmailJS, Formspree, o cualquier servicio ░
   ────────────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  /* ── Reglas de validación ── */
  const rules = {
    contactName: {
      field: document.getElementById('contactName'),
      error: document.getElementById('nameError'),
      validate(val) {
        if (!val.trim()) return 'El nombre es obligatorio.';
        if (val.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        return null;
      }
    },
    contactEmail: {
      field: document.getElementById('contactEmail'),
      error: document.getElementById('emailError'),
      validate(val) {
        if (!val.trim()) return 'El email es obligatorio.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return 'Introduce un email válido.';
        return null;
      }
    },
    contactMessage: {
      field: document.getElementById('contactMessage'),
      error: document.getElementById('messageError'),
      validate(val) {
        if (!val.trim()) return 'El mensaje es obligatorio.';
        if (val.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
        return null;
      }
    }
  };

  /* ── Mostrar/limpiar error de un campo ── */
  function showError(rule, message) {
    rule.field.classList.add('error');
    rule.error.textContent = message;
    rule.field.setAttribute('aria-invalid', 'true');
  }

  function clearError(rule) {
    rule.field.classList.remove('error');
    rule.error.textContent = '';
    rule.field.setAttribute('aria-invalid', 'false');
  }

  /* ── Validar un campo individual ── */
  function validateField(ruleKey) {
    const rule = rules[ruleKey];
    if (!rule) return true;
    const errorMsg = rule.validate(rule.field.value);
    if (errorMsg) {
      showError(rule, errorMsg);
      return false;
    }
    clearError(rule);
    return true;
  }

  /* ── Validación en tiempo real (al salir del campo) ── */
  Object.keys(rules).forEach(key => {
    const { field } = rules[key];
    field.addEventListener('blur', () => validateField(key));
    field.addEventListener('input', () => {
      // Limpiar error mientras el usuario corrige
      if (field.classList.contains('error')) {
        validateField(key);
      }
    });
  });

  /* ── Simular envío del formulario ── */
  /* ░░░ PERSONALIZA: reemplaza el setTimeout con tu lógica real ░░░
       Ejemplo con EmailJS:
       emailjs.send('service_id', 'template_id', data).then(...)
       Ejemplo con Formspree:
       fetch('https://formspree.io/f/tu-id', { method: 'POST', body: formData })
  */
  function simulateSend(data) {
    return new Promise((resolve) => {
      // Simular latencia de red (1.5 segundos)
      setTimeout(() => {
        console.log('Datos del formulario:', data);
        resolve({ success: true });
      }, 1500);
    });
  }

  /* ── Handler del submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Validar todos los campos */
    const isValid = Object.keys(rules).map(validateField).every(Boolean);
    if (!isValid) {
      /* Enfocar el primer campo con error para accesibilidad */
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.focus();
        // Agregar feedback visual del error
        firstError.classList.add('shake');
        setTimeout(() => firstError.classList.remove('shake'), 500);
      }
      return;
    }

    /* Recoger datos del formulario */
    const formData = {
      name:    document.getElementById('contactName').value.trim(),
      email:   document.getElementById('contactEmail').value.trim(),
      subject: document.getElementById('contactSubject').value.trim(),
      message: document.getElementById('contactMessage').value.trim(),
    };

    /* Estado de carga */
    form.classList.add('loading');
    submitBtn.disabled = true;

    try {
      await simulateSend(formData);

      /* Éxito: mostrar mensaje y resetear */
      successMsg.setAttribute('aria-hidden', 'false');
      form.reset();
      
      // Limpiar errores visuales
      Object.values(rules).forEach(rule => clearError(rule));

      /* Ocultar el mensaje de éxito tras 6 segundos */
      setTimeout(() => {
        successMsg.setAttribute('aria-hidden', 'true');
      }, 6000);

    } catch (err) {
      /* En caso de error real, informar al usuario */
      console.error('Error al enviar el formulario:', err);
      alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo o contacta directamente por email.');
    } finally {
      form.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}


/* ──────────────────────────────────────────────────
   9. FOOTER: AÑO DINÁMICO
   ────────────────────────────────────────────────── */
function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ──────────────────────────────────────────────────
   10. SMOOTH SCROLL para navegación interna
   Cierra el menú móvil al navegar y añade
   un pequeño offset para la navbar fija
   ────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // Ignorar links vacíos

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // El offset lo gestiona scroll-padding-top en el CSS,
      // pero podemos reforzarlo aquí si es necesario
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* ──────────────────────────────────────────────────
   11. EASTER EGG: Efecto de escritura en la consola
   Un toque de personalidad para dev recruiters
   ────────────────────────────────────────────────── */
function initConsoleBranding() {
  const styles = [
    'color: #00d4ff; font-size: 20px; font-weight: bold; font-family: monospace;',
    'color: #8892a4; font-size: 13px; font-family: monospace;',
    'color: #00ff9d; font-size: 13px; font-family: monospace;',
  ];

  console.log(
    '%c[MD] Manuel Dominguez',
    styles[0]
  );
  console.log(
    '%cBackend Developer · Java · Spring Boot · Workday',
    styles[1]
  );
  console.log(
    '%c↳ Si ves esto, probablemente somos el mismo tipo de persona. Hablemos.',
    styles[2]
  );
}


/* ──────────────────────────────────────────────────
   INICIALIZACIÓN PRINCIPAL
   Esperar a que el DOM esté completamente cargado
   ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Inicializar iconos primero (Lucide necesita el DOM completo) */
  initIcons();

  /* Módulos de UI */
  initCustomCursor();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initCardGlow();
  initContactForm();
  initFooterYear();
  initSmoothScroll();

  /* Canvas (inicializar después del layout para obtener dimensiones correctas) */
  // Pequeño requestAnimationFrame para asegurar que el hero tiene su altura final
  requestAnimationFrame(() => {
    initHeroCanvas();
  });

  /* Easter egg en consola */
  initConsoleBranding();

  /* Log de inicio (solo en modo dev) */
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('%c[DEV] Portfolio cargado correctamente ✓', 'color: #00ff9d; font-family: monospace;');
  }
});
