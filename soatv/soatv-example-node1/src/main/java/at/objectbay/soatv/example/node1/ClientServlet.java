package at.objectbay.soatv.example.node1;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.inject.Inject;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.objectbay.soatv.agent.Agent;

@WebServlet("/ClientServlet")
public class ClientServlet extends HttpServlet {
	private static final long serialVersionUID = -4257270508512265869L;
	
	@Inject
	private Agent agent;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		agent.cf("/ConnectionFactory").topic("topic/soatvTopic");
		
		PrintWriter out = response.getWriter();

		out.println("Session ID: " + request.getSession().getId());

		if (request.getSession().getAttribute("test") == null) {
			out.println("New session. Current session is empty.");

			request.getSession().setAttribute("test", new Integer(1));
			System.out.println("Here we start with a new session");

			for (int i = 0; i < 50; i++) {
				byte[] buffer = new byte[2048];
				for (int x = 0; x < 2048; x++) {
					buffer[x] = 100;
				}
				request.getSession().setAttribute("binary." + i, buffer);
			}

		} else {
			Integer value = (Integer) request.getSession().getAttribute("test");
			out.println("Existing session: Value is " + value);

			request.getSession().setAttribute("test",
					new Integer(value.intValue() + 1));
		}

		String msg = "Session ID: " + request.getSession().getId() + " Value:"
				+ (Integer) request.getSession().getAttribute("test");
		System.out.println("Store: " + msg);
		String result = sendMessages(this.getServletContext());
		out.println("Messages sento to the JMS Provider: \n" + result);
	}

	private Connection sendMessage(String msg) {

		//String destinationName = "queue/sampleQueue";
		String destinationName = "topic/soatvExampleTopic";
		Context ic;
		ConnectionFactory cf;
		Connection connection = null;

		try {
			ic = new InitialContext();
			cf = (ConnectionFactory) ic.lookup("/ConnectionFactory");
			//Queue queue = (Queue) ic.lookup(destinationName);
			Topic topic = (Topic) ic.lookup(destinationName);
			connection = cf.createConnection();
			Session session = connection.createSession(false,
					Session.AUTO_ACKNOWLEDGE);
			MessageProducer publisher = session.createProducer(/*queue*/ topic);

			connection.start();

			TextMessage message = session.createTextMessage(msg);
			publisher.send(message);
			
			// notify soatv
			agent
			.node("My JBoss")
			.component("Client Servlet")
			.id(message.getJMSMessageID())
			.status("sent").send();
			
		} catch (Exception exc) {
			exc.printStackTrace();
		} finally {

			if (connection != null) {
				try {
					connection.close();
				} catch (JMSException e) {
					e.printStackTrace();
				}
			}
		}
		return connection;
	}
	
	private String readFile(String pathname, ServletContext ctx) throws IOException {
        InputStream ins = ctx.getResourceAsStream(pathname);
        StringBuffer b = new StringBuffer();
        try {
            if (ins != null) {
                InputStreamReader isr = new InputStreamReader(ins);
                BufferedReader reader = new BufferedReader(isr);
                
                String word = "";
                while ((word = reader.readLine()) != null) {
                    b.append(word);
                }
            }
        } finally {
        	
        }
        
        return b.toString();
	}
	
	private String sendMessages(ServletContext ctx){
	StringBuffer buffer = new StringBuffer();
		try {
		for(int i = 0; i < 5; i++){
			try {
				String content = readFile("/data/message"+Integer.toString(i)+".xml", ctx);
				
				sendMessage(content);
				System.out.println("Message sent: " + content);
				buffer.append(content);
				buffer.append(System.getProperty("line.separator"));
				
				//send reporting message
				
				Thread.sleep(1000);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	} catch (InterruptedException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
		
		return buffer.toString();
}
}
