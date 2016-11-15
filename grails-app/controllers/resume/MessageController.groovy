package resume

class MessageController {
	
	def messageService;
	
    def index() { }
	
	def guestbook() {
		def messages = messageService.getMessages(params)
		[messages: messages, messageCount: Message.count()]
	}
	
	def saveMessage(params){
		messageService.saveMessage(params)
		redirect(action: 'guestbook')
	}
}
