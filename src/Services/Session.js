const Session = (function session() {
  let username = '';
  let userid = 0;
  let usertype = '';

  const getName = function getname() {
    return username;
  };

  const getId = function getid() {
    return userid;
  };

  const getUser = function getuser() {
    return usertype;
  };

  const getStatus = function getstatus() {
    if (username === '' || userid === 0 || usertype || '') {
      return false;
    }
    return true;
  };

  const setName = function setname(name) {
    username = name;
  };

  const setId = function setid(id) {
    userid = id;
  };

  const setUsertype = function setusertype(user) {
    usertype = user;
  };

  return {
    getName,
    setName,
    getId,
    setId,
    getUser,
    setUsertype,
    getStatus,
  };
}());

export default Session;
