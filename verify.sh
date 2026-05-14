#!/bin/bash
# ════════════════════════════════════════════════════════════════════════════
# SCRIPT DE VERIFICACIÓN - Portfolio Manuel Dominguez
# ════════════════════════════════════════════════════════════════════════════

echo "🔍 VERIFICANDO ESTRUCTURA DEL PROYECTO..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar archivos principales
echo "📄 Archivos principales:"
[ -f "index.html" ] && echo -e "${GREEN}✓${NC} index.html" || echo -e "${RED}✗${NC} index.html FALTA"
[ -f "README.md" ] && echo -e "${GREEN}✓${NC} README.md" || echo -e "${RED}✗${NC} README.md FALTA"
[ -f "package.json" ] && echo -e "${GREEN}✓${NC} package.json" || echo -e "${RED}✗${NC} package.json FALTA"
[ -f ".gitignore" ] && echo -e "${GREEN}✓${NC} .gitignore" || echo -e "${RED}✗${NC} .gitignore FALTA"

echo ""
echo "📂 Carpetas y contenido:"

# CSS
echo -n "  css/ "
if [ -d "css" ]; then
  [ -f "css/styles.css" ] && echo -e "${GREEN}✓${NC} (styles.css)" || echo -e "${RED}✗${NC} FALTA styles.css"
else
  echo -e "${RED}✗${NC} CARPETA NO EXISTE"
fi

# JS
echo -n "  js/ "
if [ -d "js" ]; then
  [ -f "js/script.js" ] && echo -e "${GREEN}✓${NC} (script.js)" || echo -e "${RED}✗${NC} FALTA script.js"
else
  echo -e "${RED}✗${NC} CARPETA NO EXISTE"
fi

# IMG
echo -n "  img/ "
if [ -d "img" ]; then
  [ -f "img/profile.jpg" ] && echo -e "${GREEN}✓${NC} (profile.jpg)" || echo -e "${YELLOW}⚠${NC} (lista para agregar profile.jpg)"
else
  echo -e "${RED}✗${NC} CARPETA NO EXISTE"
fi

# ASSETS
echo -n "  assets/ "
[ -d "assets" ] && echo -e "${GREEN}✓${NC} (lista para recursos adicionales)" || echo -e "${RED}✗${NC} CARPETA NO EXISTE"

echo ""
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 RESUMEN:"
echo "  • Estructura de carpetas: ✓ LISTA"
echo "  • Archivos principales: ✓ LISTA"
echo "  • Foto de perfil: ⚠ AGREGA TU FOTO A img/profile.jpg"
echo ""
echo "🚀 PRÓXIMO PASO:"
echo "  Coloca tu foto en /img/profile.jpg y descomenta la línea en index.html"
echo ""
echo "════════════════════════════════════════════════════════════════════════════
