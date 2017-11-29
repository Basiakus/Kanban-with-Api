var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
	'X-Client-Id': '2412',
	'X-Auth-Token': '72262bbedf8bf359a6f7385882b603e0'
};
$.ajaxSetup({
	headers: myHeaders
});
$.ajax({
	url: baseUrl + '/board',
	method: 'GET',
	success: function(response) {
		setupColumns(response.columns);
	}
});

function setupColumns(columns) {
	columns.forEach(function(column) {
		var col = new Column(column.id, column.name);
		board.createColumn(col);
		setupCards(col, column.cards);
	});
};

function setupCards(col, cards) {
	cards.forEach(function(card) {
		var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
		col.createCard(card);
	})
};