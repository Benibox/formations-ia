#!/bin/bash
# ============================================
# Benul IA — Deploiement Cloudflare Pages
# ============================================
# Usage : cd ~/Desktop/Formations && bash deploy.sh
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
    echo "Erreur : index.html non trouve. Lance ce script depuis ~/Desktop/Formations"
    exit 1
fi

# Preparer le dossier dist
echo "Preparation des fichiers..."
rm -rf dist
mkdir -p dist/functions/api

# Copier les fichiers du site
cp index.html methode.html offres.html contact.html dist/
cp chatbot.js dist/
cp functions/api/chat.js dist/functions/api/

echo "Fichiers prets dans ./dist"
echo ""

# Verifier si connecte a Cloudflare
echo "Verification de la connexion Cloudflare..."
if ! npx wrangler whoami 2>/dev/null | grep -q "Account"; then
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
npx wrangler pages deploy ./dist --project-name benul-ia

echo ""
echo "=== Deploiement termine ! ==="
echo ""
echo "Site en ligne : https://benul-ia.pages.dev"
echo ""
echo "--- Prochaines etapes ---"
echo ""
echo "1. Connecter le domaine benul-ia.fr :"
echo "   Dashboard Cloudflare > Workers & Pages > benul-ia > Custom domains > Add"
echo ""
echo "2. Configurer la cle API pour le chatbot :"
echo "   Dashboard > Workers & Pages > benul-ia > Settings > Environment variables"
echo "   Nom : ANTHROPIC_API_KEY"
echo "   Valeur : ta cle API Anthropic"
echo ""
