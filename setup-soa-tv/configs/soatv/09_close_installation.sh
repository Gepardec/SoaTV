#!/bin/sh

SELF_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ -f "$SELF_DIR/04_enable_websocket.conf" ]
then
	rm $SELF_DIR/04_enable_websocket.conf
fi

echo "INSTALLATION COMPLETE"

