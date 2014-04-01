package com.objectbay.soatv.test;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import com.objectbay.soatv.utils.MessageFieldUtils;
import com.objectbay.soatv.utils.MessageFieldUtils.MessageField;

public class MessageFieldUtilsTest {
	public static class TestUtilsClass{
		@MessageField
		public String field1;
		public String field2;
	}
	
	private TestUtilsClass testUtilsClassInstance;
	
	@Before
	public void setUp(){
		testUtilsClassInstance = new TestUtilsClass();
		testUtilsClassInstance.field1 = "field1 value";
		testUtilsClassInstance.field2 = "field2 value";
	}
	
	@Test
	public void annotatedFieldValueIsReturnedCorrectly(){
		Object value = MessageFieldUtils.getFieldValue("field1", testUtilsClassInstance);
		assertTrue(value instanceof String);
		assertEquals("field1 value", value);
	}
	
	@Test(expected=IllegalArgumentException.class)
	public void notAnnotatedFieldValueThrowsException(){
		MessageFieldUtils.getFieldValue("field2", testUtilsClassInstance);
	}
	
	@Test
	public void annotatedFieldValueIsSetCorrectly(){
		MessageFieldUtils.setFieldValue("field1", "new field1 value", testUtilsClassInstance);
		assertEquals("new field1 value", testUtilsClassInstance.field1);
	}
	
	@Test(expected=IllegalArgumentException.class)
	public void notAnnotatedFieldSetValueThrowsException(){
		MessageFieldUtils.setFieldValue("field2", "new field2 value", testUtilsClassInstance);
	}
	
	@Test
	public void annotatedFieldsAreUpdatedCorrectly(){
		TestUtilsClass testUtilsClassInstance2 = new TestUtilsClass();
		MessageFieldUtils.copyProps(testUtilsClassInstance, testUtilsClassInstance2);
		assertEquals(testUtilsClassInstance.field1, testUtilsClassInstance2.field1);
		assertEquals(null, testUtilsClassInstance2.field2);
	}
}
