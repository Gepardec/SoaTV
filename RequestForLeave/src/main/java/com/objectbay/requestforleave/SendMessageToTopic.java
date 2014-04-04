package com.objectbay.requestforleave;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.objectbay.soatv.agent.Agent;


public class SendMessageToTopic {

	private static Logger log = LoggerFactory.getLogger(SendMessageToTopic.class);
	
	public static void send(Long id,String node, String method){
		log.info("SendMessageToTopic-"+id+": "+node+" "+method);		
		Agent agent = new Agent();
		agent	
		.cf("/ConnectionFactory")
		.topic("topic/soatvTopic")		
		.node(node)				
		.component(node)	
		.id(id.toString())	
		.status(method).send();			
	}
}
