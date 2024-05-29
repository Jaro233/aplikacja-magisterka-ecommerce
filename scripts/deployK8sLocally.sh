#!/bin/bash

action_kubectl="apply"
action_helm="install"

# Deploy resources in the init-namespace directory
echo "Deploying resources in init-namespace directory..."
kubectl ${action_kubectl} -f init-namespace/

# Deploy secrets in the init-secrets directory
echo "Deploying secrets in init-secrets directory..."
kubectl ${action_kubectl}  -f init-secrets/

# Deploy ConfigMaps and roles in the init-confimap-and-roles directory
echo "Deploying ConfigMaps and roles in init-confimap-and-roles directory..."
kubectl ${action_kubectl}  -f init-role/

# Deploy db and redis
echo "Deploying db..."
helm ${action_helm} mysql-prod helm/db -f ./helm/db/values.yaml --set primary.resourcesPreset=small -n prod-db
helm ${action_helm} mysql-stage helm/db -f ./helm/db/values.yaml --set primary.resourcesPreset=small -n stage-db
helm ${action_helm} redis-prod helm/redis -f ./helm/redis/values.yaml -n stage-db
helm ${action_helm} redis-stage helm/redis -f ./helm/redis/values.yaml -n stage-db

# Deploy cert-manager
echo "Deploying cert-manager..."
helm install cert-manager jetstack/cert-manager --namespace cert-manager --set installCRDs=true

# Deploy nginx-ingress controller
echo "Deploying nginx-ingress controller..."
helm install ingress-nginx ingress-nginx/ingress-nginx --set controller.replicaCount=1 --namespace ingress-nginx

# Deploy microservices
echo "Deploying app..."
helm ${action_helm} api-gateway helm/app/api-gateway -f ./helm/app/api-gateway/values.yaml --set microservice.resources.limits.cpu=200m --set microservice.resources.requests.cpu=200m --set microservice.livenessProbe.enabled=false --set microservice.readinessProbe.enabled=false
helm ${action_helm} customers-service helm/app/customers-service -f ./helm/app/customers-service/values.yaml --set microservice.resources.limits.cpu=200m --set microservice.resources.requests.cpu=200m --set microservice.livenessProbe.enabled=false --set microservice.readinessProbe.enabled=false
helm ${action_helm} vets-service helm/app/vets-service -f ./helm/app/vets-service/values.yaml --set microservice.resources.limits.cpu=200m --set microservice.resources.requests.cpu=200m --set microservice.livenessProbe.enabled=false --set microservice.readinessProbe.enabled=false
helm ${action_helm} visits-service helm/app/visits-service -f ./helm/app/visits-service/values.yaml --set microservice.resources.limits.cpu=200m --set microservice.resources.requests.cpu=200m --set microservice.livenessProbe.enabled=false --set microservice.readinessProbe.enabled=false

# Deploy metrics-server
echo "Deploying metrics-server..."
helm install metrics-server metrics-server/metrics-server --set replicas=1 --namespace metrics-server

# Deploy autoscaling
echo "Deploying autoscaling..."
kubectl ${action_kubectl} -f init-autoscaling/

sleep 20

# Deploy ingress and cluster resources in the init-ingress-and-cluster directory
echo "Deploying ingress and clusterissuer resources in init-ingress-and-clusterissuer directory..."
kubectl ${action_kubectl} -f init-ingress-and-clusterissuer/clusterissuer.yaml
kubectl ${action_kubectl} -f init-ingress-and-clusterissuer/ingress-local.yaml

# update hosts file
../scripts/updateHostsFile.sh

# Loop until the user enters "OK"
while true; do
    echo "Please type 'ok' to continue"
    read input

    # Check if the input is exactly "OK"
    if [ "$input" = "ok" ]; then
        break # Exit the loop
    else
        echo "Invalid input, please try again."
    fi
done

echo "You entered 'ok', proceeding..."

helm delete mysql-stage -n stage-db

sleep 10

# Deploy monitoring
helm ${action_helm} prometheus prometheus-community/prometheus -f ./helm/monitoring/prometheus/values.yaml -n monitoring
kubectl patch ds prometheus-prometheus-node-exporter --type "json" -p '[{"op": "remove", "path" : "/spec/template/spec/containers/0/volumeMounts/2/mountPropagation"}]' -n monitoring
helm ${action_helm} grafana grafana/grafana -f ./helm/monitoring/grafana/values.yaml -n monitoring

# Loop until the user enters "OK"
while true; do
    echo "Please type 'ok' to continue"
    read input

    # Check if the input is exactly "OK"
    if [ "$input" = "ok" ]; then
        break # Exit the loop
    else
        echo "Invalid input, please try again."
    fi
done

echo "You entered 'ok', proceeding..."

# Uninstall monitoring
helm delete grafana -n monitoring
helm delete prometheus -n monitoring
helm delete metrics-server -n metrics-server

sleep 10

# Deploy logging
helm ${action_helm} elasticsearch bitnami/elasticsearch -f ./helm/logging/elasticsearch/values.yaml --set master.replicaCount=1 --set data.replicaCount=1 --set coordinating.replicaCount=1 --set ingest.replicaCount=1 -n logging 
helm ${action_helm} fluentbit helm/logging/fluentbit -f ./helm/logging/fluentbit/values.yaml --set resources.limits.cpu=200m --set resources.requests.cpu=200m -n logging
helm ${action_helm} kibana bitnami/kibana -f ./helm/logging/kibana/values.yaml --set master.resourcesPreset=small --set volumePermissions.resourcesPreset=small --set livenessProbe.enabled=false --set readinessProbe.enabled=false -n logging 

echo "Deployment completed."