package com.objectbay.requestforleave;

import com.objectbay.soatv.agent.Agent;


public class SendMessageToTopic {

	public static int count = 0;
	
	public static void send(String node){
		count++;
		System.out.println("SendMessageToTopic.send-"+count);
		Agent agent = new Agent();
		
		// setup JNDI lookup
		agent	
		//setup addresses
		.cf("/ConnectionFactory")
		.topic("queue/SoaTVQueue")		
		.node("JBPM")				// name of the node (e.g. jboss instance) that sends a message
		.component(node)	// name of the component (e.g. ws, servlet) that sends a message
		.id("SendMessageToTopic-"+count)	// unique id of message
		.status("sent").send();			// status ("sent"||"received" : component has sent || received some business message
	}
}
