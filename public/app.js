// $(document).on("click", "#save-note", function() {
//   var thisId = $(this).attr("data-id");
//   var time = moment().format("YYYY-MM-DD HH:MM:SS");
//   console.log(time)

$(document).on("click", "#save-note", function() {
  $("#notes").empty();
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      $(`#${data._id}`).append("<input id='bodyinput' name='body' size='120' placeholder='Leave a comment'></input>")
        .append("<button data-id='" + data._id + "' id='savenote'>Post</button>")
        .append("<button data-id='" + data._id + "' id='deletenote'>Remove</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body input
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#bodyinput").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});

// When you click the deletenote button
$(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");
  console.log('thisid',thisId);

  // Run a GET request to remove the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/delete/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#bodyinput").empty();
    });

  // Also, remove the values ened in the input and textarea for note entry
  $("#bodyinput").val("");
});
  // $.ajax({
  //   method: "POST",
  //   url: "/articles/" + thisId,
  //   data: {
  //     body: $("#note-input").val(),
  //     created_time: time
  //   }
  // })
  //   .done(function(data) {
  //     console.log(data);
  //   });
  //
  // $("#note-input").val("");

// });
