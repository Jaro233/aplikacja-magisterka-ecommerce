#!/bin/bash

# Define Dockerize version to use
DOCKERIZE_VERSION="v0.7.0"

REPOSITORY_PREFIX="j4ro123"

# Define a list of your microservices directories
microservices=("frontend" "order-service" "cart-service" "product-service" "user-service")

# Loop through each microservice directory
for service in "${microservices[@]}"; do
  echo "Building $service with Maven..."
  
  # Change to the microservice directory
  cd "$service"
  
  # Run Maven clean and package
  mvn clean package
  
  # Check if Maven build was successful
  if [ $? -eq 0 ]; then
    echo "Maven build successful for $service."
    
    # Find the generated JAR file (adjust this line if your build produces multiple JARs)
    ARTIFACT_NAME=$(ls target/*.jar | head -n 1)
    ARTIFACT_NAME=${ARTIFACT_NAME#target/}
    
    # Assuming the Dockerfile and JAR are in the same directory
    # Pass necessary build args for Docker
    echo "Building Docker image for $service..."
    docker build --build-arg ARTIFACT_NAME=target/${ARTIFACT_NAME} --build-arg DOCKERIZE_VERSION=${DOCKERIZE_VERSION} --build-arg EXPOSED_PORT=8080 -t "${REPOSITORY_PREFIX}/${service}:latest" -f ../docker/Dockerfile .
    
    if [ $? -eq 0 ]; then
      echo "Docker image built successfully for $service."
    else
      echo "Failed to build Docker image for $service."
    fi
  else
    echo "Maven build failed for $service."
  fi
  
  # Change back to the original directory
  cd -
done

echo "Build and packaging script completed."