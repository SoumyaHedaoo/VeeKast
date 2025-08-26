/**
 * A higher order function wrapper which return a executable function wrapperd in trycatch
 * 
 * @param {function} fn -a async function to be wrwpped in try-catch block
 * @returns {Promise<void>}
 * @throws {error} -throw error if function exe fails to express's error handling middleware
 */

const expressAsyncHandler =(fn)=>{
    return async (req , res , next)=>{
        try {
            await fn(req , res , next);
        } catch (error) {
            console.log("operation failed in EXPRESSasyncHandler , ERROR : " , error);
            throw error;
        }
    }
    
}
export {expressAsyncHandler};