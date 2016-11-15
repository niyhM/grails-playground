package resume

import grails.orm.PagedResultList
import grails.transaction.Transactional

@Transactional
class MessageService {

    def serviceMethod() {
	
    }
	
	PagedResultList getMessages(params){
		System.out.println(params.max)
		return Message.list(max: 10, offset: params.offset, sort: "dateCreated", order: "desc")
	}
	
	def saveMessage(params){
		params.content = params.content.length() > 255 ? params.content.substring(0,255) : params.content
		System.out.println(params.content)
		def message = new Message(name: params.name, content: params.content)
		message.save(failOnSave: true)
	}
}
