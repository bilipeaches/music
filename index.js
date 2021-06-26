String.prototype.format = function(args) {
    if (arguments.length > 0) {
      var result = this;
      if (arguments.length == 1 && typeof(args) == "object") {
        for (var key in args) {
          var reg = new RegExp("({" + key + "})", "g");
          result = result.replace(reg, args[key]);
        }
      } else {
        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] == undefined) {
            return "";
          } else {
            var reg = new RegExp("({[" + i + "]})", "g");
            result = result.replace(reg, arguments[i]);
          }
        }
      }
      return result;
    } else {
      return this;
    }
}
var card_item = ""
$(document).ready(function(){
    mdui.snackbar({
        message: '加载完成',
        position: 'right-bottom'
    });
    $("#search").click(function(){
        $(".loading").show(500);
        var type = $("#music_name").val();
        if(type.replace(/\s+/g,"") != ""){
            try{
                var type = $("#type option:selected").text();
                var music_name = $("#music_name").val();
                if(type == "网易云音乐"){
                    var url = "https://music-api.heheda.top/search?keywords={0}".format(music_name);
                    var strVar = "<div class=\"mdui-card\"><div class=\"mdui-card-media\"><img src=\"{0}\" class='img{3}' id='{2}'><div class=\"mdui-card-media-covered\"><div class=\"mdui-card-primary\"><div class=\"mdui-card-primary-title\">{1}<\/div><div class=\"mdui-card-primary-subtitle {3}\">{2}<\/div><\/div><\/div><\/div><div class=\"mdui-card-actions\"><button class=\"mdui-btn mdui-ripple\" onclick=\"download('http://music.163.com/song/media/outer/url?id={2}.mp3')\"><i class=\"mdui-icon material-icons\">file_download<\/i>下载<\/button> <button class=\"mdui-btn mdui-ripple\" onclick=\"listen('{2}', '{1}')\"><i class=\"mdui-icon material-icons\">play_circle_outline<\/i>试听<\/button><\/div><\/div>\n";
                    $.get(url, function(data){
                      var ht = ""
                      var i = 0;
                      for(i;i<30;i++){
                        var song = data['result']['songs'][i]
                        var id = song['id']
                        var img = song['artists'][0]['img1v1Url']
                        var title = song['name'] + ' - ' + song['artists'][0]['name']
                        ht += strVar.format(img, title, id, i);
                        $(".search").html(ht);
                      }
                      i = 0;
                      var ids = "";
                      for(i;i<30;i++){
                        var id = $(".{0}".format(String(i))).text();
                        if(i == 0){
                          ids += id;
                        }
                        else{
                          ids += ",{0}".format(id);
                        }
                      }
                      i = 0;
                      $.get("https://music-api.heheda.top/song/detail?ids={0}".format(ids), function(data){
                        for(i;i<30;i++){
                          $(".img{0}".format(String(i))).attr("src", data['songs'][i]['al']['picUrl']);
                        }
                      });
                      $(".search").show(500);
                      $(".loading").hide(500);
                    });
                }
            }
            catch(err){
                mdui.alert("搜索源 {0} 请求失败!\nError:{1}".format(type, err));
            }
        }
        else{
          $(".loading").hide(500);
          mdui.alert("音乐名称不能为空!");
        }
    });
});
// 下载
function download(url){
  window.open(url);
}
// 试听
function listen(id, name){
  $.get("https://music-api.heheda.top/lyric?id=" + id, function(data){
    try{
      var lrc = data['lrc']['lyric']
    }
    catch{
      var lrc = "纯音乐，请欣赏"
    }
    const ap = new APlayer({
      container: document.getElementById('player'),
      lrcType: 1,
      fixed: true,
      audio: [{
          name: name,
          url: 'http://music.163.com/song/media/outer/url?id={0}.mp3'.format(id),
          cover: $("#{0}".format(id)).attr("src"),
          lrc:lrc
    }]
  });
  });
}