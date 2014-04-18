#!/bin/bash

if [ x$1 = x ]; then
	echo "Usage: $0 path/to/jboss-zip [instance name] [installation dir]"
	exit 1;	
fi


if [ x$2 = x ]; then
	INSTANZ="jbpm6"

else
	INSTANZ=$2
fi

if [ x$3 = x ]; then
	HOME_DIR="~/soatv"

else
	HOME_DIR=$3
fi

echo $INSTANZ

#sind programme installiert?

GIT="git"
MAVEN="mvn"

hash $GIT 2>/dev/null || { echo >&2 "I require $GIT but it's not installed.  Aborting."; exit 1; }
hash $MAVEN 2>/dev/null || { echo >&2 "I require $MAVEN but it's not installed.  Aborting."; exit 1; }

#erstellen verzeichnisse.
mkdir "jbpm_install"
mkdir "jbpm_install/git"
mkdir "jbpm_install/repositories"
mkdir "jbpm_install/repositories/kie"

#download JBSS
$GIT clone https://github.com/objectbay/JBSS.git
JBSS=`pwd`/JBSS/bin/

#download kie workbench
$MAVEN package

#setup jbss
$JBSS/setup.sh -i $INSTANZ -z $1 -j $HOME_DIR/$INSTANZ

#editierten .jbpmrc
echo "JBOSS_OPTS=\"-Dorg.kie.demo=false -Dorg.kie.example=false -Dorg.uberfire.nio.git.dir=`pwd`/jbpm_install/git -Dorg.guvnor.m2repo.dir=`pwd`/jbpm_install/repositories/kie\"" >> ~/.$INSTANZ"rc"

$MAVEN -f ../jbpm/pom.xml -Dkie-repository=./jbpm_install/repositories/kie -DskipTests deploy
$MAVEN -f ../soatv/pom.xml -Dkie-repository=./jbpm_install/repositories/kie -DskipTests deploy

#configure jboss
~/bin/$INSTANZ configure configs/jbpm



