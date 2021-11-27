new Vue({
	el: '#app',
	data: {
		navbar_items: [
			{title: 'Список лиг', href:'#'},
			{title: 'Список команд', href:'#'},
			{title: 'Календарь лиги', href:'#'},
			{title: 'Календарь одной команды', href:'#'},
		]
	},
	methods: {

	},
	computed: {

	}
});

var x = new XMLHttpRequest();
x.open("GET", new URL("Access-Control-Allow-Origin: https://google.com/search"));
x.send();
x.onload = function() {
	alert(`Загружено: ${x.status}`);
}
x.onerror = function() { 
  alert(`Ошибка соединения`);
};
