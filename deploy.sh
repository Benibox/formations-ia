#!/bin/bash
# ============================================
# Benul IA — Deploiement Cloudflare Pages
# ============================================
# Usage : cd ~/Desktop/formations-ia && bash deploy.sh
# ============================================

set -e

echo ""
echo "=== Benul IA — Deploiement ==="
echo ""

# Verifier npm/npx
if ! command -v npx &> /dev/null; then
    echo "Erreur : npx non trouve. Installe Node.js : https://nodejs.org"
    exit 1
fi

# Verifier qu'on est dans le bon dossier
if [ ! -f "index.html" ]; then
    echo "Erreur : index.html non trouve. Lance ce script depuis la racine du repo."
    exit 1
fi

# Preparer le dossier dist (rsync : copie tout sauf ce qui n'est pas du site)
echo "Preparation des fichiers..."
rm -rf dist
mkdir -p dist

rsync -a \
  --exclude='.git/' \
  --exclude='.gitignore' \
  --exclude='.wrangler/' \
  --exclude='node_modules/' \
  --exclude='dist/' \
  --exclude='deploy.sh' \
  --exclude='CLAUDE.md' \
  --exclude='videos/' \
  --exclude='*.pdf' \
  --exclude='*.docx' \
  --exclude='*.key' \
  --exclude='.DS_Store' \
  --exclude='Thumbs.db' \
  ./ dist/

echo "Fichiers prets dans ./dist"
echo ""

# Verifier si connecte a Cloudflare
echo "Verification de la connexion Cloudflare..."
if ! npx wrangler whoami 2>/dev/null | grep -q "logged in"; then
    echo "Pas encore connecte. Ouverture du navigateur..."
    npx wrangler login
fi

# Creer le projet si necessaire (ignore l'erreur si deja existant)
echo ""
echo "Verification du projet..."
npx wrangler pages project create benul-ia --production-branch main 2>/dev/null || true

# Deployer
echo ""
echo "Deploiement en cours..."
npx wrangler pages deploy ./dist --project-name benul-ia --branch main --commit-dirty=true

echo ""
echo "=== Deploiement termine ! ==="
echo ""
echo "Site en ligne : https://benul-ia.pages.dev"
echo ""
echo "--- Prochaines etapes (si pas deja fait) ---"
echo ""
echo "1. Connecter le domaine benul-ia.fr :"
echo "   Dashboard Cloudflare > Workers & Pages > benul-ia > Custom domains > Add"
echo ""
echo "2. Configurer la cle API pour le chatbot :"
echo "   Dashboard > Workers & Pages > benul-ia > Settings > Environment variables"
echo "   Nom : ANTHROPIC_API_KEY"
echo "   Valeur : ta cle API Anthropic"
echo ""
