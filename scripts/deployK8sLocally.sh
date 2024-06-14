#!/bin/bash

action_kubectl="apply"
action_helm="install"
action_skaffold="run"

# Deploy resources in the init-namespace directory
# echo "Deploying resources in init-namespace directory..."
# kubectl ${action_kubectl} -f init-namespace/

# # Deploy secrets in the init-secrets directory
# echo "Deploying secrets in init-secrets directory..."
# kubectl ${action_kubectl}  -f init-secrets/

# # Deploy ConfigMaps and roles in the init-confimap-and-roles directory
# echo "Deploying ConfigMaps and roles in init-confimap-and-roles directory..."
# kubectl ${action_kubectl}  -f init-role-and-configmap/

# Deploy db and redis
# echo "Deploying db..."
# helm ${action_helm} mysql-prod helm/db/mysql -f ./helm/db/mysql/values-dev.yaml -n prod-db
# helm ${action_helm} redis-prod helm/db/redis -f ./helm/db/redis/values-dev.yaml -n prod-db

# Deploy cert-manager
echo "Deploying cert-manager..."
helm ${action_helm} cert-manager cert-manager/cert-manager -f ./helm/cert-manager/values-dev.yaml --namespace cert-manager 

# Deploy nginx-ingress controller
echo "Deploying nginx-ingress controller..."
helm ${action_helm} ingress-nginx ingress-nginx/ingress-nginx -f ./helm/ingress-nginx/values-dev.yaml --namespace ingress-nginx

# Deploy microservices
echo "Deploying app..."
cd ../
skaffold ${action_skaffold} -p dev
cd kubernetes

# Deploy metrics-server
# echo "Deploying metrics-server..."
# helm ${action_helm} metrics-server helm/metrics-server -f helm/metrics-server/values.yaml --namespace metrics-server

# Deploy vertical-pod-autoscaler crds
# echo "Deploy vertical-pod-autoscaler crds..."
# helm ${action_helm} vertical-pod-autoscaler fairwinds-stable/vpa

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

# # Loop until the user enters "OK"
# while true; do
#     echo "Please type 'ok' to continue"
#     read input

#     # Check if the input is exactly "OK"
#     if [ "$input" = "ok" ]; then
#         break # Exit the loop
#     else
#         echo "Invalid input, please try again."
#     fi
# done

# echo "You entered 'ok', proceeding..."

# helm delete mysql-stage -n stage-db

sleep 10

# Deploy monitoring
helm ${action_helm} prometheus prometheus-community/prometheus -f ./helm/monitoring/prometheus/values.yaml -n monitoring
kubectl patch ds prometheus-prometheus-node-exporter --type "json" -p '[{"op": "remove", "path" : "/spec/template/spec/containers/0/volumeMounts/2/mountPropagation"}]' -n monitoring
helm ${action_helm} grafana grafana/grafana -f ./helm/monitoring/grafana/values.yaml -n monitoring

# # Loop until the user enters "OK"
# while true; do
#     echo "Please type 'ok' to continue"
#     read input

#     # Check if the input is exactly "OK"
#     if [ "$input" = "ok" ]; then
#         break # Exit the loop
#     else
#         echo "Invalid input, please try again."
#     fi
# done

# echo "You entered 'ok', proceeding..."

# # Uninstall monitoring
# helm delete grafana -n monitoring
# helm delete prometheus -n monitoring
# helm delete metrics-server -n metrics-server

sleep 10

# Deploy logging
helm ${action_helm} elasticsearch bitnami/elasticsearch -f ./helm/logging/elasticsearch/values-dev.yaml -n logging 
helm ${action_helm} fluentbit helm/logging/fluentbit -f ./helm/logging/fluentbit/values-dev.yaml -n logging
helm ${action_helm} kibana bitnami/kibana -f ./helm/logging/kibana/values-dev.yaml -n logging 

echo "Deployment completed."