#!/bin/bash

if [ x$1 = x ]; then
	echo "Usage: $0 path/to/wildfly-zip [instance name] [port offset] [installation dir] [jboss version]"
	exit 1;	
fi


if [ x$2 = x ]; then
	INSTANZ="soatv"

else
	INSTANZ=$2
fi

if [ x$3 = x ]; then
	OFFSET=100

else
	OFFSET=$3
fi

if [ x$4 = x ]; then
	HOME_DIR="~/soatv"

else
	HOME_DIR=$4
fi

if [ ! x$5 = x ]; then
	export FORCE_JBOSS_MAJOR_CODE=$5
	echo "Use JBOSS Version $FORCE_JBOSS_MAJOR_CODE"
fi

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
$JBSS/setup.sh -i $INSTANZ -z $1 -o $OFFSET -j $HOME_DIR/$INSTANZ 

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



