FROM eclipse-temurin:17.0.6_10-jre
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} discovery.jar
ENTRYPOINT ["java", "-jar", "discovery.jar"]