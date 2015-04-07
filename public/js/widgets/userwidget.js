function createUserWidget(apiUrl) {
  return new boardWidget({
    title: 'Who are your users?',
    id: "users",
    columns: ['Name'],
    wrappers: [
      '<a href="#" data-toggle="modal">',
      //'<a href="#" class="editable-value editable-click" data-name="persona{i}" data-type="text" data-pk="{i}">',
      //'<button type="button" class="evidence btn btn-default label-danger label" data-toggle="popover" data-placement="top" data-trigger="focus" title="Number of pieces of evidence" data-content="lorem ipsum">'
    ],
    api: apiUrl,
    addmoreText: "Add another user type",
    addmoreAtts: {
      id: 'newpersona'
    }, 
    container: '#widgets',
    success: function(widget) {
      
      widget.addModalTab({
        label: 'Details',
        content: '<strong>Name: </strong> <a href="#" class="editable-value editable-click" data-name="persona{i}" data-type="text" data-pk="{i}" data-url="' + apiUrl + '">{data.name}</a>'
      });
      
      $.get("templates/evidence-tab.html", function(html) {
        widget.addModalTab({
          label: 'Evidence',
          content: html
        });
      });
      
      $("#loading").hide();
    },
    modalShown: function(widget, event) {
      var evidenceUrl = apiUrl + '/' + widget.modal.currentIx + '/evidence';
      var curEvidence = {};
      // set up the 'evidence' tab...
      
      // list current evidence files
      var $currentTable = $('#evidence table#current tbody');
      $.get(evidenceUrl, function(evidence) {
        for (var row in evidence) {
          var file = evidence[row];
          curEvidence[file.url] = file.name; // create a hash lookup table for below
          $('<tr>')
            .html('<td><a href="' + file.url + '" target="_blank">' + file.name + '</a></td>' +
              '<td><select multiple data-role="tagsinput"></select></td>')
            .appendTo($currentTable);
        }
        initTagsInput($('[data-role=tagsinput]'));
      });;
      
      // allow them to choose more files for evidence
      var oauth = JSON.parse($.cookie('oauth'));
      var accessToken = oauth.access_token;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://www.googleapis.com/drive/v2/files", true);
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.onload = function (evt) {
        if (xhr.status != 200) {
          if (xhr.status == 401) { // google 'invalid credentials'
            return doAuthentication(); // refresh token
          }
        }
        var response = JSON.parse(xhr.responseText);
        var filesTable = widget.modal.elem.find("#evidence table#files tbody");
        for (var i = 0; i < response.items.length; i++) {
            var item = response.items[i];
            if (curEvidence[item.alternateLink]) continue;
            var tr = $("<tr>");
            var td1 = $("<td>")
            td1.html("<input type='checkbox'>");
            tr.append(td1);
            var td2 = $("<td>").addClass('file');
            td2.html("<a href='" + item.alternateLink + "' target='_blank'>" +
                           "<img src='" + item.iconLink + "'>" + 
                           item.title + "</a>");
            tr.append(td2);
            filesTable.append(tr);
        }
      };
      xhr.send();
      $(document).on('click', '#' + widget.modalId + ' :checkbox', function(event) {
        var $this = $(this);
        var $tr = $this.parent().parent();
        var personaIx = widget.modal.currentIx;
        if ($this.prop('checked')) {
          $tr.addClass('success');
          addEvidence(evidenceUrl, $tr, function(data) {
            var td1 = $tr.find('td.file');
            var $select = $('<select multiple data-role="tagsinput"></select>');
            initTagsInput($select);
            var td2 = $("<td>").append($select);
            $("<tr>")
              .append(td1)
              .append(td2)
              .appendTo($currentTable);
            $tr.remove();
          });
        } else {
          $tr.removeClass('success');
        }
      });
      
      // set up the 'details' tab...
      // make fields editable (edit text -> post to server)
      $('#' + widget.options.id + ' .editable-value').editable({
        showbuttons: false,
    		params: function(params) { return JSON.stringify(params); },
    		onblur: 'submit',
    		url: apiUrl,
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
    			console.error(a, b);
    		}
      });
    }
  });
}

function addEvidence(url, $tr, callback) {
  var filename = $tr.find('a').text();
  var fileurl = $tr.find('a').attr('href');
  var icon = $tr.find('img').attr('src');
  $.ajax({
    method: 'PUT',
    url: url, //personas_url + '/' + personaIx + '/evidence',
    data: {
      name: filename,
      url: fileurl,
      icon: icon
    },
    success: function(data) {
      if (callback) callback(data);
    },
    error: function(data) {
      //$tr.find(':checkbox').removeAttr('checked');
      console.error(data);
      $tr.find(':checkbox').click();
    }
  });
}

function initTagsInput($items) {
  $items.tagsinput({
    trimValue: true
  });
  /*
  #items.on('itemAdded', function(event) {
    // TODO: PUT event.item
  });
  $items.on('itemRemoved', function(event) {
    // TODO: DELETE event.item
  });
  */
}