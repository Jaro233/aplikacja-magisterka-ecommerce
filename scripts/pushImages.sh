#!/bin/bash
REPOSITORY_PREFIX=j4ro123
docker push ${REPOSITORY_PREFIX}/frontend:latest
docker push ${REPOSITORY_PREFIX}/order-service:latest
docker push ${REPOSITORY_PREFIX}/cart-service:latest
docker push ${REPOSITORY_PREFIX}/user-service:latest
docker push ${REPOSITORY_PREFIX}/product-service:latest

