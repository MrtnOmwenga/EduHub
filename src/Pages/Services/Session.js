const Session = (function() {

    let username = ""
    let email = ""

    const getName = function() {
        return username;
    };

    const getEmail = function() {
        return email;
    };
    
    const setName = function(name) {
        username = name;     
    };

    const setEmail = function(email) {
        username = email;     
    };

    return {
        getName: getName,
        setName: setName,
        getEmail: getEmail,
        setEmail: setEmail
      }
})();

export default Session