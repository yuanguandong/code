const reg = /((\w+):\/\/)?([\w.]+[.]{1})[\w\-@?^=%&\/~+#]+/g;

var str = "fdsafdas http://www.baidu.com https://baike.baidu.com/item/%E9%9B%B6%E4%BB%B6%E5%8F%B7/9963086?fr=aladdin fdasfdsafd";

const collection = new Map()
while ((matched = reg.exec(str))) {
  console.log('matched',matched)
  const url = matched[0];
  const index = matched.index
  collection.set(`{{${index}}}`,url)
  str = str.replace(url, `<a href="{{${index}}}" target="_blank"></a>`);
}
for(let [key,value] of collection){
  str = str.replace(key,decodeURI(value))
}

console.log(str);
console.log(collection);

debugger;
