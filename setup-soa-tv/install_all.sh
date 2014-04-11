#!/bin/bash

if [ x$1 = x ]; then
	echo "Usage: $0 path/to/jboss-zip [instance name]"
	exit 1;	
fi


if [ x$2 = x ]; then
	INSTANZ="jbpm6"

else
	INSTANZ=$2
fi

echo $INSTANZ

#sind programme installiert?

GIT="git"
MAVEN="mvn"
TERMINAL="gnome-terminal"

hash $GIT 2>/dev/null || { echo >&2 "I require $GIT but it's not installed.  Aborting."; exit 1; }
hash $MAVEN 2>/dev/null || { echo >&2 "I require $MAVEN but it's not installed.  Aborting."; exit 1; }
hash $TERMINAL 2>/dev/null || { echo >&2 "I require $TERMINAL but it's not installed.  Aborting."; exit 1; }


#erstellen verzeichnisse.
mkdir "db"
mkdir "deployments"
mkdir "git"
mkdir "repositories"
mkdir "repositories/kie"
mkdir "workspace"

#download JBSS
$GIT clone https://github.com/objectbay/JBSS.git
JBSS=`pwd`/JBSS/bin/

#download Projects
$GIT clone https://github.com/objectbay/SoaTV.git

#download kie workbench
#download h2
$MAVEN package
mv ./deployments/h2.jar ./db/

#setup jbss
$JBSS/setup.sh -i $INSTANZ -z $1

#editierten .jbpmrc
echo "JBOSS_OPTS=\"-Dorg.kie.demo=false -Dorg.kie.example=false -Dorg.uberfire.nio.git.dir=`pwd`/git -Dorg.guvnor.m2repo.dir=`pwd`/repositories/kie\"" >> ~/.$INSTANZ"rc"

#start h2
$TERMINAL -e "java -jar db/h2.jar -tcp"

#configure jboss
~/bin/$INSTANZ configure configs/




