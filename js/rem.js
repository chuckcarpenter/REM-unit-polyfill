(function(window, undefined) {
    // replacement for IE8 not using getComputedStyle
    // if ( !window.getComputedStyle ) {
    //     window.getComputedStyle = function( el, pseudo ) {
    //         this.el = el;
    //         this.getPropertyValue = function( prop ) {
    //             var re = /(\-([a-z]){1})/g;
    //             if ( prop === 'float' ) prop = 'styleFloat';
    //             if ( re.test(prop) ) {
    //                 prop = prop.replace(re, function () {
    //                     return arguments[2].toUpperCase();
    //                 });
    //             }
    //             return el.currentStyle[prop] ? el.currentStyle[prop] : null;
    //         };
    //         return this;
    //     };
    // }

    var cssremunit =  function() {
        var div = document.createElement( 'div' );
            div.style.cssText = 'font-size: 1rem;';

        return (/rem/).test(div.style.fontSize);
    },

    isStyleSheet = function() {
        var styles = document.getElementsByTagName('link');
        var filteredStyles = [];
        
        for (i = 0; i < styles.length; i++) {
             if ( styles[i].rel === 'stylesheet' )
                filteredStyles.push( styles[i] );
        }

        return filteredStyles;
    },
    
    processSheets = function () {
        var links = [];
        sheets = isStyleSheet(); //search for link tags and confirm it's a stylesheet
        sheets.og = sheets.length; //store the original length of sheets as a property
        for( var i = 0; i < sheets.length; i++ ){
            links[i] = sheets[i].href;
            xhr( links[i], matchcss, i );
        }
    },
    
    matchcss = function ( response, i ) { //collect all of the rules from the xhr response texts and match them to a pattern
        var pattern = /[\w\d\.\,\[\]\^\>\/<\+\~\|\-\_\$\#\"\'\/\*\\\=\s]+\{[\w\d\.\-\(\)\%\:\;\'\"\/\*\\\s]+\d*\.{0,1}\d+rem[\w\d\.\-\(\)\%\:\;\'\"\/\*\\\s]+\}/g; //find selectors that use rem in one or more of their rules
        var current = response.responseText.match(pattern);
        var remPattern =/\d*\.{0,1}\d+rem/g;
        var remCurrent = response.responseText.match(remPattern);
        if( current !== null && current.length !== 0 ){
            found = found.concat( current ); //save all of the blocks of rules with rem in a property
            foundProps = foundProps.concat( remCurrent ); //save all of the properties with rem
        }
        if( i === sheets.og-1 ){
            buildIt();
        }
    },

    buildIt = function() { //first build each individual rule from elements in the found array and then add it to the string of rules.
        var pattern = /[\w\d\.\-\(\)\%\:\'\"\/\*\\\s]+\d*\.{0,1}\d+rem[\w\d\.\-\(\)\%\:\'\"\/\*\\\s]*;/g; //find properties with rem values in them
        for( var i = 0; i < found.length; i++ ){
            rules = rules + found[i].substr(0,found[i].indexOf("{")+1); //save the selector portion of each rule with a rem value
            var current = found[i].match( pattern );
            for( var j = 0; j<current.length; j++ ){ //build a new set of with only the selector and properties that have rem in the value
                rules = rules + current[j];
                if( j === current.length-1 ){
                    rules = rules + "\n}";
                }
            }
        }

        parseIt();
    },

    parseIt = function () { //replace each set of parentheses with evaluated content
        for( var i = 0; i < found.length; i++ ){
            css[i] = Math.round( eval(found[i].substr(0,found[i].length-3)*fontSize) ) + 'px';
        }

        loadCSS();
    },

    loadCSS = function () { //replace and load the new rules
        for( var i = 0; i < css.length; i++ ){ //only run this loop as many times as css has entries
            if( css[i] ){
                rules = rules.replace( found[i],css[i] ); //replace old rules with our processed rules
            }
        }
        rules = removeComments( rules );
        var remcss = document.createElement( 'style' );
        remcss.setAttribute( 'type', 'text/css' );
        remcss.id = 'remReplace';
        remcss.innerHTML = rules;
        document.getElementsByTagName( 'head' )[0].appendChild( remcss );   //create the new element
    },

    xhr = function ( url, callback, i ) { //create new XMLHttpRequest object and run it
        var xhr = getXMLHttpRequest();
        xhr.open( 'GET', url, true );
        xhr.send();
        xhr.onreadystatechange = function() {
            if ( xhr.readyState === 4 ){
                callback(xhr, i);
            } else { //callback function on AJAX error
                
            }
        };
    },

    removeComments =  function( css ) {
    	return css.replace(/\/\*[\w\d\.\,\[\]\^\>\<\+\~\|\-\_\$\#\"\'\/\*\\\=\s\{\}\(\)]*\*\//g, "");
    },

    getXMLHttpRequest = function () { //we're gonna check if our browser will let us use AJAX
        if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }
    };

    if( !cssremunit() ){ //this checks if the rem value is supported
        var rules = ''; //initialize the rules variable in this scope so it can be used later
        var sheets = []; //initialize the array holding the sheets for use later
        var found = []; //initialize the array holding the found rules for use later
    	var foundProps = []; //initialize the array holding the found properties for use later
        var css = []; //initialize the array holding the parsed rules for use later
        var body = document.getElementsByTagName("body")[0];
        var fontSize = "";
        if (body.currentStyle) {
            fontSize = (body.currentStyle["fontSize"].replace("%","") / 100) * 16; //IE8 returns the percentage while other browsers return the computed value
        } else if (window.getComputedStyle)
            fontSize = document.defaultView.getComputedStyle(body, null).getPropertyValue("font-size").replace("px",""); //find font-size in body element
        processSheets();
    } else {
        // do nothing, you are awesome and have REM support
    }

})(window);