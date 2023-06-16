const Session = (function() {

    let username = ""
    let userid = 0
    let usertype = ""
    let status = false

    const getName = function() {
        return username;
    };

    const getId = function() {
        return userid;
    };

    const getUser = function() {
        return usertype;
    };

    const getStatus = function() {
        if (username === "" || userid === 0 || usertype || "") {
            return false
        }else {
            return true
        }
    }
    
    const setName = function(name) {
        username = name;     
    };

    const setId = function(id) {
        userid = id;     
    };

    const setUsertype = function(user) {
        usertype = user;
    };

    const setStatus = function(bool) {
        status = bool;
    }

    return {
        getName: getName,
        setName: setName,
        getId: getId,
        setId: setId,
        getUser: getUser,
        setUsertype: setUsertype,
        getStatus: getStatus,
        setStatus: setStatus
      }
})();

export default Session