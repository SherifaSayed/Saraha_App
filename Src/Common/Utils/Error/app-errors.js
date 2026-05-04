
export  class HttpAppError extends Error {
  
    constructor(message="Internal Server Error",statusCode=500, code ="internal_erro", details=null ){
        super(message,{cause:{status:statusCode}})
        this.message=message; 
        this.statusCode=statusCode||500;
        this.code=code || "Internal Server Error";
        this.details=details||null
    }
}