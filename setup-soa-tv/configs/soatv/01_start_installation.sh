#!/bin/sh

SELF_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ ! X$FORCE_JBOSS_MAJOR_CODE	 = X ] && [ -f $SELF_DIR/04_enable_websocket.conf_temp ] && [ $FORCE_JBOSS_MAJOR_CODE -lt 8 ]
then
	cp $SELF_DIR/04_enable_websocket.conf_temp $SELF_DIR/04_enable_websocket.conf
fi
