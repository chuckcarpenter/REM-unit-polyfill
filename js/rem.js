(function (window, undefined) {

    // test for REM unit support
    var cssremunit =  function() {
        var div = document.createElement( 'div' );
            div.style.cssText = 'font-size: 1rem;';

        return (/rem/).test(div.style.fontSize);
    },

    // filter returned link nodes for stylesheets
    isStyleSheet = function () {
        var styles = document.getElementsByTagName('link'),
            filteredStyles = [];
        
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
        var pattern = /[\w\d\.\,\:\[\]\^\>\/\<\+\~\|\-\_\$\#\"\'\/\*\\\=\s]+\{[\w\d\.\-\(\)\%\#\:\;\'\"\/\*\\\s]+\d*\.{0,1}\d+rem[\w\d\.\-\(\)\%\#\:\;\'\"\/\*\\\s]+\}/g, //find selectors that use rem in one or more of their rules
            current = response.responseText.match(pattern),
            remPattern =/\d*\.{0,1}\d+rem/g,
            remCurrent = response.responseText.match(remPattern);
        if( current !== null && current.length !== 0 ){
            found = found.concat( current ); //save all of the blocks of rules with rem in a property
            foundProps = foundProps.concat( remCurrent ); //save all of the properties with rem
        }
        if( i === sheets.og-1 ){
            buildIt();
        }
    },

    buildIt = function () { //first build each individual rule from elements in the found array and then add it to the string of rules.
        var pattern = /[\w\d\.\-\(\)\%\#\:\'\"\/\*\\\s]+\d*\.{0,1}\d+rem[\w\d\.\-\(\)\%\#\:\'\"\/\*\\\s]*;/g; //find properties with rem values in them
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
        for( var i = 0; i < foundProps.length; i++ ){
            css[i] = Math.round( eval(foundProps[i].substr(0,foundProps[i].length-3)*fontSize) ) + 'px';
        }
        loadCSS();
    },

    loadCSS = function () { //replace and load the new rules
        for( var i = 0; i < css.length; i++ ){ //only run this loop as many times as css has entries
            if( css[i] ){
                rules = rules.replace( foundProps[i],css[i] ); //replace old rules with our processed rules
            }
        }
        rules = removeComments( rules );
        var remcss = document.createElement( 'style' );
        remcss.setAttribute( 'type', 'text/css' );
        remcss.id = 'remReplace';
        document.getElementsByTagName( 'head' )[0].appendChild( remcss );   //create the new element
        remcss.styleSheet.cssText = rules; // IE8 will not support innerHTML on read-only elements, such as STYLE
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

    removeComments =  function ( css ) {
        return css.replace(/\/\*[\w\d\.\,\[\]\^\>\<\+\~\|\-\_\$\#\"\'\/\*\\\=\s\{\}\(\)]*\*\//g, "");
    },

    getXMLHttpRequest = function () { //we're gonna check if our browser will let us use AJAX
        if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }
    };

    if( !cssremunit() ){ //this checks if the rem value is supported
        var rules = '', //initialize the rules variable in this scope so it can be used later
            sheets = [], //initialize the array holding the sheets for use later
            found = [], //initialize the array holding the found rules for use later
            foundProps = [], //initialize the array holding the found properties for use later
            css = [], //initialize the array holding the parsed rules for use later
            body = document.getElementsByTagName('body')[0],
            fontSize = '';
        if (body.currentStyle) {
            fontSize = (body.currentStyle['fontSize'].replace('%', '') / 100) * 16; //IE8 returns the percentage while other browsers return the computed value
        } else if (window.getComputedStyle)
            fontSize = document.defaultView.getComputedStyle(body, null).getPropertyValue('font-size').replace('px', ''); //find font-size in body element
        processSheets();
    } else {
        // do nothing, you are awesome and have REM support
    }

})(window);