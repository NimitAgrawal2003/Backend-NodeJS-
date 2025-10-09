// wrapper function
const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
};

export { asyncHandler };



/*The asyncHandler utility is used to wrap asynchronous route handlers in Express.
Its main purpose is to catch errors from async functions and pass them to Express’s error-handling middleware, so you don’t need to write try/catch in every route.

Benefits:

Simplifies async code in controllers.
Prevents unhandled promise rejections.
Centralizes error handling. */

/* or 

const asyncHandler = (fn) => async (req,res,next) => {
    try{
    await fn(req,res,next)
    } catch(error){
     res.status(err.code) || 500).json({
        success:false,
        message:err.message
     })
     }
    }

    */
