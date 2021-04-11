
window.onload = function(){


var testStr = `formatMessage({ id: 'app.settings.menu.focus' }),
<FormattedMessage id = "app.settings.perferences.save" ></FormattedMessage>
`;

const str = `formatMessage({id:'app.settings.menu.focus'}),
<FormattedMessage id="app.settings.perferences.save"></FormattedMessage>
id:'测试1' id="测试2"`;


 //const regex = /formatMessage\(\{id:\s?\'(.*)\'\}\).*\<FormattedMessage\s+id=\"(.*)\"\>/gm;





const regex = /formatMessage\(\{\s*id\s*:\s?['"](.*)['"]\s*\}\)/gm;
const regex1 = /<FormattedMessage\s*id\s*=\s*['"](.*)['"]\s*\>/gm;








	
	debugger
	if (regex.exec(str) !== null) {
	  console.log(RegExp.$1)
	  console.log(RegExp.$2)
	} 

}