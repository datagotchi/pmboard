// ******* boardWidget *******
function boardWidget(opts) {
  
  this.options = opts;
  
  this.inputs = [];
  this.outputs = [];
  this.rows = [
    {name: "Type1", evidence: 5}, // test data
    {name: "Type2", evidence: 0}
  ];
  this.element = null;
  this.modal =  null;
  this.template = "widget.html";
  
  // set up the modal
  this.modalId = this.options.id + 'modal';
  this.modal = new widgetModal(this.options.title, this.modalId, this);
  
  var This = this;
  $.get(this.template, function(html) {
    
    // set up widget element
    var el = $(html);
      el.find('.panel-title').text(This.options.title);
      el.attr('id', This.options.id);
      
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
    if (This.options.container) {
      $(This.options.container).append(el);
    }
    This.element = el;
    
    // refresh widget
    This._refresh();
  });
}

boardWidget.prototype._refresh = function() {
  // fill in grid values
  if (this.options.api) {
    var This = this;
    $.get(this.options.api, function(values) {
      This.rows = values;
      This._refreshHelper();
    });
  } else {
    this._refreshHelper();
  }
};
  
boardWidget.prototype._refreshHelper = function() {
    
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
      if (val.data('toggle') == 'modal') {
        val.attr('data-target', '#' + this.modalId);
      }
      var td = $('<td>')
        .append(val)
        .appendTo(tr);
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

boardWidget.prototype.deleteItem = function(button) {
  if (this.options.api) {
    var tr = $(button).parent().parent();
		$.ajax({
			method: 'delete',
			url: this.options.api,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
  			ix: tr.data('ix')
			}),
			success: function() {
				tr.remove();
			}
		});
  }
};

boardWidget.prototype.addModalTab = function(opts) {
  this.modal.tabs.push(opts);
}

// ******* widgetModal *******

function widgetModal(title, id, widget) {
  
  this.template = "modal.html";
  
  this.elem = null;
  this.title = title;
  this.widget = widget;
  
  // - label: text to put on the tab
  // - content: html to put in the tab content
  this.tabs = []; 
  
  var This = this;
  // load modal template
  $.get(this.template, function(html) {
    This.elem = $(html);
    This.elem.attr('id', id)
      .appendTo($('body'));
    This.elem.find('.modal-title').text(This.title);
    This.elem.on('show.bs.modal', function(event) {
      This.show(event);
    });
  });
}
  
widgetModal.prototype.show = function(event) {
  var tr = $(event.relatedTarget).parent().parent(); // a -> td -> tr
  var data = tr.data();
  //this.elem.find('.modal-title').text(this.title);
  
  this.elem.find('.nav').empty();
  this.elem.find('.tab-content').empty();
  for (var i in this.tabs) {
    this.renderTab(i);
  }
};

widgetModal.prototype.renderTab = function(ix) {
  var tab = this.tabs[ix];
  var label = tab.label;
  var labelLower = label.toLowerCase();
  var html = '<li role="presentation"><a href="#{label}" aria-controls="{label}" role="tab" data-toggle="tab">{Label}</a></li>'.replace(/{label}/g, labelLower).replace(/{Label}/g, label);
  var li = $(html);
  this.elem.find('.nav').append(li);
  var content = $('<div role="tabpanel" class="tab-pane">')
    .attr('id', labelLower)
    .append(
      $(tab.content.replace(/{i}/g, ix).replace(/{name}/g, this.widget.rows[ix]))
    );
  this.elem.find('.tab-content').append(content);
  if (this.tabs.length === 1) {
    // it was the first li
    li.addClass('active');
    content.addClass('active');
  }
};