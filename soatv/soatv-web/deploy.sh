#!/bin/sh
echo "Deploying "$1

/home/eerofeev/EAP/wildfly-8/bin/jboss-cli.sh --connect --controller=localhost:9990 --user="jbossadmin" --password="jbossadmin@123" --command="deploy --force "$1
