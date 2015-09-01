function createProductWidget(apiUrl) {
  return new boardWidget({
    title: 'What is your product?',
    id: 'product',
    columns: [{name: 'Benefit', value: 'name'}, {name: 'Validation', value: 'evidence.length'}],
    valueField: 'name',
    wrappers: [
      '<a href="#" data-toggle="modal">',
      '<button type="button" class="evidence btn btn-default label" data-toggle="tooltip" data-placement="top" title="Number of pieces of evidence">'
    ],
    wrapper: '<a href="#" data-toggle="modal">',
    api: apiUrl,
    addmoreText: "Add another benefit",
    addmoreAtts: {
      id: 'newstory'
    }, 
    container: '#widgets',
    refresh: function() {
      $('[data-toggle="tooltip"]').tooltip();
      
      $(".evidence").each(function(i, el) {
        if (el.innerText == '0') {
          $(el).addClass('label-danger');
        } else if (el.innerText < 5) {
          $(el).addClass('label-warning');
        } else {
          $(el).addClass('label-success');
        }
      });
    },
    success: function(widget) {

      $.get("templates/summary-tab.html", function(html) {
        widget.addModalTab({
          label: 'Summary',
          content: html
        });
        $.get("templates/evidence-tab.html", function(html) {
          widget.addModalTab({
            label: 'Add Evidence',
            content: html
          });
        })
      });
      
      $(document).on('click', '#' + widget.modalId + ' :checkbox', function(event) {
        var evidenceUrl = widget.options.api + '/' + widget.modal.currentIx + '/evidence';
        var $this = $(this);
        var $tr = $this.parent().parent();
        var personaIx = widget.modal.currentIx;
        var $currentTable = $('#addevidence .current table tbody');
        if ($this.prop('checked')) {
          $tr.addClass('success');
          addEvidence(evidenceUrl, $tr, function(data) {
            refreshEvidence(evidenceUrl, $currentTable, function() {
              $tr.hide();
            })
          });
        } else {
          $tr.removeClass('success');
        }
      });
      
      $("#loading").hide();
    },
    modalShown: function(widget, event) {
      var evidenceUrl = apiUrl + '/' + widget.modal.currentIx + '/evidence';
      
      // set up the 'summary' tab...
      // make fields editable (edit text -> post to server)
      var editUrl = apiUrl + '/' + widget.modal.currentIx;
      $('#' + widget.modalId + ' .editable-value').editable({
        showbuttons: false,
    		params: function(params) { return JSON.stringify(params); },
    		onblur: 'submit',
    		url: editUrl,
    		ajaxOptions: {
    			type: 'put',
    			dataType: 'json',
    			contentType: 'application/json; charset=utf-8'
    		},
    		success: function(response, newValue) {
    			if (typeof response == "object" && !response.success) {
    				return response.error;
    			}
    		},
    		error: function(a, b) {
    			console.error(a, b);
    		}
      });
        
      // set up the add files sub-modal
      $(this).on('hide.bs.modal', function(event) {
        event.stopPropagation();
      });
      $("#addPersonaModal").on('show.bs.modal', function(event) {
        event.stopPropagation();
        
        if (!$("#addPersonaModal").html()) {
          $.get("templates/add-persona.html", function(html) {
            $("#addPersonaModal").html(html);
            // TODO: add personas to table and make them selectable
          });
        }
      });
      
      // list current evidence files
      var $currentTable = $('#addevidence .current table tbody');
      refreshEvidence(evidenceUrl, $currentTable, function(evidence) {
        // TODO: put summary stuff in there?
        
      });
    }
  });
}