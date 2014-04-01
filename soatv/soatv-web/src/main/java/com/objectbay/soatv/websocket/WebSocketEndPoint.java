package com.objectbay.soatv.websocket;

import java.io.IOException;

import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.objectbay.soatv.core.SoaTV;
import com.objectbay.soatv.websocket.messaging.Messaging.MessageSender;
import com.objectbay.soatv.websocket.messaging.MessagingContext;

@ServerEndpoint("/soatv")
public class WebSocketEndPoint {
	
	@Inject
	private SoaTV soaTV;
	@Inject
	private MessagingContext messagingContext;
	
	public WebSocketEndPoint() {
	}
	
    @OnMessage
    public void onMessage(String message) {
        messagingContext.getMessenger().onMessage(message);
    }
    
    @OnOpen
    public void onOpen(final Session session) {
    	MessageSender messageSender = new MessageSender(){
			public void sendMessage(String msg) throws IOException {
				session.getBasicRemote().sendText(msg);
			}
		};
		soaTV.getMessagingContexts().add(messagingContext);
		messagingContext.setSession(session);
		messagingContext.getMessenger().setMessageSender(messageSender);
		messagingContext.getMonitor().addListener(messagingContext);
    }
    
    @OnClose
    public void onClose(CloseReason reason) {
    	messagingContext.getMessenger().onClose(reason);
    	if(messagingContext.getMonitor() != null){
    		messagingContext.getMonitor().removeListener(messagingContext);
    	}
    	soaTV.destroyMessagingContext(messagingContext);
    }
}
