# 📋 GUÍA RÁPIDA DE CONFIGURACIÓN

Tu portfolio está **100% listo** con una arquitectura profesional. Aquí están los pasos finales:

## 🎯 PASO 1: Agregar tu Foto

1. **Prepara tu foto**
   - Formato: JPG o PNG
   - Tamaño recomendado: 400x400 px (mínimo 300x300 px)
   - Nombre: `profile.jpg` (o el que prefieras)

2. **Colócala en la carpeta `/img`**
   ```
   Portfolio/
   └── img/
       └── profile.jpg  ← Aquí va tu foto
   ```

3. **Descomenta la línea en `index.html`** (línea ~149)
   
   Busca esto:
   ```html
   <!-- <img src="img/profile.jpg" alt="Manuel Dominguez" class="avatar-img" /> -->
   ```
   
   Cambialo por esto:
   ```html
   <img src="img/profile.jpg" alt="Manuel Dominguez" class="avatar-img" />
   ```

4. **(Opcional) Elimina las iniciales**
   
   Si quieres solo la foto, comenta o borra esta línea:
   ```html
   <span class="avatar-initials">MD</span>
   ```

---

## ✏️ PASO 2: Personalizar tu Contenido

### En `index.html`:

- **Línea ~102**: Tu nombre y especialización (Hero)
- **Línea ~130**: "Disponible para nuevas oportunidades"
- **Línea ~176-186**: Párrafos sobre ti (About)
- **Línea ~191-198**: Métricas (años exp., proyectos, integraciones)
- **Línea ~246-305**: Tus habilidades y stack técnico
- **Línea ~370-490**: Tus 6 proyectos personales
- **Línea ~560-590**: Links de LinkedIn, GitHub, email
- **Línea ~595-650**: Formulario de contacto

### En `css/styles.css`:

- **Línea ~1-40**: Variables CSS (colores, tipografía)
  - `--accent`: Color principal (actual: cian `#00d4ff`)
  - `--bg-primary`, `--bg-secondary`: Fondos

- **Línea ~900-1000**: Estilos de sección, navbar, hero

### En `js/script.js`:

- **Línea ~593-622**: Configuración del canvas de partículas
- **Línea ~520-570**: Validación del formulario
- **Línea ~556-565**: Función `simulateSend()` (conectar email)

---

## 📧 PASO 3: Conectar Formulario de Contacto

El formulario enviará a un endpoint. Elige tu opción:

### Opción A: EmailJS (Recomendado)

1. **Regístrate**: [emailjs.com](https://www.emailjs.com/)
2. **Crea un template** para recibir correos
3. **En `js/script.js` línea 556**, reemplaza:

```javascript
function simulateSend(data) {
  return emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
    from_name: data.name,
    to_email: 'tu@email.com',
    from_email: data.email,
    subject: data.subject,
    message: data.message
  });
}
```

4. **En `index.html` línea ~30**, agrega antes de Lucide:
```html
<script type="text/javascript" 
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4.0.0/dist/index.min.js"></script>
<script type="text/javascript">
  emailjs.init('YOUR_PUBLIC_KEY');
</script>
```

### Opción B: Formspree (Más simple)

1. **Regístrate**: [formspree.io](https://formspree.io/)
2. **Obtén tu endpoint**: `https://formspree.io/f/YOUR_ID`
3. **En contactForm en `index.html` línea ~595**, cambia:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST">
   ```

### Opción C: Backend Propio

Reemplaza `simulateSend()` en `js/script.js` línea 556:

```javascript
function simulateSend(data) {
  return fetch('https://tu-dominio.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());
}
```

---

## 🔗 PASO 4: Actualizar Enlaces Sociales

En `index.html` línea ~560-590, reemplaza:

```html
<!-- LINKEDIN -->
<a href="https://www.linkedin.com/in/TU_USUARIO" ...>

<!-- GITHUB -->
<a href="https://github.com/TU_USUARIO" ...>

<!-- EMAIL -->
<a href="mailto:tu@email.com" ...>
```

---

## 📂 PASO 5: Agregar tus Proyectos

En `index.html` línea ~370, edita cada tarjeta `<article class="project-card">`:

```html
<h3 class="card-title">Nombre de tu Proyecto</h3>
<p class="card-description">Descripción breve (2-3 líneas)</p>
<a href="https://github.com/tu-repo" target="_blank">GitHub</a>
<a href="https://demo-url.com" target="_blank">Demo</a>
<span class="card-tag">Java</span>
<span class="card-tag">Spring Boot</span>
<!-- ... más tags -->
```

También puedes duplicar una tarjeta completa si quieres 7+ proyectos.

---

## 🚀 PASO 6: Deployar

### Opción A: GitHub Pages (Gratis)

```bash
cd /home/manu/Escritorio/Portfolio
git init
git add .
git commit -m "Initial commit: Portfolio site"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/portfolio.git
git push -u origin main
```

Luego en GitHub → Settings → Pages → Deploy from main branch

### Opción B: Netlify (Muy fácil)

1. Ve a [netlify.com](https://netlify.com)
2. Conecta tu repo de GitHub
3. Deploy automático ✨

### Opción C: Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Import proyecto
3. Deploy en 1 clic

---

## ✅ CHECKLIST FINAL

- [ ] Foto agregada en `/img/profile.jpg`
- [ ] Foto descomentada en `index.html`
- [ ] Tu nombre y especialización actualizada
- [ ] Párrafos sobre ti editados
- [ ] Habilidades y stack técnico personalizado
- [ ] 6 proyectos reales con links
- [ ] Enlaces sociales actualizados
- [ ] Formulario conectado a servicio de email
- [ ] Verificado en mobile (F12 → Responsive)
- [ ] Deployado en GitHub/Netlify/Vercel

---

## 🎨 TIPS DE PERSONALIZACIÓN

**Cambiar color principal (cian → otro color):**

En `css/styles.css` línea ~13:
```css
--accent: #tu-color-aqui;  /* Ej: #FF6B6B para rojo */
```

**Acelerar/desacelerar animaciones:**

En `css/styles.css` línea ~45:
```css
--transition-fast: 0.1s ease;  /* Reduce de 0.2s */
--transition-med: 0.2s cubic-bezier(...);  /* Reduce de 0.35s */
```

**Ajustar partículas del fondo:**

En `js/script.js` línea ~594:
```javascript
particleCount: 80,  /* Sube de 60 para más efecto */
```

---

¡Listo! Tu portfolio está hecho con profesionalismo y sigue mejores prácticas de desarrollo. 🚀

**¿Preguntas?** Revisa el `README.md` para documentación completa.
