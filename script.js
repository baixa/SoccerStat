new Vue({
	el: '#app',
	data: {
		navbar_items: [
			{title: 'Список лиг', href:'#', onclick:'listLeguesClick()'},
			{title: 'Список команд', href:'#', onclick:'listTeamsClick()'},
		]
	},
	methods: {

	},
	computed: {

	}
});


var teams = []
var competitions = []


$.ajax({
  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
  url: "https://api.football-data.org/v2/teams",
  dataType: 'json',
  type: 'GET',
}).done(function(response) {
	teams = response;
});
$.ajax({
  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
  url: "https://api.football-data.org/v2/competitions",
  dataType: 'json',
  type: 'GET',
}).done(function(response) {
	competitions = response;
});


function listTeamsClick() {
	var main = document.querySelector("#main");
	var resultHTML = "<div class='column' id='col'>";
	for(var i = 0; i < 10; i++) {
		resultHTML += "<div class='teamsRef'><img class='imgTeams' src='" + teams['teams'][i]['crestUrl'] + "' alt='" + teams['teams'][i]['name'] + "'><a onclick='teamGames(" + teams['teams'][i]['id'] + ")'>" + teams['teams'][i]['name'] + "</a></div>";
	}
	resultHTML += "</div>"
	main.innerHTML = resultHTML;
}

function teamGames(teamCode) {
	teamCode = teamCode + "";
	var main = document.querySelector("#main");
	var games = []

	var elDateBegin = document.querySelector('#start');
	var dateBegin = new Date((elDateBegin === null? '2021-12-01' : elDateBegin.value));
	var elDateEnd = document.querySelector('#end');
	var dateEnd = new Date((elDateEnd === null? '2021-12-10' : elDateEnd.value));

	main.innerHTML =  `<div id='formDate'><input type='date' id='start' required name='date-start' value='` + dateBegin.toISOString().substring(0,10) 
		+ `' ` + 
		` min='2021-01-01' max='2022-12-31'><input type='date' id='end' name='date-end' value='` + dateEnd.toISOString().substring(0,10) + `'` + 
		` min='2021-01-01' max='2022-12-31'><button id='btnDate' onclick='teamGames("` + teamCode + `")'>Показать</button></div>`;

	$.ajax({
	  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
	  url: "https://api.football-data.org/v2/teams/" + teamCode + "/matches",
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
		games = response;
		var resultHTML = "<div class='column' id='col'>";
		for(var i = 5; i < 25; i++) {
			var gameDate = new Date(games['matches'][i]['utcDate']);
			if (gameDate > dateEnd || gameDate < dateBegin) {
				continue;
			}
			var year = gameDate.getFullYear();
			var month = gameDate.getMonth() + 1;
			var day = gameDate.getDate();
			var hour = gameDate.getHours();
			var minute = gameDate.getMinutes();
			minute = (minute < 10) ? '0' + minute : minute;
			hour = (hour < 10) ? '0' + hour : hour;
			month = (month < 10) ? '0' + month : month;
			day = (day < 10) ? '0' + day : day;
			resultHTML  = resultHTML + "<div class='matchesRef'><p class='dateMatch'>" +
			 day + "." + month + "." + year + " " + hour + ":" + minute + "</p><p class='matchDescription'>" + games['matches'][i]['homeTeam']['name'] + " : " +
			  games['matches'][i]['awayTeam']['name'] + "</p>";
			if (games['matches'][i]['status'] == "FINISHED") {
				resultHTML = resultHTML + "<p class='resultMatch'>" + 
				games['matches'][i]['score']['fullTime']['homeTeam'] + ':' + games['matches'][i]['score']['fullTime']['awayTeam'];
			}
			resultHTML += "</div>"
		}
		resultHTML += "</div>"
		main.innerHTML = main.innerHTML + resultHTML;
	});
}

function listLeguesClick() {
	var main = document.querySelector("#main");
	var resultHTML = "<div class='column' id='col'>";
	for(var i = 0; i < 125; i++) {
		if (competitions['competitions'][i]['plan'] == 'TIER_ONE') {
			resultHTML  = resultHTML + `<div class='compRef'><a onclick="compGames('` + 
			competitions['competitions'][i]['code'] + `')">` + 
			competitions['competitions'][i]['name'] + "</a></div>";
		}
	}
	resultHTML += "</div>"
	main.innerHTML = resultHTML;
}

function compGames(code) {
	var main = document.querySelector("#main");
	var games = [];
	code = code + "";

	var elDateBegin = document.querySelector('#start');
	var dateBegin = new Date((elDateBegin === null? '2021-12-01' : elDateBegin.value));
	var elDateEnd = document.querySelector('#end');
	var dateEnd = new Date((elDateEnd === null? '2021-12-10' : elDateEnd.value));

	main.innerHTML =  `<div id='formDate'><input type='date' id='start' required name='date-start' value='` + dateBegin.toISOString().substring(0,10) + `' ` + 
		` min='2021-01-01' max='2022-12-31'><input type='date' id='end' name='date-end' value='` + dateEnd.toISOString().substring(0,10) + `'` + 
		` min='2021-01-01' max='2022-12-31'><button id='btnDate' onclick='compGames("` + code + `")'>Показать</button></div>`;

	$.ajax({
	  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
	  url: "https://api.football-data.org/v2/competitions/" + code + "/matches",
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
		games = response;
		var resultHTML = "<div class='column' id='col'>";
		for(var i = 0; i < games['matches'].length; i++) {
			var gameDate = new Date(games['matches'][i]['utcDate']);
			var today = new Date();
			if (gameDate > dateEnd || gameDate < dateBegin) {
				continue;
			}
			var year = gameDate.getFullYear();
			var month = gameDate.getMonth() + 1;
			var day = gameDate.getDate();
			var hour = gameDate.getHours();
			var minute = gameDate.getMinutes();
			minute = (minute < 10) ? '0' + minute : minute;
			hour = (hour < 10) ? '0' + hour : hour;
			month = (month < 10) ? '0' + month : month;
			day = (day < 10) ? '0' + day : day;
			resultHTML  = resultHTML + "<div class='matchesRef'><p class='dateMatch'>" +
			 day + "." + month + "." + year + " " + hour + ":" + minute + "</p><p class='matchDescription'>" + games['matches'][i]['homeTeam']['name'] + " : " +
			  games['matches'][i]['awayTeam']['name'] + "</p>";
			if (games['matches'][i]['status'] == "FINISHED") {
				resultHTML = resultHTML + "<p class='resultMatch'>" + 
				games['matches'][i]['score']['fullTime']['homeTeam'] + ':' + games['matches'][i]['score']['fullTime']['awayTeam'];
			}
			resultHTML += "</div>"
		}
		if (!resultHTML.includes('matchesRef')) {
			resultHTML += "<div class='matchesRef'><p class='matchDescription'>В ближайшее время " +
			"матчи данной лиги не проводятся</p></div>";
		}
		resultHTML += "</div>"
		main.innerHTML = main.innerHTML + resultHTML;
	});
}