Ideas and Concepts behind SoaTV
===============================

Motivation
----------

When presenting middleware solutions you have two choices. Either you
stick with powerpoint or you do some live-demos. With the first you have
have nice pictures or even animations but you might have a credibility problem.
Does that really work as easy as in the powerpoints?

With live-demos there is oten the problem that the audience doesn't see what
really happens. The presentor configures something or starts some jobs, but
the visible result is only some entries in a logfile. This is not very
entertaining for the audience.

SoaTV should bring more visibility and entertainment to live-demos of
middleware products. The audience should be able to _see_ what happens not only
to know what happens because of explanation or some log entries.

The Visualisation
-----------------

SoaTV shows messages when you push them through the system. We visualise nodes, 
components and messages. When a messages is sent from one component to another
we draw an arrow between the components, which vanishes after a short period
of time. When new nodes or components are added to the system, they immediately
appear on the screen.

SoaTV is a Java-Script based web application. This allows the audience to point 
their mobile devices to the web page and follow the demo on their own device, 
in case the presenter uses a publicly visible server.

The Architecture
----------------

There are two main parts. The backend demonstrates middleware components and
shows the use of middleware components like BPM (Business Process Managements)
or an ESB (Enterprise Service Bus). The frontend visualises the backend
components. The frontend is based on a WildFly server which uses web sockets
(JEE7) to communicate with the browser. With this the browser can be notified
immediately  about changes in the backend. The backend communicates with the
frontend via a JMS topic. This shows decoupled communication between components.

Integration Principles
----------------------

With SoaTV we want to demonstrate application integration in a bus
architecture. It follows the principle _Don't configure the integration_.
If possible, the only configuration should be a single bus-address.

If we write to queues, these are available on localhost, if we lookup
services we do the lookup on localhost even if the service is provided
on a remote host. The integraton is done via clustering or via distributed
service repositories.

The Runtime
-----------

The whole demo application can be executed on a notebook, but the target
platform is a cloud provider like Amazon Web Services (AWS).

SoaTV is designed for a demo environment and not for production monitoring
or thousands of clients.

The Development Environment
---------------------------

All source code is open source and available on GitHub.
