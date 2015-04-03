$.widget("pmboard.boardwidget", {
  
  // custom properties
  inputs: [],
  outputs: [],
  rows: [
    {name: "Type1", evidence: 5}, // test data
    {name: "Type2", evidence: 0}
  ],
  modal: null,
  
  // properties to specialize the widget (mostly specified on constructor, but can also be changed via _setOptions)
  options: {
    template: "widget.html",
    title: "",
    columns: [],
    wrappers: [], // e.g., <a>, <span>, etc.
    api: "",
    addmoreText: "Add", // TODO: use the footer for something else? 
    addmoreAtts: {},
    // intended result: <a href="#" class="editable-value new-value" id="newpersona" data-type="text" data-pk="new"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add another feature</a>
    
    // TODO: add callbacks from user actions
    deleteItem: null,
    modalValues: null,
    modalId: ''
  },
  
  _create: function() {
    var This = this;
    $.get(this.options.template, function(widget) {
      
      // set up widget element
      var el = $(widget);
        el.find('.panel-title').text(This.options.title);
        
        var tHead = $('<thead>');
        for (var i = 0; i < This.options.columns.length; i++) {
          $('<th>')
            .text(This.options.columns[i])
            .appendTo(tHead);
        }
        if (This.options.deleteItem) { 
          tHead.append('<th>Delete</th>');
          $(document).on('click', '.remove-item', function(e) {
        		This.options.deleteItem(this);
        	});
        }
        tHead.appendTo(el.find('.panel-body .table'));
        
        var addmore = $('<a href="#" class="editable-value new-value" data-type="text" data-pk="new"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> ' + This.options.addmoreText + '</a>');
        addmoreAttsKeys = Object.keys(This.options.addmoreAtts);
        // TODO: extract an option 
        for (var i = 0; i < addmoreAttsKeys.length; i++) {
          var key = addmoreAttsKeys[i];
          addmore.attr(key, This.options.addmoreAtts[key]);
        }
        addmore.editable({
      		value: '',
      		showbuttons: false,
      		params: function(params) { return JSON.stringify(params); },
      		onblur: 'submit',
      		url: This.options.api,
      		ajaxOptions: {
      			type: 'put',
      			dataType: 'json',
      			contentType: 'application/json; charset=utf-8'
      		},
      		success: function(response, newValue) {
      			if (typeof response == "object") {
      				if (response.success) {
      					This._refresh();
      					$(this).editable('toggle');
      				} else {
      					return response.error;
      				}
      			} 
      		}
      	});
        el.find('.panel-footer').append(addmore);
      el.appendTo(This.element);
      
      This._refresh();
      
      // set up modal dialog
      if (this.options.modalValues && this.options.modalId) {
        this.modal = new widgetModal(this.options.modalValues, this.options.modalId);
        // ...
      }
    });
  },
  
  _refresh: function() {
    // fill in grid values
    if (this.options.api) {
      var This = this;
      $.get(this.options.api, function(personas) {
        This.rows = personas;
        This._refreshHelper();
      });
    } else {
      this._refreshHelper();
    }
  },
  
  _refreshHelper: function() {
    
    var delCol = '';
    if (this.options.deleteItem) {
      delCol = '<td><button class="btn btn-default glyphicon glyphicon-remove remove-item" type="button"></button></td>';
    }
    
    // refresh rows
    var tbl = this.element.find('.table'); // FIXME: this will find .table in #widgets i think, not this single widget
    tbl.find('tr').remove();
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i];
      var tr = $('<tr>');
      tr.attr('data-ix', i);
      for (var j = 0; j < this.options.columns.length; j++) {
        var col = this.options.columns[j].toLowerCase();
        var val = row[col] ? $(this.options.wrappers[j].replace(/{i}/g, i)).append(row[col]) : $(this.options.wrappers[j]).append(0);
        var td = $('<td>')
          .append(val)
          .appendTo(tr);
        // TODO: set up modal for this data item
        var modalLink = td.find('[data-toggle="modal"]');
        if (modalLink) {
          var id = modalLink.attr('data-target');
          
        }
      }
      if (delCol) $(delCol).appendTo(tr);
      tr.appendTo(tbl); 
    }
    $('.editable-value').editable({
  		showbuttons: false,
  		params: function(params) { return JSON.stringify(params); },
  		onblur: 'submit',
  		url: personas_url,
  		ajaxOptions: {
  			type: 'post',
  			dataType: 'json',
  			contentType: 'application/json; charset=utf-8'
  		},
  		success: function(response, newValue) {
  			if (typeof response == "object" && !response.success) {
  				return response.error;
  			}
  		},
  		error: function(a, b) {
  			console.err(a, b);
  		}
  	});
  }
});

// values: title, body, footer
function widgetModal(values, id) {
  
  // opts:
  // - label: text to put on the tab
  // - ...
  this.addTab = function(opts) {
    
  };
  
  // **** constructor ****
  
  this.template = "modal.html";
  
  // load modal template
  $.get(this.template, function(data) {
    var modal = $(data);
    
    // set id
    modal.attr('id', id);
    
    // set .modal-* content
    for (var key in values) {
      modal.find('.modal-' + key).text(values[key]);
    }
    
    // add to document body
    $('body').append(modal);
  });
  
  
}