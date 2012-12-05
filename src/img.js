jQuery.ajaxPrefilter( "img", function( s ) {
	if ( s.cache == null ) {
		s.cache = false;
	}
	s.type = "GET";
	s.async = true;
});

jQuery.ajaxTransport( "img", function( s ) {
	var callback;
	return {
		send: function( _, complete ) {
			var image, widthProp;
			callback = function( success ) {
				var img = image;
				callback = widthProp = image = image.onload = image.onerror = null;
				if ( success != null ) {
					if ( success ) {
						complete( 200, "OK", { img: img } );
					} else {
						complete( 404, "Not Found" );
					}
				} else {
					img.src = null;
				}
			};
			image = document.createElement('img');
			widthProp = typeof image.naturalWidth === "undefined" ? "width" : "naturalWidth";

			image.onload = function() {
				callback( true );
			};
			image.onerror = function() {
				callback( false );
			};
			image.src = s.url;

			if ( image.complete ) {
				callback( !!image[ widthProp ] );
			}
		},
		abort: function() {
			if ( callback ) {
				callback();
			}
		}
	};
});
