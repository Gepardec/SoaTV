#!/bin/bash

function printHelp {
	echo "
	+----------------------------------------------------------------------------+
	|                                   Usage:                                   |
	+----------------------------------------------------------------------------+
	| show brief help               | ./install.sh --help                        |
	+-------------------------------+--------------------------------------------+
	| dialog mode                   | ./install.sh --dialog                      |
	+-------------------------------+--------------------------------------------+
	| install JBPM demo application | ./install.sh --application=jbpm            |
	|                               |    --jbpm-jboss-zip=path/to/jboss-zip      |
	|                               |    [--jbpm-instance=name]                  |
	|                               |                                            |
	|                               | default instance name used : jbpm6         |
	+-------------------------------+--------------------------------------------+
	| install SOATV-WEB application | ./install.sh --application=soatv           |
	|                               |    --soatv-wildfly-release=wildfly-name    |
	|                               |    --downloads-dir=path/to/wildfly-dir     |
	|                               |    [--soatv-instance=name]                 |
	|                               |    [--soatv-port-offset=offset]            |
	|                               |                                            |
	|                               | default instance name used : soatv         |
	|                               | default port offset used for soatv : 100   |
	+-------------------------------+--------------------------------------------+
	| install both applications     | ./install.sh --application=full            |
	|                               |    --jbpm-jboss-zip=path/to/jboss-zip      |
	|                               |    --soatv-wildfly-release=wildfly-name    |
	|                               |    --downloads-dir=path/to/wildfly-dir     |
	|                               |    [--jbpm-instance=name]                  |
	|                               |    [--soatv-instance=name]                 |
	|                               |    [--soatv-port-offset=offset]            |
	+-------------------------------+--------------------------------------------+
	| common parameters             |                                            |
	|                               |    --home-dir                              |
	|                               | default home value used : ~/soat           |
	|                               |                                            |
	|                               |    --jboss-7                               |
	|                               | explicitly use configuration for jboss 7   |
	|                               |                                            |
	|                               |                                            |
	|                               |                                            |
	|                               |                                            |
	+-------------------------------+--------------------------------------------+
	";
	exit 0	
}

function checkJBPM {
	if [ "$JBPM_JBOSS_ZIP" == "" ]
	then
		echo "[ERROR] JBPM JBoss zip archive is not defined. Type $0 --help to see usage instructions"
		exit 0
	fi
}

function checkSOATV {
	if [ "$SOATV_WILDFLY_RELEASE" == "" ]
	then
		echo "[ERROR] SOATV Wildfly zip archive is not defined. Type $0 --help to see usage instructions"
		exit 0
	fi
}

# Displays simple prompt for the user input
# Expects non-empty input
# Args : $1 : user prompt
#	$2 : varname with the result to be exported
function nonEmptyPrompt () {
	local success=0		
	while [ $success == 0 ]; do

		echo $1
    		read -e -p "()" answer
   		local RES=$answer
		if [ ! -z "$RES" ]
		then
			success=1	
		fi
	done
	export $(echo $2)=$RES
	echo
}

# Displays simple prompt for the user input
# Expects non-empty or empty (on enter) input
# Args : $1 : user prompt
#	$2 : default value
#	$3 : varname with the result to be exported
function defaultValuePrompt () {
	echo $1
	
	read -e -p "($2)" answer
	if [ -z "$answer" ]; then
		export $(echo $3)=$2
	else
		export $(echo $3)=$answer
	fi
	echo
}

# constants
CON_JBPM=jbpm
CON_SOATV=soatv
CON_FULL=full

# default values
DEF_APPLICATION=$CON_JBPM
DEF_JBPM_INSTANCE=jbpm6
DEF_SOATV_INSTANCE=soatv
DEF_SOATV_PORT_OFFSET=100
DEF_HOME_DIR=~/soatv
DEF_FORCE_JBOSS_MAJOR_CODE=8
DEF_DOWNLOADS_DIR=$HOME/Downloads

#initial values
APPLICATION=$DEF_APPLICATION
HOME_DIR=$DEF_HOME_DIR
JBPM_JBOSS_ZIP=
JBPM_INSTANCE=$DEF_JBPM_INSTANCE
SOATV_WILDFLY_RELEASE=
DOWNLOADS_DIR=$DEF_DOWNLOADS_DIR
SOATV_INSTANCE=$DEF_SOATV_INSTANCE
SOATV_PORT_OFFSET=$DEF_SOATV_PORT_OFFSET
FORCE_JBOSS_MAJOR_CODE=$DEF_FORCE_JBOSS_MAJOR_CODE

# dialog mode
function startDialog {
	echo "What kind of installation would you like to perform?"
	echo "	1) JBPM (default)"
	echo "	2) SOATV"
	echo "	3) full"
	
	while true; do
    		read -e -p "(1)" answer
		if [ -z "$answer" ]; then
   			export APPLICATION=jbpm
			break
		fi
   		case $answer in
        		1)
				export APPLICATION=jbpm
				break
				;;
			\n)
				export APPLICATION=jbpm
				break
				;;
        		2)
				export APPLICATION=soatv
				break
				;;
        		3)
				export APPLICATION=full
				break
				;;
        		*) echo "Please select 1, 2 or 3";;
    		esac
	done

