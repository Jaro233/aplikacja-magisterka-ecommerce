#!/bin/bash

action_kubectl="delete"
action_helm="uninstall"

# Uninstall logging
helm ${action_helm} kibana -n logging
helm ${action_helm} fluentbit -n logging
helm ${action_helm} elasticsearch -n logging 

# Uninstall monitoring
helm ${action_helm} grafana -n monitoring
helm ${action_helm} prometheus -n monitoring

# Delete ingress and cluster resources in the init-ingress-and-cluster directory
echo "Deleting ingress and clusterissuer resources in init-ingress-and-clusterissuer directory..."
kubectl ${action_kubectl}  -f init-ingress-and-clusterissuer/

# Uninstall autoscaling
kubectl ${action_kubectl} -f init-autoscaling/

# Uninstall vpa crds
helm ${action_helm} my-vpa fairwinds-stable/vpa

# Uninstall metrics-server
helm ${action_helm} metrics-server -n metrics-server

# Uninstall app
helm ${action_helm} cart-service
helm ${action_helm} user-service 
helm ${action_helm} product-service
helm ${action_helm} order-gateway 
helm ${action_helm} frontend

# Uninstall nginx-ingress controller
helm ${action_helm} ingress-nginx -n ingress-nginx

# Uninstall cert-manager
helm ${action_helm} cert-manager -n cert-manager

# Uninstall db
helm ${action_helm} mysql-prod -n prod-db
helm ${action_helm} mysql-stage -n stage-db
helm ${action_helm} redis-prod -n prod-db
helm ${action_helm} redis-stage -n stage-db

# Delete ConfigMaps and roles in the init-confimap-and-roles directory
echo "Deleting ConfigMaps and roles in init-confimap-and-roles directory..."
kubectl ${action_kubectl}  -f init-role/

# Delete secrets in the init-secrets directory
echo "Deleting secrets in init-secrets directory..."
kubectl ${action_kubectl}  -f init-secrets/

# Delete resources in the init-namespace directory
echo "Deleting resources in init-namespace directory..."
kubectl ${action_kubectl} -f init-namespace/

echo "Deployment rollback completed."
