package at.objectbay.requestforleave;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jbpm.test.JbpmJUnitBaseTestCase;
import org.junit.Test;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.manager.RuntimeEngine;
import org.kie.api.runtime.manager.RuntimeManager;
import org.kie.api.runtime.process.ProcessInstance;
import org.kie.api.task.TaskService;
import org.kie.api.task.model.TaskSummary;

public class RequestForLeaveTest extends JbpmJUnitBaseTestCase {

	
	public RequestForLeaveTest(){
		super(true,true);
	}
	
	@Test
	public void daysIsTwoAndSuperiorAcceptsRequestForLeave(){
		RuntimeManager runtimeManager = createRuntimeManager("com/objectbay/requestforleave/RequestForLeave.bpmn2");
		
		RuntimeEngine runtimeEngine = getRuntimeEngine(null);
		KieSession kieSession = runtimeEngine.getKieSession();
		TaskService taskService = runtimeEngine.getTaskService();
		String employee = "krisv";
		int days = 2;
		String superior = "john";
		boolean requestAccepted = true;
		String locale = "en-UK";
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("employee", employee);
		ProcessInstance processInstance = kieSession.startProcess("RequestForLeave", params);
		
		//Send Request For Leave activity
		List<TaskSummary> tasks = taskService.getTasksAssignedAsPotentialOwner(employee, locale);
		assertEquals(1, tasks.size());
		TaskSummary requestForLeaveTask = tasks.get(0);		
		taskService.start(requestForLeaveTask.getId(), employee);
		Map<String, Object> sendRequestForLeaveParams = new HashMap<String, Object>();
		sendRequestForLeaveParams.put("days", days);
		sendRequestForLeaveParams.put("superior", superior);
		taskService.complete(requestForLeaveTask.getId(), employee, sendRequestForLeaveParams);
		
		//Accept or decline ROF
		tasks = taskService.getTasksAssignedAsPotentialOwner(superior, locale);
		assertEquals(1, tasks.size());
		TaskSummary acceptOrDeclineRFLTask = tasks.get(0);
		taskService.start(acceptOrDeclineRFLTask.getId(), superior);
		Map<String,Object> acceptOrDeclineRFLParams = new HashMap<String, Object>();
		acceptOrDeclineRFLParams.put("requestAccepted", requestAccepted);
		taskService.complete(acceptOrDeclineRFLTask.getId(), superior, acceptOrDeclineRFLParams);
		
		assertProcessInstanceCompleted(processInstance.getId(), kieSession);
		
		runtimeManager.disposeRuntimeEngine(runtimeEngine);
		runtimeManager.close();
	}
	
	@Test
	public void daysIsTwoAndSuperiorDeclinesRequestForLeave(){
		RuntimeManager runtimeManager = createRuntimeManager("com/objectbay/requestforleave/RequestForLeave.bpmn2");
		
		RuntimeEngine runtimeEngine = getRuntimeEngine(null);
		KieSession kieSession = runtimeEngine.getKieSession();
		TaskService taskService = runtimeEngine.getTaskService();
		
		String employee = "krisv";
		int days = 2;
		String superior = "john";
		boolean requestAccepted = false;
		String locale = "en-UK";
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("employee", employee);
		
		ProcessInstance processInstance = kieSession.startProcess("RequestForLeave", params);
		
		//Send Request For Leave activity
		List<TaskSummary> tasks = taskService.getTasksAssignedAsPotentialOwner(employee, locale);
		assertEquals(1, tasks.size());
		TaskSummary requestForLeaveTask = tasks.get(0);		
		taskService.start(requestForLeaveTask.getId(), employee);
		Map<String, Object> sendRequestForLeaveParams = new HashMap<String, Object>();
		sendRequestForLeaveParams.put("days", days);
		sendRequestForLeaveParams.put("superior", superior);
		taskService.complete(requestForLeaveTask.getId(), employee, sendRequestForLeaveParams);
				
		//Accept or decline ROF
		tasks = taskService.getTasksAssignedAsPotentialOwner(superior, locale);
		assertEquals(1, tasks.size());
		TaskSummary acceptOrDeclineRFLTask = tasks.get(0);
		taskService.start(acceptOrDeclineRFLTask.getId(), superior);
		Map<String,Object> acceptOrDeclineRFLParams = new HashMap<String, Object>();
		acceptOrDeclineRFLParams.put("requestAccepted", requestAccepted);
		taskService.complete(acceptOrDeclineRFLTask.getId(), superior, acceptOrDeclineRFLParams);
		
		assertProcessInstanceCompleted(processInstance.getId(), kieSession);
		
		runtimeManager.disposeRuntimeEngine(runtimeEngine);
		runtimeManager.close();
	}
	
	@Test
	public void daysIsOneRequestGetsAcceptedAutomatically(){
		RuntimeManager runtimeManager = createRuntimeManager("com/objectbay/requestforleave/RequestForLeave.bpmn2");
		
		RuntimeEngine runtimeEngine = getRuntimeEngine(null);
		KieSession kieSession = runtimeEngine.getKieSession();
		TaskService taskService = runtimeEngine.getTaskService();
		
		String employee = "krisv";
		int days = 1;
		String superior = "john";
		boolean requestAccepted = false;
		String locale = "en-UK";
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("employee", employee);
		ProcessInstance processInstance = kieSession.startProcess("RequestForLeave", params);
		
		//Send Request For Leave activity
		List<TaskSummary> tasks = taskService.getTasksAssignedAsPotentialOwner(employee, locale);
		assertEquals(1, tasks.size());
		TaskSummary requestForLeaveTask = tasks.get(0);		
		taskService.start(requestForLeaveTask.getId(), employee);
		Map<String, Object> sendRequestForLeaveParams = new HashMap<String, Object>();
		sendRequestForLeaveParams.put("days", days);
		sendRequestForLeaveParams.put("superior", superior);
		taskService.complete(requestForLeaveTask.getId(), employee, sendRequestForLeaveParams);
		
		assertProcessInstanceCompleted(processInstance.getId(), kieSession);
		
		runtimeManager.disposeRuntimeEngine(runtimeEngine);
		runtimeManager.close();
	}
	
}
