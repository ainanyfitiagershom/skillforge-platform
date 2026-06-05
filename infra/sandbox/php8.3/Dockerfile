# Image runtime PHP 8.3 minimale pour l'execution sandbox du code candidat.
#
# Strategie de durcissement (le reste est applique au runtime via docker run) :
# - Image Alpine minimale (~30 Mo)
# - Pas de shell interactif inutile
# - Utilisateur non privilegie (uid 1001) cree explicitement
# - PHPUnit installe globalement pour l'auto-grading
# - Pas de Composer en production (les tests caches sont injectes au runtime)
#
# Au runtime, le SandboxRunner ajoutera :
#   --network none
#   --read-only
#   --user 1001:1001
#   --cap-drop=ALL
#   --security-opt seccomp=/path/to/skillforge-seccomp.json
#   --security-opt no-new-privileges
#   --memory=256m --memory-swap=256m
#   --cpus=1
#   --pids-limit=64
#   --tmpfs /tmp:rw,noexec,nosuid,size=64m
#   --tmpfs /work:rw,nosuid,size=16m  (le code candidat y sera monte)

FROM php:8.3-cli-alpine

# Installer PHPUnit pour l'auto-grading
RUN apk add --no-cache --virtual .build-deps curl \
    && curl -L https://phar.phpunit.de/phpunit-11.phar -o /usr/local/bin/phpunit \
    && chmod +x /usr/local/bin/phpunit \
    && apk del .build-deps

# Creer un utilisateur non privilegie pour l'execution
RUN addgroup -g 1001 -S sandbox \
    && adduser -u 1001 -S sandbox -G sandbox

# Repertoire de travail (sera monte en tmpfs au runtime)
WORKDIR /work

# Verification rapide au build : PHP + PHPUnit doivent etre en place
RUN php --version && phpunit --version

# Par defaut, on ne fait rien — la commande sera passee par docker run
CMD ["php", "--version"]
