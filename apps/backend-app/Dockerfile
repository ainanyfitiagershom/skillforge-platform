# Dockerfile multi-stage pour backend-app SkillForge
# Build : image Maven + JDK 21 Temurin
# Runtime : image JRE 21 Temurin (plus legere)

# ----- Stage 1 : build -----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache des dependances : copier d abord le pom seul
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Puis le code et build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ----- Stage 2 : runtime -----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Utilisateur non-root pour la securite
RUN groupadd -r skillforge && useradd -r -g skillforge skillforge

# Copie du jar depuis le stage build
COPY --from=build /app/target/*.jar app.jar

# Permissions
RUN chown skillforge:skillforge app.jar
USER skillforge

# Render fixe la variable PORT, Spring Boot lira SERVER_PORT
ENV SERVER_PORT=10000
EXPOSE 10000

# JVM : limites memoire adaptees au free tier Render (512 Mo RAM)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
