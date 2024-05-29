#!/bin/bash

set -e
TIMEOUT=300 # Set timeout to 5 minutes.
INTERVAL=10 # Check every 10 seconds.
end=$((SECONDS+TIMEOUT))
while [ $SECONDS -lt $end ]; do
  # Get the status of pods with the env=stage label
  POD_STATUSES=$(kubectl get pods -l env=stage -o=jsonpath='{.items[*].status.phase}')
  
  # Check if all pods are in the Running state
  if [[ $(echo $POD_STATUSES | grep -c "Running") -eq $(echo $POD_STATUSES | wc -w) ]]; then
    echo "All pods with label env=stage are running."
    break
  else
    echo "Waiting for all pods with label env=stage to be in Running state..."
  fi
  
  # Exit loop if timeout is reached
  if [ $SECONDS -ge $end ]; then
    echo "Timeout reached. Not all pods are in Running state."
    exit 1
  fi
  
  sleep $INTERVAL
done