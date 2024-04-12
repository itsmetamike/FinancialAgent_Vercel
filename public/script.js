$(document).ready(function() {
    $('#uploadForm').submit(function(e) {
      e.preventDefault();
      var formData = new FormData();
      var file = $('input[name=file]')[0].files[0];
      formData.append('file', file);
      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
          alert(response.message);
          $('#filename').val(file.name);
        },
        error: function(xhr, status, error) {
          alert('Error: ' + error);
        }
      });
    });
  
    $('#queryForm').submit(function(e) {
      e.preventDefault();
      var query = $('input[name=query]').val();
      var filename = $('#filename').val();
      $.ajax({
        url: '/query',
        type: 'POST',
        data: JSON.stringify({ query: query, filename: filename }),
        contentType: 'application/json',
        success: function(response) {
          $('#result').html('<p class="subtitle">Result:</p><p>' + response.result + '</p>');
        },
        error: function(xhr, status, error) {
          alert('Error: ' + error);
        }
      });
    });
  });