#-----------------------------------------------------------------------

	defaultValuePrompt "Enter installation directory ($DEF_HOME_DIR is default)?" "$DEF_HOME_DIR" "HOME_DIR"

#-----------------------------------------------------------------------
	
	if [ "$APPLICATION" != "$CON_SOATV" ]
	then 		
		nonEmptyPrompt "Enter path to the JBoss zip archive for the JBPM" "JBPM_JBOSS_ZIP"
		defaultValuePrompt "Enter name of jboss instance for JBPM ($DEF_JBPM_INSTANCE is default)?" "$DEF_JBPM_INSTANCE" "JBPM_INSTANCE"
	fi
#-----------------------------------------------------------------------

	if [ "$APPLICATION" != "$CON_JBPM" ]
	then
		nonEmptyPrompt "Enter path to the Wildfly zip archive for the SOATV" "SOATV_WILDFLY_RELEASE"
		defaultValuePrompt "Enter name of wildfly instance for SOATV ($DEF_SOATV_INSTANCE is default)?" "$DEF_SOATV_INSTANCE" "SOATV_INSTANCE"
		defaultValuePrompt "Enter value of wildfly instance port offset ($DEF_SOATV_PORT_OFFSET is default)?" "$DEF_SOATV_PORT_OFFSET" "SOATV_PORT_OFFSET"
		defaultValuePrompt "Enter major jboss code /7 for EAP 6.x; 8 for Wildfly/ ($DEF_FORCE_JBOSS_MAJOR_CODE is default)?" "$DEF_FORCE_JBOSS_MAJOR_CODE" "FORCE_JBOSS_MAJOR_CODE"		
	fi
}

# processing of inputed command
if [ $# == 0 ]
then
    printHelp
fi

while test $# -gt 0; do
        case "$1" in
                --help)
                        printHelp
			;;
                --dialog)
                        startDialog
			shift
			;;        
                --application*)
                        export APPLICATION=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
                --home-dir*)
                        export HOME_DIR=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
              	--jbpm-jboss-zip*)
                        export JBPM_JBOSS_ZIP=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
              	--jbpm-instance*)
                        export JBPM_INSTANCE=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
              	--soatv-wildfly-release*)
                        export SOATV_WILDFLY_RELEASE=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
              	--downloads-dir*)
                        export DOWNLOADS_DIR=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
              	--soatv-instance*)
                        export SOATV_INSTANCE=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
              	--soatv-port-offset*)
                        export SOATV_PORT_OFFSET=`echo $1 | sed -e 's/^[^=]*=//g'`
                        shift
                        ;;
              	--jboss-7*)
                        export FORCE_JBOSS_MAJOR_CODE=7
                        shift
                        ;;
                *)
		        printHelp
			;;
                        
        esac
done

#creating home dir

mkdir -p $HOME_DIR

#processing of input
if [ "$APPLICATION" == "$CON_JBPM" ]
then
	checkJBPM
	echo "[INFO] Start start jbpm for zip $JBPM_JBOSS_ZIP and instance $JBPM_INSTANCE"
	./install_jbpm.sh $JBPM_JBOSS_ZIP $JBPM_INSTANCE $HOME_DIR
fi

if [ "$APPLICATION" == "$CON_SOATV" ]
then
	checkSOATV
	echo "[INFO] Script: ./install.sh --application=$CON_SOATV --soatv-wildfly-release=$SOATV_WILDFLY_RELEASE --downloads-dir=$DOWNLOADS_DIR --soatv-instance=$SOATV_INSTANCE --soatv-port-offset=$SOATV_PORT_OFFSET"	
	echo "[INFO] Start installation for zip $SOATV_WILDFLY_RELEASE, instance $SOATV_INSTANCE and port-offset $SOATV_PORT_OFFSET $FORCE_JBOSS_MAJOR_CODE"
	./install_soatv.sh $SOATV_WILDFLY_RELEASE $DOWNLOADS_DIR $SOATV_INSTANCE $SOATV_PORT_OFFSET $HOME_DIR $FORCE_JBOSS_MAJOR_CODE
fi

if [ "$APPLICATION" == "$CON_FULL" ]
then
	checkJBPM	
	checkSOATV
	echo "[INFO] Start jbpm for zip $JBPM_JBOSS_ZIP and instance $JBPM_INSTANCE"
	./install_jbpm.sh $JBPM_JBOSS_ZIP $JBPM_INSTANCE $HOME_DIR
	echo "[INFO] Script: ./install.sh --application=$CON_JBPM --soatv-wildfly-release=$SOATV_WILDFLY_RELEASE --downloads-dir=$DOWNLOADS_DIR --soatv-instance=$SOATV_INSTANCE --soatv-port-offset=$SOATV_PORT_OFFSET"	
	echo "[INFO] Start installation for zip $SOATV_WILDFLY_RELEASE, instance $SOATV_INSTANCE and port-offset $SOATV_PORT_OFFSET $FORCE_JBOSS_MAJOR_CODE"
	./install_soatv.sh $SOATV_WILDFLY_RELEASE $DOWNLOADS_DIR $SOATV_INSTANCE $SOATV_PORT_OFFSET $HOME_DIR $FORCE_JBOSS_MAJOR_CODE
fi

