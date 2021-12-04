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
	console.log(response);
	console.log('Succesfully download!');
});
$.ajax({
  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
  url: "https://api.football-data.org/v2/competitions",
  dataType: 'json',
  type: 'GET',
}).done(function(response) {
	competitions = response;
	console.log(response);
	console.log('Succesfully download!');
});


function listTeamsClick() {
	var main = document.querySelector("#main");
	var resultHTML = "<div class='column' id='col'>";
	for(var i = 0; i < 10; i++) {
		resultHTML  = resultHTML + "<div class='teamsRef'><img class='imgTeams' src='" + teams['teams'][i]['crestUrl'] + "' alt='" + teams['teams'][i]['name'] + "'><a onclick='teamGames(" + teams['teams'][i]['id'] + ")'>" + teams['teams'][i]['name'] + "</a></div>";
	}
	resultHTML += "</div>"
	main.innerHTML = resultHTML;
}

function teamGames(teamCode) {
	var main = document.querySelector("#main");
	var games = []

	$.ajax({
	  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
	  url: "https://api.football-data.org/v2/teams/" + teamCode + "/matches",
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
		games = response;
		console.log(games);
		var resultHTML = "<div class='column' id='col'>";
		for(var i = 5; i < 25; i++) {
			var gameDate = new Date(games['matches'][i]['utcDate']);
			var year = gameDate.getFullYear();
			var month = gameDate.getMonth();
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
		main.innerHTML = resultHTML;
	});
}

function listLeguesClick() {
	var main = document.querySelector("#main");
	var resultHTML = "<div class='column' id='col'>";
	for(var i = 40; i < 65; i++) {
		if (competitions['competitions'][i]['code'] != null && competitions['competitions'][i]['code'].length > 0) {
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
	var games = []
	code = code + "";

	$.ajax({
	  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
	  url: "https://api.football-data.org/v2/competitions/" + code + "/matches",
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
		games = response;
		console.log(games);
		var resultHTML = "<div class='column' id='col'>";
		for(var i = 5; i < 25; i++) {
			var gameDate = new Date(games['matches'][i]['utcDate']);
			var year = gameDate.getFullYear();
			var month = gameDate.getMonth();
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
		main.innerHTML = resultHTML;
	});
}