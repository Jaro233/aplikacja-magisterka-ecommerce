#!/bin/bash

# Define the IP and hostnames
IP="127.0.0.1"
HOSTNAME1="local-ecommerce-prod.devopshub.org"
HOSTNAME2="local-ecommerce-stage.devopshub.org"

# Command to add or update hosts file
echo "$IP $HOSTNAME1 $HOSTNAME2" | tee -a /c/Windows/System32/drivers/etc/hosts > /dev/null

echo "Hosts file updated successfully."
