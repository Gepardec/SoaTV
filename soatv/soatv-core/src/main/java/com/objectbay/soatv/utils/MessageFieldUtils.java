package com.objectbay.soatv.utils;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Field;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Helper class for extended manipulation of fields in messages
 * @author eerofeev
 *
 */
public class MessageFieldUtils {
	
	private static Logger log = LoggerFactory
			.getLogger(MessageFieldUtils.class);

	/**
	 * Annotates field that can be commonly accessed via MessageFieldUtils
	 * @author eerofeev
	 *
	 */
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.FIELD})
	public static @interface MessageField{}
	
	/**
	 * Returns value of the object field qualified by name, if
	 * field is annotated with {@link MessageField}
	 * @param field
	 * @param target
	 * @return
	 */
	public static Object getFieldValue(String field, Object target) {
		for(Field f : FieldUtils.getAllFields(target.getClass())){
			if(f.getName().equals(field) && f.isAnnotationPresent(MessageField.class)){
				boolean accessible = f.isAccessible();
				f.setAccessible(true);
				try {
					Object result = f.get(target);
					f.setAccessible(accessible);
					return result;
				} catch (IllegalArgumentException e) {
					log.warn("Error occured {}", e);
					return null;
				} catch (IllegalAccessException e) {
					log.warn("Error occured {}", e);
					return null;
				}
				
			}
		}
		log.warn("Given parameter {} not found", field);
		throw new IllegalArgumentException("given parameter " + field + " not found");
	}

	/**
	 * Sets value of the object field qualified by name, if
	 * field is annotated with {@link MessageField}
	 * @param field
	 * @param object
	 * @return
	 */
	public static void setFieldValue(String field, Object value, Object target) {
		for(Field f : FieldUtils.getAllFields(target.getClass())){
			if(f.getName().equals(field) && f.isAnnotationPresent(MessageField.class)){
				boolean accessible = f.isAccessible();
				f.setAccessible(true);
				try {
					f.set(target, value);
					f.setAccessible(accessible);
					return;
				} catch (IllegalArgumentException e) {
					log.warn("Error occured {}", e);
				} catch (IllegalAccessException e) {
					log.warn("Error occured {}", e);
				}
				
			}
		}
		log.warn("Given parameter {} not found", field);
		throw new IllegalArgumentException("given parameter " + field + " not found");
	}
	
	/**
	 * Removes all whitespaces from the begin and end of the string as well as
	 * new lines and tabs
	 * @param value
	 * @return
	 */
	public static String cleanValue(String value){
		if(value == null){
			return null;
		}
		return value.trim().replaceAll("\\n", "").replaceAll("\\t", "");
	}
	
	/**
	 * Updates annotated with {@link MessageField} properties of an object using properties of another object.
	 *
	 */
	public static void copyProps(Object source, Object destination){
		if(destination.getClass().isAssignableFrom(source.getClass())){
			Field[] fields = FieldUtils.getAllFields(source.getClass());
			
			for (Field f : fields) {
				if(!f.isAnnotationPresent(MessageField.class)){
					continue;
				}
				try {
					boolean accessibleForF = f.isAccessible();
					f.setAccessible(true);
					
					Field to = FieldUtils.getField(destination.getClass(), f.getName(), true);
					
					if(!to.isAnnotationPresent(MessageField.class)){
						continue;
					}
					
					boolean accessibleForTo = to.isAccessible();
					to.setAccessible(true);
					
					to.set(destination, f.get(source));
					f.setAccessible(accessibleForF);
					to.setAccessible(accessibleForTo);
					
				} catch (IllegalArgumentException e) {
					log.warn("{}", e);
				} catch (IllegalAccessException e) {
					log.warn("{}", e);
				} catch (SecurityException e) {
					log.warn("{}", e);
				}
			}
		}
	}
}
