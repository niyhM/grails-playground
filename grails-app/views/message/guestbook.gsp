<!DOCTYPE html>
<html>
<head>
<meta name="layout" content="main" />
<title>GuestBook</title>
</head>
<body>
	<header>
		<h2>Guestbook</h2>
</header>
	<section class="wrapper style5">
		<div class="inner"><br> 
			<g:each in="${messages}" var="message" status="i">
				<div class = guestmessage>
					<i>${message.content}</i>
					<br>
					- ${message.name}, ${message.dateCreated}
					<br>
				</div>
			</g:each>
			
			<g:paginate controller="message" action="guestbook" total="${messageCount}"/>
			
			<hr>
			<br>
			<g:form name="guestForm"
				url="[controller:'message', action:'saveMessage']">
				Name: <g:textField name="name" />
				<br>
				Message: <g:textArea name="content" rows="3" />
				<br>
				<g:actionSubmit value="Save" action="saveMessage" />
			</g:form></div>
</section>
</body>
</html>