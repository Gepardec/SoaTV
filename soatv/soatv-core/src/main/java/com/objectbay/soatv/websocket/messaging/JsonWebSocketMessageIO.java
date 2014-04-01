package com.objectbay.soatv.websocket.messaging;

import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.objectbay.soatv.jms.messaging.MessageIO;
import com.objectbay.soatv.utils.CDIUtils.DefaultWebSocketMessageIO;
import com.objectbay.soatv.websocket.messaging.WebSocketMessage.Action;

@DefaultWebSocketMessageIO
public class JsonWebSocketMessageIO implements MessageIO {
	
	Action action;
	String data;

	@Override
	public void init(Object source) {
		if(source instanceof String){
			Gson gson = new Gson();
			JsonWebSocketMessageIO newInstance = gson.fromJson((String)source, JsonWebSocketMessageIO.class);
			action = newInstance.action;
			data = newInstance.data;
		}
		
	}

	@Override
	public Object readProperty(String key) {
		if(key.equals("action")){
			return action;
		} else if(key.equals("data")) {
			return data;
		}
		
		return null;
	}

	@Override
	public MessageIO writeProperty(String key, Object value) {
		if(key.equals("action")){
			if(value instanceof Action){
				action = (Action) value;
			}
		} else if(key.equals("data")){
			if(value instanceof String){
				data = (String) value;
			} else {
				data = (new GsonBuilder().serializeNulls().create()).toJson(value);
			}
		}
		return this;
	}

	@Override
	public Object flush() throws IOException {
		return (new GsonBuilder().serializeNulls().create()).toJson(this);
	}

}
