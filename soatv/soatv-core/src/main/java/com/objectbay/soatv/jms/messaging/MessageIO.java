package com.objectbay.soatv.jms.messaging;

import java.io.IOException;

/**
 * Interface provides methods that allow read and write messages
 * in different formats into internal message classes
 * @author eerofeev
 *
 */
public interface MessageIO {
		
	/**
	 * Initializes instance of MessageIO with the object representing message source, e.g. XML-string, JSON-string etc.
	 * @param source
	 */
	public void init(Object source);
	
	/**
	 * Returns message field value for the given field name
	 * @return
	 */
	public Object readProperty(String key);
	
	/**
	 * Sets field value for the given field name and
	 * returns the current instance of MessageIO
	 * @param id
	 * @return
	 */
	public MessageIO writeProperty(String key, Object value);
	/**
	 * Returns node id where the component holding the message is located
	 * @return
	 */
	
	/**
	 * Flushes written message data to the object representing message, e.g. JSON-String, XML-file etc.;
	 */
	public Object flush() throws IOException;
}
