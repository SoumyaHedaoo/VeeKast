/**
 * higher order function to wrap a async function in try-catch block
 * 
 * 
 * @param {function} fn- the async functin to wrap
 * @returns {async function} a function that execute give function within a try catch block
 * @throws {error} if function fails returns error
 */
const asyncTCWrapper=(fn)=>{
    return async (...args)=>{
        try {
            return await fn(...args);
        } catch (error) {
            console.log("error caught in wrapper" , error);
            throw error;
        }
    }
}

export {asyncTCWrapper};