SetupSoaTV
==========

This Project sets up a JBoss with Kie Workbench

Prerequisites
-------------

* Linux (tested with Fedora)
* Maven
* Git
* EAP 6.2

Quickstart
----------

	Usage: ./install_all.sh <path/to/JBoss-zip-file> [instancename]

default instancename is "jbpm6"

What it does
------------

This will clone JBSS. Also the KIE Workbench war file will be downloaded. (~100MB)

A EAP 6.2 instance will be configured and started.

Open your browser and navigate to: http://localhost:8080/kie-wb-distribution-wars-6.0.0.Final-eap-6_1

You than can log in with wirnse wirnse@123. -> see users in configs/01_create_user.sh

With "instanceName stop" JBoss will be shutdown. 

For more information about JBSS visit `https://github.com/objectbay/JBSS`

