class logDetailsObj {
    nameAction = null;
    description ='';
    isSucceeded = true;
    constructor(nameAction,description, isSucceeded ) {
        this.nameAction = nameAction;
        this.description =description; 
        this.isSucceeded = isSucceeded; 
    }
}

module.exports = logDetailsObj;
