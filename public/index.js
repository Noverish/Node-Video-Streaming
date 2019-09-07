function main() {
  const accessKey = window.localStorage.getItem('hyunsub-access-key');
  
  if(!accessKey) {
    window.location.href='/login'
  } else {
    var text = document.createTextNode('환영합니다! ' + window.localStorage.getItem('hyunsub-access-user'));
    document.getElementById('access-user').appendChild(text);
  }
}

main();