// ******* boardWidget *******
function boardWidget(opts) {
  
  this.options = opts;
  
  this.inputs = [];
  this.outputs = [];
  this.rows = [];
  this.element = null;
  this.modal =  null;
  this.template = "templates/widget.html";
  
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
    
  // refresh rows
  var tbl = this.element.find('.table');
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
    tr.appendTo(tbl); 
  }
  var This = this;
  $(document).on('shown.bs.modal', '#' + this.modalId, function(event) {
    if (This.options.modalShown) {
      This.options.modalShown(This, event);
    }
  });
  if (this.options.success && !this.loaded) {
    this.loaded = true;
    this.options.success(this);
  }
}

boardWidget.prototype.deleteItem = function(ix, callback) {
  if (this.options.api) {
		$.ajax({
			method: 'delete',
			url: this.options.api,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
  			ix: ix
			}),
			success: function() {
				if (callback) callback();
			}
		});
  }
};

boardWidget.prototype.addModalTab = function(opts) {
  this.modal.addTab(opts);
}

// ******* widgetModal *******

function widgetModal(title, id, widget) {
  
  this.template = "templates/modal.html";
  
  this.elem = null;
  this.title = title;
  this.widget = widget;
  this.currentIx = -1;
  
  // - label: text to put on the tab
  // - content: html to put in the tab content
  this.tabs = []; 
  
  var This = this;
  // load modal template
  $.get(this.template, function(html) {
    This.elem = $(html);
    This.elem
      .attr('id', id)
      .prop('widget', This.widget)
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
  var rownum = data.ix;
  this.currentIx = rownum;
  this.elem.find('.nav').empty();
  this.elem.find('.tab-content').empty();
  for (var i in this.tabs) {
    this.renderTab(i, rownum);
  }
  var Modal = this;
  this.elem.find('.remove-item').click(function(event) {
    Modal.widget.deleteItem(rownum, function() {
      Modal.elem.modal('hide');
    });
  });
};

widgetModal.prototype.addTab = function(opts) {
  this.tabs.push(opts);
};

widgetModal.prototype.renderTab = function(tabix, rowix) {
  var tab = this.tabs[tabix];
  var label = tab.label;
  var labelLower = label.toLowerCase();
  var html = '<li role="presentation"><a href="#{label}" aria-controls="{label}" role="tab" data-toggle="tab">{Label}</a></li>'.replace(/{label}/g, labelLower).replace(/{Label}/g, label);
  var li = $(html);
  this.elem.find('.nav').append(li);
  var str = tab.content.replace(/{i}/g, rowix);
  var datareps = str.match(/{data\.[a-z0-9]*}/g);
  for (var i in datareps) {
    var rep = datareps[i];
    var key = rep.split('.')[1];
    key = key.slice(0, key.length - 1);
    str = str.replace(rep, this.widget.rows[rowix][key]);
  }
  var content = $('<div role="tabpanel" class="tab-pane">')
    .attr('id', labelLower)
    .append(str);
  this.elem.find('.tab-content').append(content);
  if (tabix == 0) {
    li.addClass('active');
    content.addClass('active');
  }
};