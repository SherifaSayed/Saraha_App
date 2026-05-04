import { HttpAppError } from "./app-errors.js";


export class ConflictException extends HttpAppError {
 
constructor(message="Confilct",details=null){
  super(message, 409, "conflice", details)
}
}

export class NotFoundException extends HttpAppError {
   constructor(message="NotFound",details=null){
  super(message, 404, "Not found", details)
}
}

export class BadRequestException extends HttpAppError {

constructor(message="Bad Request",details=null){
  super(message, 400, "Bad Request",details)
}
}