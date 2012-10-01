jQuery.ajaxPrefilter( "img", function( s ) {
	if ( s.cache == null ) {
		s.cache = false;
	}
	s.type = "GET";
	s.async = true;
});

jQuery.ajaxTransport( "img", function( s ) {
	var callback, $img, img, widthProp;
	return {
		send: function( _, complete ) {
			callback = function( success ) {
				if ( success != null ) {
					if ( success ) {
						complete( 200, "OK", { img: img } );
					} else {
						complete( 404, "Not Found" );
					}
				}

				if ( $img ) {
					$img.remove();
				}
				$img = img = callback = widthProp = null;
			};

			$img = jQuery( "<img>", { src: s.url } );
			img = $img[ 0 ];
			widthProp = typeof img.naturalWidth === "undefined" ? "width" : "naturalWidth";

			if ( img.complete ) {
				callback( !!img[ widthProp ] );
			} else {
				$img.bind( "load error", function( event )  {
					callback( event.type === "load" );
				});
			}
		},
		abort: function() {
			if ( callback ) {
				callback();
			}
		}
	};
});
