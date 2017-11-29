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


var board = {
    name: 'Tablica Kanban',
    createColumn: function(column) {
        this.element.append(column.element);
        initSortable();
    },
    element: $('#board .column-container')
};

$('.create-column').click(function() {
    var columnName = prompt('Enter a column name');

    if (columnName != null) {
        $.ajax({
            url: baseUrl + '/column',
            method: 'POST',
            data: {
                name: columnName
            },
            success: function(response) {
                var column = new Column(response.id, columnName);
                board.createColumn(column);
            }
        });
    }
});

function initSortable() {
    $('.card-list').sortable({
        connectWith: '.card-list',
        placeholder: 'card-placeholder'
    }).disableSelection();
};

// KLASA KANBAN CARD
function Card(id, name) {
    var self = this;

    this.id = id;
    this.name = name || "Bez nazwy";
    this.element = createCard();

    function createCard() {
        var card = $('<li class="card"></li>');
        var cardDeleteBtn = $('<button class="btn-delete">x</button>');
        var cardDescription = $('<p class="card-description"></p>');

        cardDeleteBtn.click(function() {
            self.removeCard();
        });

        card.append(cardDeleteBtn);
        cardDescription.text(self.name);
        card.append(cardDescription);
        return card;
    }
}
Card.prototype = {
    removeCard: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/card/' + self.id,
            method: 'DELETE',
            success: function() {
                self.element.remove();
            }
        });
    }
};

function Column(id, name) {
    var self = this;

    this.id = id;
    this.name = name || "brak nazwy";
    this.element = createColumn();

    function createColumn() {
        // TWORZENIE NOWYCH WĘZŁÓW
        var column = $('<div class="column"></div>');
        var columnTitle = $('<h2 class="column-title">' + self.name + '</h2>');
        var columnCardList = $('<ul class="card-list"></ul>');
        var columnDelete = $('<button class="btn-delete">x</button>');
        var columnAddCard = $('<button class="column-add-card">Dodaj kartę</button>');

        // PODPINANIE ODPOWIEDNICH ZDARZEŃ POD WĘZŁY
        columnDelete.click(function() {
            self.deleteColumn();
        });

        columnAddCard.click(function(event) {
            var cardName = prompt("Wpisz naywę karty: ");

            if (cardName != null) {
                event.preventDefault();
                //self.createCard(new Card(cardName)); ????
                $.ajax({
                    url: baseUrl + '/card',
                    method: 'POST',
                    data: {
                        name: cardName,
                        bootcamp_kanban_column_id: self.id
                    },
                    success: function(response) {
                        var card = new Card(response.id, cardName);
                        self.createCard(card);
                    }
                });
            }
        });

        // KONSTRUOWANIE ELEMENTU KOLUMNY
        column.append(columnTitle)
            .append(columnDelete)
            .append(columnAddCard)
            .append(columnCardList);
        return column;
    }
}
Column.prototype = {
    createCard: function(card) {
        this.element.children('ul').append(card.element);
    },
    deleteColumn: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/column/' + self.id,
            method: 'DELETE',
            success: function(response) {
                self.element.remove();
            }
        });
    }
};