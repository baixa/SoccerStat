new Vue({
	el: '#app',
	data: {
		navbar_items: [
			{title: 'Список лиг', href:'#', onclick:'listLeguesClick()'},
			{title: 'Список команд', href:'#', onclick:'listTeamsClick()'},
			{title: 'Календарь лиги', href:'#', onclick:'listGamesLeagueClick()'},
			{title: 'Календарь одной команды', href:'#', onclick:'listGamesTeamClick()'},
		]
	},
	methods: {

	},
	computed: {

	}
});


var teams = []




$.ajax({
  headers: { 'X-Auth-Token': 'f3f3dad5142049a481c69a81fdda3d0d' },
  url: "https://api.football-data.org/v2/teams",
  dataType: 'json',
  type: 'GET',
}).done(function(response) {
	for(let i = 0; i < 10; i++) {
  	teams += (response['teams'][i]);
  	console.log(response['teams'][i]);
  }
});


function listTeamsClick() {
	var main = document.getElementById("col");
	var resultHTML = "";
	for(let i = 0; i < teams.length; i++) {
		resultHTML  = resultHTML + '<a onclick="teamGames()">' + teams[i]['name'] + '</a>';
		console.log(teams);
	}
	var el = document.getElementById('col');
	el.innerHTML = resultHTML;
}
function teamGames() {

}
