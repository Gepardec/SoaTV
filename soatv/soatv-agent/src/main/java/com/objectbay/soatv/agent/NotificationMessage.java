package com.objectbay.soatv.agent;

import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.objectbay.soatv.agent.NotificationMessage;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="id" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="node" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="component">
 *           &lt;complexType>
 *             &lt;simpleContent>
 *               &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
 *                 &lt;attribute name="type" type="{http://www.w3.org/2001/XMLSchema}string" />
 *               &lt;/extension>
 *             &lt;/simpleContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="status" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="body" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "id",
    "node",
    "component",
    "status",
    "body"
})
@XmlRootElement(name = "message")
public class NotificationMessage {
	
	private static Logger log = LoggerFactory.getLogger(NotificationMessage.class);

    @XmlElement(required = true)
    protected String id;
    @XmlElement(required = true)
    protected String node;
    @XmlElement(required = true)
    protected NotificationMessage.Component component;
    @XmlElement(required = true)
    protected String status;
    @XmlElement(required = true)
    protected String body;

    /**
     * Gets the value of the id property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setId(String value) {
    	this.id = value.replaceAll("-|:", "");
    }

    /**
     * Gets the value of the node property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNode() {
        return node;
    }

    /**
     * Sets the value of the node property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNode(String value) {
        this.node = value;
    }

    /**
     * Gets the value of the component property.
     * 
     * @return
     *     possible object is
     *     {@link Message.Component }
     *     
     */
    public NotificationMessage.Component getComponent() {
        return component;
    }

    /**
     * Sets the value of the component property.
     * 
     * @param value
     *     allowed object is
     *     {@link Message.Component }
     *     
     */
    public void setComponent(NotificationMessage.Component value) {
        this.component = value;
    }

    /**
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatus(String value) {
        this.status = value;
    }

    /**
     * Gets the value of the body property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBody() {
        return body;
    }

    /**
     * Sets the value of the body property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBody(String value) {
        this.body = value;
    }


    /**
     * <p>Java class for anonymous complex type.
     * 
     * <p>The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;simpleContent>
     *     &lt;extension base="&lt;http://www.w3.org/2001/XMLSchema>string">
     *       &lt;attribute name="type" type="{http://www.w3.org/2001/XMLSchema}string" />
     *     &lt;/extension>
     *   &lt;/simpleContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "value"
    })
    public static class Component {

        @XmlValue
        protected String value;
        @XmlAttribute(name = "type")
        protected String type;

        /**
         * Gets the value of the value property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getValue() {
            return value;
        }

        /**
         * Sets the value of the value property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setValue(String value) {
            this.value = value;
        }

        /**
         * Gets the value of the type property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getType() {
            return type;
        }

        /**
         * Sets the value of the type property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setType(String value) {
            this.type = value;
        }

    }
    
	public NotificationMessage(String id) {
		this.id = id.replaceAll("-|:", "");
	}
	
	public NotificationMessage() {
		// TODO Auto-generated constructor stub
	}
	
	/**
	 * Converts message to xml string
	 * @return
	 */
	public String toXMLString(){
		StringWriter writer = new StringWriter();
		try {
			JAXBContext context = JAXBContext.newInstance(NotificationMessage.class);            
			Marshaller m = context.createMarshaller();
			m.marshal(this, writer);
			return writer.toString();
		} catch (JAXBException e) {
			log.warn("{}", e);
			return null;
		}
	}
	
	public static NotificationMessage fromXMLString(String xml){
		JAXBContext jc;
		try {
			jc = JAXBContext.newInstance(NotificationMessage.class);
			Unmarshaller unmarshaller = jc.createUnmarshaller();
			StringReader reader = new StringReader(xml);
			NotificationMessage instance = (NotificationMessage) unmarshaller
					.unmarshal(reader);

			return instance;
		} catch (JAXBException e) {
			log.warn("{}", e);
			throw new RuntimeException(e);
		}
	}

}
