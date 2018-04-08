$(document).on("click", "#save-note", function() {

  console.log("working until here")
  var thisId = $(this).attr("data-id");
  var time = moment().format("YYYY-MM-DD HH:MM:SS");
  console.log(time)

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $("#note-input").val(),
      created_time: time
    }
  })
    .done(function(data) {
      console.log(data);
    });

  $("#note-input").val("");

});
