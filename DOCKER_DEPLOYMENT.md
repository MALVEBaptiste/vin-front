# Déploiement du Frontend avec Docker

## Build l'image

```bash
docker build -t vin-front:latest .
```

Ou avec un tag de version :

```bash
docker build -t vin-front:1.0.0 .
```

## Lancer le conteneur

**Localement (en développement):**
```bash
docker run -d -p 3000:80 --name vin-front-dev vin-front:latest
```
L'app sera accessible sur `http://localhost:3000`

**En production avec variables d'environnement:**
```bash
docker run -d \
  -p 80:80 \
  --name vin-front-prod \
  --restart unless-stopped \
  -e API_URL=https://api.example.com \
  vin-front:latest
```

## Utilisation avec Docker Compose

Ajouter à votre `docker-compose.yml` :

```yaml
services:
  vin-front:
    build:
      context: ./vin-front
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=${VITE_API_URL:-http://localhost:3001}
    restart: unless-stopped
```

## Fichiers inclus

- **Dockerfile**: Build multi-étapes (Node builder + Nginx runtime)
- **nginx.conf**: Configuration pour servir l'app React (SPA routing)
- **.dockerignore**: Fichiers à ignorer lors du build

## Optimisations

✅ Build multi-étapes pour réduire la taille de l'image  
✅ Compression Gzip activée  
✅ Cache des assets statiques (30 jours)  
✅ SPA routing configuré (index.html fallback)  
✅ Headers de sécurité inclus  
✅ Image légère (Nginx Alpine)

## Vérifier l'image

```bash
docker images | grep vin-front
docker run -it vin-front:latest sh  # Pour inspecter l'image
```

## Pousser vers un registre

```bash
docker tag vin-front:latest myregistry.azurecr.io/vin-front:latest
docker push myregistry.azurecr.io/vin-front:latest
```
