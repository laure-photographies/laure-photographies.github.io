$(function() {
  /* */

  var siteinfo = {
    'url': 'http://laure-photographies.github.io',
    'github_repo': 'https://api.github.com/repos/laure-photographies/laure-photographies.github.io',
    'prefix': 'img_',
    'hash_sep': '#!'
  };

  // constructor Object Hash
  function Hash(hash) {
    var hashTab = hash.split(siteinfo.hash_sep) ;
    hashTab.shift();
    this.basenameImg = hashTab[0];
    this.sha = hashTab[1];
    this.item = hashTab[2];
    this.display = function(){
      if(typeof this.item != "undefined" && typeof $("#" + this.item).attr('src') != "undefined" ){
        majBackground($("#" + this.item).attr('src'));
      }else if(typeof this.sha != "undefined"){
        $('#header').remove();
        displayMenu(this);
      }
    }
    this.nav = function(direction){
      var nItem = this.item.split("item-");
        nItem = parseInt(nItem[1]) + parseInt(direction) ;
        
        if(nItem <= 0){
          nItem = $("#menu-panel-img .item").length ;
        }
        if(nItem > $("#menu-panel-img .item").length){
          nItem = 1 ;
        }
        this.item = "item-" + nItem ;
        document.location.hash = siteinfo.hash_sep + this.basenameImg +
          siteinfo.hash_sep + this.sha +
          siteinfo.hash_sep + this.item;
    }
  }

  /* liste les repertoires img_xxx dans img pour afficher le menu */
  $.ajax({
    url: siteinfo.github_repo + "/branches",
    success: function(data) {
      // récupération du dernier sha last commit du repos
      getShaImgAndListImg(data[0].commit.sha);
    }
  });

  function getShaImgAndListImg(github_repo_sha) {
    $.ajax({
      url: siteinfo.github_repo + "/git/trees/" + github_repo_sha,
      success: function(data) {

        // Récupération du sha du dossier img et listImg
        $.each(data.tree, function() {
          if (this.path == "img") {
            listImg(this.sha);
          }
        });
      }
    });
  }

  function listImg(img_sha) {
      $.ajax({
        url: siteinfo.github_repo + "/git/trees/" + img_sha,
        success: function(data) {

          // data.tree array des items du sha dans l'API Github
          $.each(data.tree, function() {

            var atext = this.path;

            if (atext.match(siteinfo.prefix)) {
              $('#menu-panel ul').append(
                '\
          <li class="menu-panel-item menu-panel-item-img">\
            <a class="load-menu" href="' + siteinfo.hash_sep +
                atext.replace(siteinfo.prefix, '') + siteinfo.hash_sep +
                this.sha +
                '" title="' + atext.replace(siteinfo.prefix, '').replace(/%20/g, ' ') + '">' +
                atext.replace(siteinfo.prefix, '').replace(/%20/g, ' ') + '</a></li>'
              );
            }
          });
        },
        complete: function() {
          $('#menu-panel').trigger('updatelayout');
          $('#menu-panel ul').listview().listview('refresh');
        }
      });
    } // Fin : listImg sur Github
    // Fin : liste des répertoires img


  /* EVENTS */

  $(document).mousedown(function(e) {
    //clique droit
    if (e.which === 3) {
      e.preventDefault ;
    }
  });

  // listens for any navigation keypress activity
  $(window).keydown(function(e)
  {
     var keyCode; 
    (typeof e.which != "undefined") ? keyCode = e.which : keyCode =  e.keyCode ;

    switch( keyCode )
    {
      // "left arrow"
      case 37: 
        var hash = new Hash(document.location.hash);
        hash.nav(-1);
        break;

      // "right arrow"
      case 39:
        var hash = new Hash(document.location.hash);
        hash.nav(1);
        break;

      // "top arrow"
      case 38:
        break;

      // "bottom arrow"
      case 40:
        break;

    }
  });  

  $(window).on('load', function() {
    var hash = new Hash(document.location.hash);
    hash.display();
  });

  // pannel image droite
  $(document).on('click', '#menu-panel-img .item', function(e) {
    e.preventDefault();
    var imagePanel = $(this).find("img");
    
    var hash = new Hash(document.location.hash);
    document.location.hash = siteinfo.hash_sep + hash.basenameImg +
      siteinfo.hash_sep + hash.sha +
      siteinfo.hash_sep + imagePanel.attr('id');
  });

  // pannel menu gauche
  $(document).on('click', '.load-menu', function(e) {

    e.stopPropagation();
    e.preventDefault();

    $(".load-menu.ui-btn-active").removeClass("ui-btn-active");
    $(this).addClass("ui-btn-active") ;

    var hashTab = e.currentTarget.href.split(siteinfo.hash_sep) ;
    var sha = hashTab.pop();
    var basenameImg = hashTab.pop();

    document.location.hash = siteinfo.hash_sep + basenameImg +
      siteinfo.hash_sep + sha;

  }); // end on .menu-img-item event

  $(window).on('hashchange', function() {
    var hash = new Hash(document.location.hash);
    hash.display();
  });

  $(window).on('swipe',function(e){
    var direction ;
    ((e.swipestart.coords[0] - e.swipestop.coords[0]) < 0) ? direction = 1 : direction = -1 ; 
    var hash = new Hash(document.location.hash) ;
    hash.nav(direction);
  });

  function displayMenu(hash) {

      $.ajax({
        url: siteinfo.github_repo + "/git/trees/" + hash.sha,
        success: function(data) {

          $('#menu-panel-img ul .item').remove();

          var i = 1;

          // Pour chaque image on récupère le path (son nom)
          $.each(data.tree, function() {
            var hrefImg = siteinfo.url + "/img/" +
              siteinfo.prefix + hash.basenameImg +
              "/" + this.path;

            if (i === 1) {
              document.location.hash = document.location.hash +
                siteinfo.hash_sep + 'item-' + i;
            }

            $('#menu-panel-img ul').append('\
            <li class="item">\
              <a href="#item-' + i + '"><img id="item-' + i + '" src="' + hrefImg + '" alt="' + this.path + '" /></a>\
            </li>');
            i++;

          }); // Fin du each
        } // fin du success
      });

      $('#menu-panel').panel('close');
    } // Fin : displayMenu

  // mise à jour du background
  function majBackground(hrefImg) {
    $('body').css({
      'background-image': 'url("' + hrefImg + '")',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-attachment': 'fixed',
      'background-size': 'contain'
    });
  }

  // rel-home
  $(document).on('click', '.rel-home', function(e) {
    e.preventDefault();
    document.location.href = siteinfo.url;
    // location.reload();
  });

});