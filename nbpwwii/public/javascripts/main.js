$(document).ready(function () {
  $(".deleteState").on("click", deleteState);
});

function deleteState() {
  event.preventDefault();
  var confirmation = confirm("Are You sure?");

  if (confirmation) {
    $.ajax({
      type: "DELETE",
      url: "/state/" + $(".deleteState").data("id"),
    }).done(function (response) {
      window.location.replace("/");
    });
  } else {
    return false;
  }
}
