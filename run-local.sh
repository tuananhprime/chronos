#!/bin/sh
set -eu
cd "$(dirname "$0")"
exec ./mvnw -B spring-boot:run -Dspring-boot.run.profiles=local
