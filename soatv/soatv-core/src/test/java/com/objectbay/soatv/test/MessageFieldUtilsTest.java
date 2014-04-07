package com.objectbay.soatv.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

import com.objectbay.soatv.utils.MessageFieldUtils;

public class MessageFieldUtilsTest {
	public static class TestUtilsClass{
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
	public void feldValueIsReturnedCorrectly(){
		Object value = MessageFieldUtils.getFieldValue("field1", testUtilsClassInstance);
		assertTrue(value instanceof String);
		assertEquals("field1 value", value);
	}
	
	@Test
	public void fieldValueIsSetCorrectly(){
		MessageFieldUtils.setFieldValue("field1", "new field1 value", testUtilsClassInstance);
		assertEquals("new field1 value", testUtilsClassInstance.field1);
	}
	
	@Test
	public void fieldsAreUpdatedCorrectly(){
		TestUtilsClass testUtilsClassInstance2 = new TestUtilsClass();
		MessageFieldUtils.copyProps(testUtilsClassInstance, testUtilsClassInstance2);
		assertEquals(testUtilsClassInstance.field1, testUtilsClassInstance2.field1);
		assertEquals(testUtilsClassInstance.field2, testUtilsClassInstance2.field2);
	}
}
