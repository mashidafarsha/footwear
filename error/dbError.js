

module.exports = {
    handleDuplicate: (error) => {
      const value = error.keyValue.categoryName
  
      const message = `Already Exist ${value} Please use another value!`
  
      return message
    },
    couponduplicate:(error)=>{
      const value1=error.keyValue.coupenid

      let  message=`Already Exist  ${value1}.Please use another value!`
      
      return message

    
    }
  };