#!/bin/bash

if [ x$1 = x ]; then
	echo "Usage: $0 path/to/wildfly-zip [instance name] [port offset] [installation dir]"
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
	#$GIT clone https://github.com/objectbay/JBSS.git
	# test stub
	cp -r ~/projects/test/JBSS `pwd` 
else
	#test stub
	rm $JBSS"jboss7"
	cp -r ~/projects/test/JBSS/bin/jboss7 $JBSS
	cp -r ~/projects/test/JBSS/bin/wildfly $JBSS
fi

#setup jbss
$JBSS/setup.sh -i $INSTANZ -z $1 -o $OFFSET -j $HOME_DIR/$INSTANZ -v 8

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



