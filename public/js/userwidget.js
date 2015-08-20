var currentEvidenceItems, currentTrends, currentTrendsMap;

var $selectedEvidence, $selectedTag;

var trendTypes = {
  "Objective" : "label label-danger",
  "Goal" : "label label-warning",
  "Activity" : "label label-primary",
  "Task" : "label label-default",
  "Resource" : "label label-success"
};

function getTagClass(trend) {
  if (trend.type && trendTypes[trend.type]) {
    return trendTypes[trend.type];
  } else {
    return 'label label-info'
  }
}

function createUserWidget(apiUrl) {
  return new boardWidget({
    title: 'Who are your users?',
    id: "users",
    columns: [{name: 'Name', value: 'name'}, {name: '', value: 'evidence.length'}],
    // TODO: ^ implement dynamic columns in the 'wrapper' below
    valueField: 'name',
    wrappers: [
      '<a href="#" data-toggle="modal">',
      '<button type="button" class="evidence btn btn-default label" data-toggle="tooltip" data-placement="top" title="Number of pieces of evidence">'
    ],
    wrapper: '<a href="#" data-toggle="modal">',
    //wrapper: '<div class="dd-handle" data-toggle="modal">',
    api: apiUrl,
    addmoreText: "Add another user type",
    addmoreAtts: {
      id: 'newpersona'
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
      }).then(
        $.get("templates/evidence-tab.html", function(html) {
          widget.addModalTab({
            label: 'Add Evidence',
            content: html
          });
        })
      );
      
      $(document).on('click', '#' + widget.modalId + ' :checkbox', function(event) {
        var evidenceUrl = widget.options.api + '/' + widget.modal.currentIx + '/evidence';
        var $this = $(this);
        var $tr = $this.parent().parent();
        var personaIx = widget.modal.currentIx;
        var $currentTable = $('#addevidence #current table tbody');
        if ($this.prop('checked')) {
          $tr.addClass('success');
          addEvidence(evidenceUrl, $tr, function(data) {
            /*var td1 = $tr.find('td.file');
            var $select = $('<select multiple data-role="tagsinput"></select>');
            var td2 = $("<td>").append($select);
            $("<tr>")
              .append(td1)
              .append(td2)
              .appendTo($currentTable);
            initTagsInput(evidenceUrl, $select);*/
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
      //var evidence = {};
      // set up the 'evidence' tab...
      
      // list current evidence files
      var $currentTable = $('#addevidence #current table tbody');
      refreshEvidence(evidenceUrl, $currentTable, function(evidence) {
        currentEvidenceItems = evidence;
        flattenTrends();
        refreshSummaryTab();
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
              if (evidence[item.alternateLink]) tr.hide();
              filesTable.append(tr);
          }
        };
        xhr.send();
        
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
        
      });
    }
  });
}

function flattenTrends() {
  // get a list of trends from the evidence 
  currentTrends = [], currentTrendsMap = {};
  for (var e in currentEvidenceItems) {
    var evidence = currentEvidenceItems[e];
    //currentTrends.concat(evidence.trends);
    for (var t in evidence.trends) {
      var trend = evidence.trends[t];
      currentTrends.push(trend);
      if (!(trend.type in currentTrendsMap)) {
        currentTrendsMap[trend.type] = {};
      }
      if (!(trend.name in currentTrendsMap[trend.type])) {
        currentTrendsMap[trend.type][trend.name] = 0;
      }
      currentTrendsMap[trend.type][trend.name] += 1;
    }
  }
}

function refreshSummaryTab() {
  // show the trends on the summary tab
  var $summaryTable = $("#trendSummary table tbody");
  $summaryTable.empty();
  for (var ttype in trendTypes) {
    for (var trendName in currentTrendsMap[ttype]) {
      var trendCount = currentTrendsMap[ttype][trendName];
      $("<tr>")
        .append("<td>" + ttype + "</td>")
        .append("<td>" + trendName + " <span class=\"badge\">" + trendCount + "</span></td>")
        .addClass(getTagClass({type: ttype}))
        .appendTo($summaryTable);
    }
  }
}

function addEvidence(url, $tr, callback) {
  var filename = $tr.find('a').text();
  var fileurl = $tr.find('a').attr('href');
  var icon = $tr.find('img').attr('src');
  $.ajax({
    method: 'POST',
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

function initTagsInput(evidenceUrl, $select, trends) {
  $select.tagsinput({
    itemValue: 'name',
    itemText: 'name',
    allowDuplicates: true, // TODO: does this mean per-field? if so, then no... 
    tagClass: getTagClass/*,
    typeaheadjs: {
      name: 'currentTrends',
      displayKey: 'name',
      valueKey: 'name',
      source: currentTrends
    }*/
  });
  
  for (var i in trends) {
    var trend = trends[i];
    $select.tagsinput('add', trend);
  }
  
  var $text = $select.parent().find('input');
  $text.on('keypress', function(event) {
    if (event.which === 13) {
      $select.tagsinput('add', {name: $(this).val(), type: ''})
      $(this).val("");
    }
  });
  
  $select.on('itemAdded', function(event) {
    var trIx = $(this).parent().parent().index(); // select -> td -> tr
    var trendsUrl = evidenceUrl + '/' + trIx + '/trends';
    var newIx = currentEvidenceItems[trIx].trends.length;
    $.ajax({
      method: 'POST',
      url: trendsUrl,
      data: event.item,
      success: function(data) {
        if (data && data.success) {
          initTagElement($("span.tag"));
          
          currentEvidenceItems[trIx].trends.push(event.item);
          flattenTrends();
          refreshSummaryTab();
        }
      }
    });
  });
  $select.on('beforeItemRemove', function(event) {
    var trIx = $(this).parent().parent().index();
    var trendsUrl = evidenceUrl + '/' + trIx + '/trends';
    $.ajax({
      method: 'DELETE',
      url: trendsUrl,
      data: {
        ix: $(this).tagsinput('items').indexOf(event.item)
      }
    });
  });
  
  initTagElement($("span.tag"));
}

function initCategoryPopup(evidenceUrl) {
    var $categories = $("ul#trendCategories");
    $categories.empty();
    for (var t in trendTypes) {
        $categories.append("<li><a href='#'>" + t + "</a></li>");
    }
    $categories.append("<li><a href='#'>None</a></li>");
    $categories.find("li > a")
        .click(function(event) {
            var trendIx = $selectedTag.index();
            var typeIx = $(this).parent().index();
            var evIx = $selectedEvidence.index();
            changeTrendType(evidenceUrl, evIx, trendIx, typeIx);
            $categories.hide();
        });
}

function initTagElement($tag) {
  var $popup = $("ul#trendCategories");
  $tag
    .hover(function() {
      $(this).css("cursor", "pointer");
    })
    .click(function(event) {
      if (event.shiftKey) {
        $selectedEvidence = $(this).closest('tr');
        $selectedTag = $(this);
        $popup
          .css("left", $(this).position().left)
          .css("top", $(this).position().top + $(this).height())
          .show();
      }
    });
}

function changeTrendType(rootUrl, evIx, index, newTypeIx) {
  var newType = Object.keys(trendTypes)[newTypeIx];
  $.ajax({
    method: 'PUT',
    url: rootUrl + '/' + evIx + '/trends/' + index,
    data: {
      type: newType
    },
    success: function(data) {
      if (data && data.success) {
        // refresh evidence tab
        var $tr = $($("#current table tbody tr")[evIx]);
        var $tagsData = $tr.find("[data-role='tagsinput']");
        $span = $($tr.find("span.tag")[index]);
        var item = $tagsData.tagsinput('items')[index];
        item.type = newType;
        $tagsData.tagsinput('refresh');
        
        // refresh summary tab
        currentEvidenceItems[evIx].trends[index] = {
          name: item.name,
          type: item.type
        };
        flattenTrends();
        refreshSummaryTab();
      }
    },
    error: function(err) {
      console.error(err);
    }
  })
}

function initDeleteBtns(evidenceUrl, $btns) {
  $btns.css('cursor', 'pointer');
  $btns.on('click', function(event) {
    var This = this;
    var verify = bootbox.confirm("Are you sure?", function(result) {
      if (result === true) {
        var $tr = $(This).parent().parent();  // btn -> td -> tr
        $.ajax({
          method: 'DELETE',
          url: evidenceUrl,
          data: {
            ix: $tr.index()
          },
          success: function() {
            // show row in files table
            var url = $tr.find('a').attr('href');
            var filesLink = $("#files").find('a[href="' + url + '"]'); //$tr.closest('div[role=tabpanel]').find('...')
            var filesTr = filesLink.parent().parent() // a -> td -> tr
              .show()
              .removeClass('success', 2000); // TODO: would like a color animation here maybe
            filesTr.find(':checked').prop('checked', false);
            
            // remove from evidence table
            $tr.remove(); 
          },
          error: function(data) {
            console.error(data);
          }
        });
      }
    });
    
  });
}

function refreshEvidence(evidenceUrl, $currentTable, callback) {
  $.get(evidenceUrl, function(evidence) {
    $currentTable.empty();
    var trends = [];
    for (var row in evidence) {
      var file = evidence[row];
      evidence[file.url] = file.name; // create a hash lookup table for below
      var $select = $('<select multiple data-role="tagsinput"></select>');
      var td = $('<td>').append($select);
      $('<tr>')
        .append('<td><span class="remove-evidence glyphicon glyphicon-remove"></span></td>')
        .append('<td><a href="' + file.url + '" target="_blank"><img src="' + file.icon + '" />' + file.name + '</a></td>')
        .append(td)
        .appendTo($currentTable);
      //if (file.trends.length > 0) {
      //  trends = file.trends;
      //}
      initTagsInput(evidenceUrl, $select, file.trends);
    }

    initCategoryPopup(evidenceUrl);
    initDeleteBtns(evidenceUrl, $currentTable.find('.remove-evidence'));
    callback(evidence);
  });;
}