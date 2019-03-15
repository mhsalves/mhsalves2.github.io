function startLoading(prefix, className) {
  var element = document.querySelector(className);
  loopLoading(prefix, element);
}

function loopLoading(prefix, element, count = 0) {
  setTimeout(function (){
    element.innerHTML = prefix;
    for (var i = 0; i < count; i++) {
      element.innerHTML = element.innerHTML + '.';
    }

    var newCount = count + 1;
    if (newCount > 3) { newCount = 0; }

    loopLoading(prefix, element, newCount);
  }, 1000);
}
