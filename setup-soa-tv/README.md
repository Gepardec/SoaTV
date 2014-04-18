SetupSoaTV
==========

This Project sets up a JBoss with Kie Workbench and SoaTV Demonstration application

Prerequisites
-------------

* Linux (tested with Fedora)
* Maven
* Git
* EAP 6.2 (for Kie Workbench)
* JBoss Wildfly (for demo app)

Quickstart
----------

	Usage: ./install.sh [parameters]

	where the following parameters are supported:
	--help				- show brief help
	--dialog			- start installation in the dialog mode
	--application=<type>		- installation mode (type=jbpm for installation of Kie Workbench; type=soatv for installation of SoaTV Demonstration application; type=full for installation of both applications)
	--home-dir=<path>		- path to the directory of installation (default value is path=~/soatv)
	--jbpm-jboss-zip=<file>		- path to the jboss eap 6 zip archive
	--soatv-wildfly-zip=<file>	- path to the jboss wildfly zip archive
	--jbpm-instance=<name>		- name of jboss eap instance for Kie Workbench (default value is name=jbpm6)
	--soatv-instance=<name>		- name of wildfly instance for SoaTV Demonstration application (default value is name=soatv)
	--soatv-port-offset=<port>	- port offset for wildfly instance for SoaTV Demonstration application (default value is port=100)

What it does
------------

This will clone JBSS.

Kie Workbench installation:

	The KIE Workbench war file will be downloaded. (~100MB)
	A EAP 6.2 instance will be configured and started.
	Open your browser and navigate to: http://localhost:8080/kie-wb-distribution-wars-6.0.0.Final-eap-6_1
	You than can log in with wirnse wirnse@123. -> see users in configs/01_create_user.sh
	With "instanceName stop" JBoss will be shutdown.

SoaTV Demonstration application installation:
	A Wildlfy instance will be configured and started.
	Open your browser and navigate to: http://localhost:#port/soatv-web
		where #port = 8080 + port_offset (e.g. for default offset=100 #port=8180 and application will be available under http://localhost:8180/soatv-web)

With "instanceName stop" JBoss/Wildfly will be shutdown.
With "instanceName start" JBoss/Wildfly will be started.
"instanceName status" displays the current status of the instance.

For more information about JBSS visit `https://github.com/objectbay/JBSS`


