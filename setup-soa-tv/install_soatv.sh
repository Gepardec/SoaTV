#!/bin/bash

if [ x$1 = x ]; then
	echo "Usage: $0 wildfly-release downloads_dir [instance name] [port offset] [installation dir] [jboss version]"
	exit 1;	
fi

WILDFLY_RELEASE=${1}
DOWNLOADS_DIR=${2-"$HOME/Downloads"}
INSTANZ=${3-soatv}
OFFSET=${4-100}
HOME_DIR=${5-"~/soatv"}

echo $INSTANZ

#sind programme installiert?

GIT="git"
MAVEN="mvn"

hash $GIT 2>/dev/null || { echo >&2 "I require $GIT but it's not installed.  Aborting."; exit 1; }
hash $MAVEN 2>/dev/null || { echo >&2 "I require $MAVEN but it's not installed.  Aborting."; exit 1; }

#checking whether installation dir alraedy exists
if [ -e $HOME_DIR/$INSTANZ ]
then
	echo "Installation folder ($HOME_DIR/$INSTANZ) already exists. Aborting."
	exit 1
fi

#erstellen verzeichnisse wenn notwendig.
#mkdir -p "../$INSTANZ"

#download JBSS if required
JBSS=`pwd`/JBSS/bin/
if [ ! -e $JBSS"setup.sh" ]
then
	$GIT clone https://github.com/objectbay/JBSS.git
fi

#setup jbss
$JBSS/setup.sh -i $INSTANZ -r $WILDFLY_RELEASE -d $DOWNLOADS_DIR -o $OFFSET -j $HOME_DIR/$INSTANZ 

#build and deploy artifacts
#

$MAVEN -f ../soatv/pom.xml -DskipTests package

#configure jboss
	#creating deployment file
	if [ ! -e configs/soatv/08_deploy_soatv.conf ]
	then
		touch configs/soatv/08_deploy_soatv.conf
		echo "deploy `pwd`/../soatv/soatv-web/target/soatv-web.war" >> configs/soatv/08_deploy_soatv.conf
	fi

~/bin/$INSTANZ configure configs/soatv



