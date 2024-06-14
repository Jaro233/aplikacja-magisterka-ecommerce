#!/bin/bash
action_skaffold="delete"
skaffold_profile="dev"

# Delete logging
echo "Deleting logging..."
skaffold ${action_skaffold} -f skaffold/skaffold.logging.yaml -p ${skaffold_profile}

# Delete monitoring
echo "Deleting monitoring..."
skaffold ${action_skaffold} -f skaffold/skaffold.monitoring.yaml -p ${skaffold_profile}

# Delete ingress and cluster resources in the init-ingress-and-cluster directory
echo "Deleting ingress and clusterissuer resources in init-ingress-and-clusterissuer directory..."
skaffold ${action_skaffold} -f skaffold/skaffold.ingressAndClusterIssuer.yaml -p ${skaffold_profile}

# Delete autoscaling
echo "Deleting autoscaling..."
skaffold ${action_skaffold} -f skaffold/skaffold.autoscaling.yaml -p ${skaffold_profile}

# Delete microservices
echo "Deleting app..."
skaffold ${action_skaffold} -f skaffold/skaffold.app.yaml -p ${skaffold_profile}

# Delete cert-manager
echo "Deleting cert-manager and nginx-ingress..."
skaffold ${action_skaffold} -f skaffold/skaffold.ingressContollerAndCertMan.yaml -p ${skaffold_profile}

# Delete resources in the init-config
echo "Deleting app..."
skaffold ${action_skaffold} -f skaffold/skaffold.init-config.yaml -p ${skaffold_profile}

echo "Deployment rollback completed."
