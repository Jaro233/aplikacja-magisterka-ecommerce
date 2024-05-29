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
kubectl ${action_kubectl} -f init-role/

# Deploy db and redis
echo "Deploying db and redis..."
helm install mysql-prod helm/db -n prod-db
helm install mysql-stage helm/db -n stage-db
helm install redis-prod helm/redis -n prod-db
helm install redis-stage helm/redis -n stage-db

# Deploy cert-manager
echo "Deploying cert-manager..."
helm install cert-manager jetstack/cert-manager --namespace cert-manager --set installCRDs=true

# Deploy nginx-ingress controller
echo "Deploying nginx-ingress controller..."
helm ${action_helm} ingress-nginx ingress-nginx/ingress-nginx -f helm/ingress-nginx/values.yaml --namespace ingress-nginx

# Deploy microservices
echo "Deploying app..."
helm ${action_helm} product-service helm/app/vets-service 
helm ${action_helm} cart-gateway helm/app/api-gateway 
helm ${action_helm} order-service helm/app/customers-service 
helm ${action_helm} user-service helm/app/visits-service 
helm ${action_helm} frontend helm/app/frontend 

# Deploy metrics-server
echo "Deploying metrics-server..."
helm install metrics-server metrics-server/metrics-server --set replicas=2 --namespace metrics-server

# Deploy vpa crds
echo "Deploy vpa crds..."
helm install my-vpa fairwinds-stable/vpa --version 4.4.6

# Deploy autoscaling
echo "Deploying autoscaling..."
kubectl ${action_kubectl} -f init-autoscaling/

# Deploy ingress and cluster resources in the init-ingress-and-cluster directory
echo "Deploying ingress and clusterissuer resources in init-ingress-and-clusterissuer directory..."
kubectl ${action_kubectl} -f init-ingress-and-clusterissuer/clusterissuer.yaml
kubectl ${action_kubectl} -f init-ingress-and-clusterissuer/ingress.yaml

# Deploy monitoring
helm ${action_helm} prometheus prometheus-community/prometheus -f helm/monitoring/prometheus/values.yaml -n monitoring
helm ${action_helm} grafana grafana/grafana -f helm/monitoring/grafana/values.yaml -n monitoring

# Deploy logging
helm ${action_helm} elasticsearch bitnami/elasticsearch -f helm/logging/elasticsearch/values.yaml -n logging 
helm ${action_helm} fluentbit helm/logging/fluentbit -n logging 
helm ${action_helm} kibana bitnami/kibana -f helm/logging/kibana/values.yaml -n logging

echo "Deployment completed."