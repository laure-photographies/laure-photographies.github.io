$(function() {
	/* */
	
    var siteinfo = { 
        'url':'http://laure-photographies.github.io',
		'list_img':'https://api.github.com/repos/laure-photographies/laure-photographies.github.io/git/trees/e3027ebe14274e5051299694b7d2a474a93c9e7b',
        //'baseurl':'https://googledrive.com',
		'prefix':'img_'
    };
	/*	*/
	/*  
	var siteinfo = { 
		'url':'http://localhost',
		'baseurl': 'http://locahost',
		'prefix':'img_'
	};
	/* */	
	
	
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
	 	var basenameImgFolder = window.location.href.split('#!') ;
		basenameImgFolder = basenameImgFolder.pop();
		if(basenameImgFolder.length > 0){
			displayMenu();
		}
	});
  
    /*

	*/
  
  
  /* liste les repertoires img_xxx dans img pour afficher le menu */
  $.ajax({
		url: siteinfo.list_img,
		success: function(data){
			console.log(data);
			$(data).find(".files .content a").each(function(){
				//var atext = $(this).a.replace('/','');
				var atext = $(this).attr('href');
				atext = atext.split('/');
				atext = atext.pop();

				if(atext.match(siteinfo.prefix)){
					$('#menu-panel ul').append(
					'\
					<li class="menu-panel-item menu-panel-item-img">\
						<a class="load-menu" href="#!'+
						atext.replace(siteinfo.prefix,'')+'" title="'+atext.replace(siteinfo.prefix,'').replace(/%20/g,' ')+'">'+
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
		
		//history.pushState({key:'value'},'titre',e.currentTarget.href);
		var basenameImgFolder = e.currentTarget.href.split('#!') ;
		basenameImgFolder = basenameImgFolder.pop();
		document.location.hash = "!" + basenameImgFolder;


   }); // end on .menu-img-item event
   
   $(window).on('hashchange',function(){
		displayMenu() ;
   });
   
   function displayMenu(){
	var basenameImgFolder = window.location.href.split('#!') ;
	basenameImgFolder = basenameImgFolder.pop();

		var	urlmenu = siteinfo.url + "/img/" + siteinfo.prefix + basenameImgFolder;
				
		  $.ajax({
			url: urlmenu,
			success: function(data){
				$('#menu-panel-img ul .item').remove();
				var i = 1 ;
				$(data).find("a[href*='.jpg']").each(function(){
					var basenameImg = $(this).attr('href').split('/') ;
					basenameImg = basenameImg.pop();
					if( i === 1 ){
							$("#carousel-main .item img").fadeOut(function(){
								$(this).attr('src',urlmenu +"/"+ basenameImg).attr('alt',$(this).attr('href')).attr('id','img-1') ;
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
								<a href="#item-'+ i +'"><img id="item-'+ i +'" src="'+ urlmenu +"/"+ basenameImg +'" alt="'+ $(this).attr('href') +'" /></a>\
							</li>');
					i++;
				}) ;
			}
		  });
		  $('#menu-panel').panel( 'close' ) ;
   }
   
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