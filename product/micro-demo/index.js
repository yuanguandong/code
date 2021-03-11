const apps ={
  sub1:'sub1',
  sub2:'sub2'
} 


function loadJS(url, callback) {
  var script = document.createElement('script'),
    fn = callback || function () { };
  script.type = 'text/javascript';
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    script.onload = function () {
      fn();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}



$('.menu').on('click', function (e) {
  const appKey = e.target.dataset.id
  $.ajax({
    type: "post",
    url: `${apps[appKey]}/index.html`,
    dataType: "html",
    data: {},
    async: true,
    success: function (html) {
      const reg = new RegExp(/<body[^>]*>([\s\S]*)<\/body>/)
      let htmlEntry = html.match(reg)[1]
      const sandbox = $(htmlEntry)
      let scriptArr = []
      for (key in Object.entries(sandbox)) {
        const tag = Object.entries(sandbox)[key][1]
        if (tag.nodeName && tag.nodeName.toLowerCase() == 'script') {
          scriptArr.push(tag)
        }
      }
      htmlEntry = htmlEntry.replaceAll(`href="`, `href="${apps[appKey]}/`)
      const shadow = document.querySelector('#app');
      shadow.innerHTML = htmlEntry;
      scriptArr.map(item => {
        let src = item.src.replace(window.location.origin, window.location.origin + '/' + apps[appKey])
        loadJS(src)
      })
    }
  });


})