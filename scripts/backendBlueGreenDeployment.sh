#!/bin/bash

currentSlot=`(helm get values --all ${APP_NAME_SHORT} | grep -Po 'productionSlot: \K.*')`
echo $currentSlot
if [ "$currentSlot" == "blue" ]; then
  oldSlot="blue"
  newSlot="green"
else
  oldSlot="green"
  newSlot="blue"
fi

deploymentOption="productionSlot=$newSlot"
echo "$deploymentOption"

if [ "$DEPLOY_ONLY" == "true" ]; then
  # Deploy the new version (either blue or green) and wait for it to become ready
  helm upgrade ${APP_NAME_SHORT} ./kubernetes/helm/app/${APP_NAME_SHORT} --set microservice.image.repository_${newSlot}=${ECR_REGISTRY}/${ECR_REPO_NAME} --set microservice.image.tag_${newSlot}=1.${REPOSITORY_TAG} --reuse-values

  if ! kubectl rollout status deployment/${APP_NAME_SHORT}-${newSlot} -n ${NAMESPACE} --timeout=300s; then
    echo "Deployment failed. Starting rollback..."
    helm rollback "${APP_NAME_SHORT}"  # This rolls back to the previous revision
    exit 1
  fi

else
  # Change the connection string
  helm upgrade "${APP_NAME_SHORT}" ./kubernetes/helm/app/"${APP_NAME_SHORT}" --set database.uri_env_${newSlot}=mysql-prod.prod-db --set microservice.current_environment_${newSlot}=prod --set microservice.image.repository_${newSlot}=${ECR_REGISTRY}/${ECR_REPO_NAME} --set microservice.image.tag_${newSlot}=1.${REPOSITORY_TAG} --reuse-values

  if ! kubectl rollout status deployment/${APP_NAME_SHORT}-${newSlot} -n ${NAMESPACE} --timeout=300s; then
    echo "Deployment failed. Starting rollback..."
    CURRENT_REVISION=$(helm history ${APP_NAME_SHORT} --max 1 --output json | jq '.[0].revision')

    # Calculate the target revision for rolling back 2 versions
    TARGET_REVISION=$((CURRENT_REVISION - 2))

    # Perform the rollback
    helm rollback "${APP_NAME_SHORT}" $TARGET_REVISION
    exit 1
  fi

  # Swap selectors to direct production traffic to the new version (newSlot) and wait for it to become ready
  helm upgrade "${APP_NAME_SHORT}" ./kubernetes/helm/app/"${APP_NAME_SHORT}" --set "$deploymentOption" --reuse-values

  # Fetch the current selector for the production service and compare it to the desired state
  CURRENT_SELECTOR=$(kubectl get svc "${APP_NAME_SHORT}-prod" -n ${NAMESPACE} -o=jsonpath='{.spec.selector.slot}')

  if [[ "$CURRENT_SELECTOR" == *"${newSlot}"* ]]; then
    echo "Service selector updated successfully."
  else
    echo "Service selector not updated. Starting rollback..."
    CURRENT_REVISION=$(helm history ${APP_NAME_SHORT} --max 1 --output json | jq '.[0].revision')

    # Calculate the target revision for rolling back 3 versions
    TARGET_REVISION=$((CURRENT_REVISION - 3))

    # Perform the rollback
    helm rollback "${APP_NAME_SHORT}" $TARGET_REVISION
    exit 1
  fi

  # Update the old version (oldSlot) to the stage configuration and wait for it to become ready
  helm upgrade "${APP_NAME_SHORT}" ./kubernetes/helm/app/"${APP_NAME_SHORT}" --set database.uri_env_${oldSlot}=mysql-stage.stage-db --set microservice.current_environment_${oldSlot}=stage --set microservice.image.repository_${oldSlot}=${ECR_REGISTRY}/${ECR_REPO_NAME} --set microservice.image.tag_${oldSlot}=1.${REPOSITORY_TAG} --reuse-values --reuse-values
  
  if ! kubectl rollout status deployment/${APP_NAME_SHORT}-${oldSlot} -n ${NAMESPACE} --timeout=300s; then
    echo "Deployment failed. Starting rollback..."
    CURRENT_REVISION=$(helm history ${APP_NAME_SHORT} --max 1 --output json | jq '.[0].revision')

    # Calculate the target revision for rolling back 4 versions
    TARGET_REVISION=$((CURRENT_REVISION - 4))

    # Perform the rollback
    helm rollback "${APP_NAME_SHORT}" $TARGET_REVISION
    exit 1
  fi
fi