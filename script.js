new Vue({
	el: '#header',
	data: {
		navbar_items: [
			{title: 'Список лиг', href:'index.html?type=leagues'},
			{title: 'Список команд', href:'index.html?type=teams'},
		]
	}
});

const searchString = new URLSearchParams(window.location.search);

const type = searchString.get('type');
const idElem = searchString.get('code');
const paramDateBegin = searchString.get('dateBegin');
const paramDateEnd = searchString.get('dateEnd');

const apikey = readTextFile("api.txt");

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                apikey = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

var teams = []
var competitions = []

$.ajax({
  headers: { 'X-Auth-Token': apikey },
  url: "https://api.football-data.org/v2/teams",
  dataType: 'json',
  type: 'GET',
}).done(function(response) {
	teams = Object.assign({}, response);
});
$.ajax({
  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
  url: "https://api.football-data.org/v2/competitions",
  dataType: 'json',
  type: 'GET',
}).done(function(response) {
	competitions = Object.assign({}, response);
});

if(type != null){
	if(idElem == null){
		setTimeout(() => 
			{ 
				if(type == "leagues"){
					listLegues();
				}
				else if (type == "teams"){
					listTeams();
				}
			}, 1500);
	}
	else{
		if(type == "leagues"){
			compGames(competitions['competitions'][idElem]['code']);
		}
		else if (type == "teams"){
			setTimeout(() => 
			{ 
				teamGames(teams['teams'][idElem]['id']);
			}, 1500);
		}
	}	
	showLoadImg();
}

function showLoadImg(){
	var main = document.querySelector("#main");
	var resultHTML = "<div id='loader-div'><div class='loader loader-img'></div></div>";
	main.innerHTML = resultHTML;
}

function listTeams() {
	var main = document.querySelector("#main");
	var resultHTML = "<div class='column' id='col'>";
	for(var i = 0; i < 10; i++) {
		resultHTML += "<div class='teamsRef'><img class='imgTeams' src='" + 
		teams['teams'][i]['crestUrl'] + "' alt='" + teams['teams'][i]['name'] + 
		"'><a href='index.html?type=teams&code=" + i + "'>" + 
		teams['teams'][i]['name'] + "</a></div>";
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

function listLegues() {
	var main = document.querySelector("#main");
	var resultHTML = "<div class='column' id='col'>";
	for(var i = 0; i < 125; i++) {
		if (competitions['competitions'][i]['plan'] == 'TIER_ONE') {
			resultHTML  = resultHTML + `<div class='compRef'><a href='index.html?type=teams&code=` + 
			i + `'>` + competitions['competitions'][i]['name'] + "</a></div>";
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

