$(function() {
	/* */
	
    var siteinfo = { 
      'url':'http://laure-photographies.github.io',
      'github_repo':'https://api.github.com/repos/laure-photographies/laure-photographies.github.io',
      'prefix':'img_',
      'hash_sep':'#!'
    };

	
  function resize(){
    if(window.innerWidth < 768){
        //
    }else{
        //
    }
  }
  
  $(document).mousedown(function(e){
	//clique droit
	if(e.which === 3){
		// do stuff
	}
  });
	
	
	$(window).on('resize',function(){
		resize();
	});
	$(window).on('load',function(){
	 	resize();
	});
  
    /*

	*/
  
  
  /* liste les repertoires img_xxx dans img pour afficher le menu */
  $.ajax({
    url: siteinfo.github_repo+"/branches",
    success: function(data){
      // récupération du dernier sha last commit du repos
      getShaImgAndListImg(data[0].commit.sha) ;
    }
  });
  function getShaImgAndListImg(github_repo_sha){
    $.ajax({
      url: siteinfo.github_repo+"/git/trees/"+github_repo_sha,
      success: function(data){
      
        // Récupération du sha du dossier img et listImg
        $.each(data.tree,function(){
          if( this.path == "img"){
            listImg(this.sha);
          }
        });
      }
    });
  }
  function listImg(img_sha){
  $.ajax({
		url: siteinfo.github_repo+"/git/trees/"+img_sha,
		success: function(data){
      
			// data.tree array des items du sha dans l'API Github
			$.each(data.tree,function(){
				
				var atext = this.path ;
				
				if(atext.match(siteinfo.prefix)){
					$('#menu-panel ul').append(
					'\
					<li class="menu-panel-item menu-panel-item-img">\
						<a class="load-menu" href="'+ siteinfo.hash_sep +
						atext.replace(siteinfo.prefix,'')+ siteinfo.hash_sep +
						this.sha+
						'" title="'+atext.replace(siteinfo.prefix,'').replace(/%20/g,' ')+'">'+
						atext.replace(siteinfo.prefix,'').replace(/%20/g,' ')+'</a></li>'
					);
				}
			});
 		},
		complete: function(){
			$('#menu-panel').trigger('updatelayout');
			$('#menu-panel ul').listview().listview('refresh');
		}
	});
  } // Fin : listImg sur Github
  // Fin : liste des répertoires img
  
 // pannel image droite
 $(document).on('click','#menu-panel-img .item',function(e){
  e.preventDefault();
  var imagePanel = $(this).find("img") ;
  var attrSrcNew = imagePanel.attr('src'), attrAltNew = imagePanel.attr('alt'), attrIdNew = imagePanel.attr('id') ;
  attrIdNew = attrIdNew.replace('item-','img-');
  $("#carousel-main .item img").fadeOut(function(){
    $(this).attr('src',attrSrcNew).attr('alt',attrAltNew).attr('id',attrIdNew) ;
    $("#carousel-main .item img").fadeIn();
  });
 });
   
   // pannel menu gauche
   $(document).on('click','.load-menu',function(e){
		
		e.stopPropagation();
		e.preventDefault();

    var hashTab = e.currentTarget.href.split(siteinfo.hash_sep) ;
    var sha = hashTab.pop();
    var basenameImg = hashTab.pop();
    
		document.location.hash =  siteinfo.hash_sep + basenameImg +
                              siteinfo.hash_sep + sha ;
  }); // end on .menu-img-item event
   
  $(window).on('hashchange',function(){
    displayMenu() ;
  });
   
  function displayMenu(){
    var hashTab = window.location.href.split(siteinfo.hash_sep) ;
    var sha = hashTab.pop();
    var basenameImg = hashTab.pop();
    
    $.ajax({
    url: siteinfo.github_repo+"/git/trees/"+sha,
    success: function(data){

      $('#menu-panel-img ul .item').remove();
      
      var i = 1 ;
      
      // Pour chaque image on récupère le path (son nom)
      $.each(data.tree,function(){
        var hrefImg = siteinfo.url+"/img/"+
                      siteinfo.prefix+basenameImg+
                      "/"+this.path ;
        
        if( i === 1 ){
            $("#carousel-main .item img").fadeOut(function(){
              $(this).attr('src',hrefImg).attr('alt',$(this).attr('href')).attr('id','img-1') ;
              $("#carousel-main .item img").fadeIn();
            });
            if(! $("#next").length > 0 ){							
              $('#carousel-main').append('\
                <span id="next" role="next" class="ui-link ui-btn ui-btn-b ui-icon-arrow-r ui-btn-icon-notext next"></span>\
                <span id="prev" role="prev" class="ui-link ui-btn ui-btn-b ui-icon-arrow-l ui-btn-icon-notext prev"></span>\
              ');
            }
        }
        
        $('#menu-panel-img ul').append('\
            <li class="item">\
              <a href="#item-'+ i +'"><img id="item-'+ i +'" src="'+ hrefImg +'" alt="'+ this.path +'" /></a>\
            </li>');
        i++;
        
      }) ; // Fin du each
    }
    });
    
    
    $('#menu-panel').panel( 'close' ) ;
  } // Fin : displayMenu
   
	$(document).on('click','.rel-home',function(e){
		e.preventDefault();
		document.location.href = siteinfo.url ;
		// location.reload();
	});
	
	$(document).on('click','#prev',function(e){
		e.preventDefault();
		arrownav('prev');
	});
	$(document).on('click','#next',function(e){
		e.preventDefault();
		arrownav('next');
	});
	
	function arrownav(direction){
		var carousel = $('#carousel-main img') ; 
		var idImg = carousel.attr('id').replace('img-','') ;
		var idImgNew ;
		if(direction === 'prev'){
			idImgNew = parseInt(idImg) - 1 ;
			if(! $('#menu-panel-img #item-'+idImgNew).length > 0 ){ // si pas dans le menu sur un prev ou next on prend le premier ou le dernier
				idImgNew = $('#menu-panel-img img').length ;
			}
		}
		if(direction === 'next'){
			idImgNew = parseInt(idImg) + 1 ;
			if(! $('#menu-panel-img #item-'+idImgNew).length > 0 ){ // si pas dans le menu sur un prev ou next on prend le premier ou le dernier
				idImgNew = 1 ;
			}
		}
		var attrSrcNew = $('#menu-panel-img #item-'+idImgNew).attr('src') ;
		var attrAltNew = $('#menu-panel-img #item-'+idImgNew).attr('alt') ;
		
		console.log(idImgNew);
		carousel.fadeOut(function(){
			$(this).attr('src',attrSrcNew).attr('alt',attrAltNew).attr('id','img-'+idImgNew) ;
			carousel.fadeIn();
		});
	}
	
});