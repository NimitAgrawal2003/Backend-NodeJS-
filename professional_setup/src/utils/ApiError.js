class ApiError extends Error{   // Error class already present in node js
    constructor(statusCode,message="Something went wrong",errors = [],stack =""){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this,message = message
        this.success = false
        this.errors = errors

        if(stack){                   // can be avoided
            this.stack = stack
        } else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}

export {ApiError}