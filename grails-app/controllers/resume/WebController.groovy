package resume

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class WebController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index() {		
    }
	
	def test(){
	}
}
