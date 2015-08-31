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
        $.get("templates/trend-tab.html", function(html) {
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
        var $currentTable = $('#addevidence #current table tbody');
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
      $("#addFilesModal").on('show.bs.modal', function(event) {
        event.stopPropagation();
        
        if (!$("#addFilesModal").html()) {
          $.get("templates/add-file.html", function(html) {
            $("#addFilesModal").html(html);
            /*$("#addFilesModal .modal-footer button.closeBtn").click(function() {
              $("#addFilesModal").hide();
            });*/
            // allow them to choose more files for evidence
            var oauth = JSON.parse($.cookie('oauth'));
            var accessToken = oauth.access_token;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://www.googleapis.com/drive/v2/files", true);
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
            xhr.onload = function (evt) {
              if (xhr.status != 200) {
                if (xhr.status == 401) { // google 'invalid credentials'
                  // refresh token
                  return doAuthentication(function(data) {
                    $.cookie('oauth', data.oauth);
                    widget.options.modalShown(widget, event);
                    //xhr.onload(evt);
                  });
                }
              }
              var response = JSON.parse(xhr.responseText);
              var filesTable = widget.modal.elem.find("#addevidence #files table tbody");
              for (var i = 0; i < response.items.length; i++) {
                  var item = response.items[i];
                  //if (evidence[item.alternateLink]) continue;
                  var tr = $("<tr>");
                  var td1 = $("<td>").css("width", "100px");
                  td1.html("<input type='checkbox'>");
                  tr.append(td1);
                  var td2 = $("<td>").addClass('file');
                  td2.html("<a href='" + item.alternateLink + "' target='_blank'>" +
                                 "<img src='" + item.iconLink + "'>" + 
                                 item.title + "</a>");
                  tr.append(td2);
                  if (currentEvidenceItems[item.alternateLink]) tr.hide();
                  filesTable.append(tr);
              }
            };
            xhr.send();
          });
        }
      });
      
      // list current evidence files
      var $currentTable = $('#addevidence #current table tbody');
      refreshEvidence(evidenceUrl, $currentTable, function(evidence) {
        // TODO: put summary stuff in there?
        
      });
    }
  });
}