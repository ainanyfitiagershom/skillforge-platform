# Image runtime Node 20 minimale pour l'execution sandbox du code candidat.
#
# Strategie identique a php8.3 :
# - Image Alpine minimale (~50 Mo)
# - Utilisateur non privilegie (uid 1001)
# - Jest pre-installe globalement pour l'auto-grading
#
# Les flags de durcissement Docker sont appliques au runtime par le SandboxRunner.

FROM node:20-alpine

# Installer Jest globalement
RUN npm install -g jest@29 --no-audit --no-fund \
    && npm cache clean --force

# Creer un utilisateur non privilegie
RUN addgroup -g 1001 -S sandbox \
    && adduser -u 1001 -S sandbox -G sandbox

# Repertoire de travail (sera monte en tmpfs au runtime)
WORKDIR /work

# Verification au build
RUN node --version && jest --version

CMD ["node", "--version"]
