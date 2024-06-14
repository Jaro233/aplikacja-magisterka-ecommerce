#!/bin/bash
action_skaffold="run"
skaffold_profile="dev"

# Deploy resources in the init-config
echo "Deploying app..."
skaffold ${action_skaffold} -f skaffold/skaffold.init-config.yaml -p ${skaffold_profile}

# Deploy cert-manager
echo "Deploying cert-manager and nginx-ingress..."
skaffold ${action_skaffold} -f skaffold/skaffold.ingressContollerAndCertMan.yaml -p ${skaffold_profile}

# Deploy microservices
echo "Deploying app..."
skaffold ${action_skaffold} -f skaffold/skaffold.app.yaml -p ${skaffold_profile}

# Deploy autoscaling
echo "Deploying autoscaling..."
skaffold ${action_skaffold} -f skaffold/skaffold.autoscaling.yaml -p ${skaffold_profile}

# Deploy ingress and cluster resources in the init-ingress-and-cluster directory
echo "Deploying ingress and clusterissuer resources in init-ingress-and-clusterissuer directory..."
skaffold ${action_skaffold} -f skaffold/skaffold.ingressAndClusterIssuer.yaml -p ${skaffold_profile}

# Deploy monitoring
echo "Deploying monitoring..."
skaffold ${action_skaffold} -f skaffold/skaffold.monitoring.yaml -p ${skaffold_profile}
kubectl patch ds prometheus-prometheus-node-exporter --type "json" -p '[{"op": "remove", "path" : "/spec/template/spec/containers/0/volumeMounts/2/mountPropagation"}]' -n monitoring

# Deploy logging
echo "Deploying logging..."
skaffold ${action_skaffold} -f skaffold/skaffold.logging.yaml -p ${skaffold_profile}

# update hosts file
scripts/updateHostsFile.sh

echo "Deployment completed."