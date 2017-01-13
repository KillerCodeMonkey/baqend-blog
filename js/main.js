function showPosts() {
  DB.Post.find()
    .descending("date")
    .limit(30)
    .resultList()
    .then(function(result) {
      var html = "";
      result.forEach(function(msg) {
        html += '<div class="col-md-4"><h2>';
        html += msg.title + '</h2><p>' + msg.text + '</p></div>';
      });
      document.getElementById("posts").innerHTML = html;
    });
}

DB.connect("blog", function() {
  showPosts();
});