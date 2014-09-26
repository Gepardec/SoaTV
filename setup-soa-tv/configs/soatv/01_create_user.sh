$JBOSS_HOME/bin/add-user.sh -u user -p user@123 -r ApplicationRealm -s -up application-users.properties -g user,guest -gp application-roles.properties
$JBOSS_HOME/bin/add-user.sh -u admin -p admin@123 -r ManagementRealm -s
