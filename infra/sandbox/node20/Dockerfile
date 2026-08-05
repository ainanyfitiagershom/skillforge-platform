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

# Durcissement final : /bin/sh ne peut pas etre chmod 700 (docker-entrypoint.sh en depend).
# On chmod 700 uniquement les utilitaires unix qui servent aux attaques via
# child_process.exec/spawn (cat, ls, whoami, id...) mais qu'aucun cas VALID Node ne necessite.
# Le shell /bin/sh reste 755 pour l'entrypoint, mais sans utilitaires, exec("cat X") echoue.
RUN for f in cat ls whoami id ps kill mkdir chmod chown wget curl nc netcat; do \
      [ -f /bin/$f ] && chmod 700 /bin/$f || true; \
      [ -f /usr/bin/$f ] && chmod 700 /usr/bin/$f || true; \
    done

CMD ["node", "--version"]
