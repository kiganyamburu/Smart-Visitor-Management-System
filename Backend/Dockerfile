#First stage: Build the application using maven
FROM jelastic/maven:3.9.5-openjdk-21 AS build
#Set working dir inside th container
WORKDIR /app
#copy the pom.xml and download dependenceis
COPY pom.xml .
RUN mvn dependency:go-offline
#copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

#second stage: Create the runtime image
FROM openjdk:21-jdk-slim
#Set the working dir inside the container
WORKDIR /app
#copy the jar file from the first stage
COPY --from=build /app/target/svms-0.0.1-SNAPSHOT.jar app.jar
#Expose the port that the application will run
EXPOSE 8081
#specify the command to run the Jar file
ENTRYPOINT ["java", "-jar", "app.jar"]

#docker build -t svms .
#docker run -p 8081:8081 svms