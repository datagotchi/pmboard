$.widget("pmboard.boardwidget", {
  
  // custom properties
  inputs: [],
  outputs: [],
  
  options: {
    template: "widget.html",
    title: "",
    columns: [],
    rows: [],
    addmoreText: "Add",
    addmoreAtts: {},
    // intended result: <a href="#" class="editable-value new-value" id="newpersona" data-type="text" data-pk="new"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add another feature</a>
    
    // TODO: add callbacks from user actions
    deleteItem: null
  },
  
  _create: function() {
    var This = this;
    // get widget.html template & add to the DOM
    $.get(this.options.template, function(data) {
      var el = $(data);
        // fill in values in the widget's html
        
        el.find('.panel-title').text(This.options.title);
        
        var tHead = $('<thead>');
        for (var i = 0; i < This.options.columns.length; i++) {
          $('<th>')
            .text(This.options.columns[i])
            .appendTo(tHead);
        }
        tHead.appendTo(el.find('.panel-body .table'));
        
        
        addmoreAttsKeys = Object.keys(This.options.addmoreAtts);
        if (addmoreAttsKeys.length > 0) {
          var a = $('<a href="#" class="editable-value new-value" data-type="text" data-pk="new"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> ' + This.options.addmoreText + '</a>');
          // TODO: extract an option 
          for (var i = 0; i < addmoreAttsKeys.length; i++) {
            var key = addmoreAttsKeys[i];
            a.attr(key, This.options.addmoreAtts[key]);
          }
          el.find('.panel-footer').append(a);
        }
      el.appendTo(This.element);
    });
  },
  
  _refresh: function() {
    // fill in grid values
    for (var i = 0; i < this.options.rows.length; i++) {
      var row = this.options.rows[i];
      var tr = $('<tr>');
      for (var j = 0; j < this.options.columns.length; j++) {
        var td = $('<td>')
          .append(row[j]);
      }
      tr.appendTo(this.element.find('.table'));
    }
  }
});

// TODOs: 
    
    // render 'add more' button
    // write to/render on page/return as value to be written on page
  
/* // old version
  
  // properties
  this.title = "";
  this.columns = [];
  this.data = []; // to populate the table as rows
  this.elemId = ""; 

  // methods
  this.render = function() {
    // get widget.html template
    // load into dom document
    // fill in grid values via jquery selections
    // render 'add more' button
    // write to/render on page/return as value to be written on page
  };
  
  // constructor code
*/