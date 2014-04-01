package com.objectbay.soatv.camel;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.builder.xml.Namespaces;

/**
 * A Camel Java DSL Router
 */
public class MyRouteBuilder extends RouteBuilder {

    /**
     * Let's configure the Camel routing rules using Java code...
     */
	
	private Namespaces ns = new Namespaces("o", "http://bergfix.at/order/1.0");
    public void configure() {
    	initialRouter();
    	mainRouters();
    }

    
    private void initialRouter(){
        // here is a sample which processes the input files
        // (leaving them in place - see the 'noop' flag)
        // then performs content based routing on the message using XPath
        from("jms:topic:soatvExampleTopic?username=user&password=user@123").process(new IdentityProcessor());
        //to("jms:topic:soatvTopic?username=user&password=user@123");
        	//.multicast().to("direct:journal", "direct:jboss"/*, "direct:router"*/);
    }
    
    private void mainRouters(){;
    	directJboss();
    	//directRouter();
    }
    
    private void directJboss() {
		/*from("direct:jboss")
		.to("log:at.objectbay.jboss.MSG?level=INFO").
		convertBodyTo(String.class).
		to("jms:topic:soatvTopic?username=user&password=user@123");*/
		
	}

	private void fileWriter(){
        // file writer
        from("activemq:london.records").to("file:target/london");
        from("activemq:invalid.records").to("file:target/invalid");
    }

}
