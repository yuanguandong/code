
    function formatParams(params) {
      const search = new URLSearchParams(params)
      return search.toString()
    }

    function ajax(options = {
      type: 'GET',
      dataType: 'json'
    }) {
      const {
        type,
        dataType,
        data: params
      } = options
      const typeUper = type.toUpperCase()
      let xhr = new XMLHttpRequest()
      if (typeUper === 'GET') {
        xhr.open('GET', option.url + '?' + formatParams(params))
        xhr.send(null);
      } else if (typeUper === 'POST') {
        xhr.open('GET', option.url, true)
        xhr.setRequestHeader('Content-type',"application/x-www-form-urlencoded")
        xhr.send(params)
      }
    }
