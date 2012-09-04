# test if REM on div element works
cssremunit = ->
    div = document.createElement 'div'; div.style.cssText = 'font-size: 1rem;'
    return /rem/.test div.style.fontSize

if cssremunit() 
	return null
else
    rules = ''; sheets = []; found = []; foundProps = []; css = []; fontSize = '';
    base = document.getElementsByTagName('html')[0]
    remComments = /\/\*[\w\d\.\,\[\]\^\>\<\+\~\|\-\_\$\#\"\'\/\*\\\=\s\{\}\(\)]*\*\//g
    remPattern = /\d*\.{0,1}\d+rem/g
    #find selectors that use rem in one or more of their rules
    remSelectors = /[\w\d\.\,\:\[\]\^\>\/\<\+\~\|\-\_\$\#\"\'\/\*\\\=\s]+\{[\w\d\.\,\-\(\)\%\#\:\;\'\"\/\*\\\s]+\d*\.{0,1}\d+rem[\w\d\.\,\-\(\)\%\#\:\;\'\"\/\*\\\s]+\}/g
    buildPattern = /[\w\d\.\,\:\[\]\^\>\/\<\+\~\|\-\_\$\#\"\'\/\*\\\=\s]+\{[\w\d\.\,\-\(\)\%\#\:\;\'\"\/\*\\\s]+\d*\.{0,1}\d+rem[\w\d\.\,\-\(\)\%\#\:\;\'\"\/\*\\\s]+\}/g
    if base.currentStyle
	    fontSize = (base.currentStyle['fontSize'].replace('%', '') / 100) * 16 #IE8 returns the percentage while other browsers return the computed value
    else
	    fontSize = document.defaultView.getComputedStyle(base, null).getPropertyValue('font-size').replace('px', '') #find font-size in base element

	#filter returned link nodes for stylesheets
    isStyleSheet = ->
        styles = document.getElementsByTagName "link"
        
        filteredStyles = ( filtered for filtered in styles when filtered.rel is "stylesheet" and not filtered.hasAttribute "data-norem" )            

    #search for link tags and confirm it's a stylesheet
    processSheets = ->
        sheets = isStyleSheet() #search for link tags and confirm it's a stylesheet
        sheets.og = sheets.length-1 #store the original length of sheets as a property

        getLinks links.href, matchcss, i for links, i in sheets
    
    #collect all of the rules from the xhr response texts and match them to a pattern
    matchcss = ( repsonse, i )->
    	current = repsonse.responseText.match remSelectors
    	remCurrent = repsonse.responseText.match remPattern
    	if current isnt null and current.length isnt 0
    		found = found.concat current
    		foundProps = foundProps.concat remCurrent
    	buildIt() if i is sheets.og
    # this loop doesnt parse correctly. reference source JS
    buildIt = -> #first build each individual rule from elements in the found array and then add it to the string of rules.
        i = 0
        while i < found.length
            rules = rules + found[i].substr(0, found[i].indexOf("{") + 1) #save the selector portion of each rule with a rem value
            current = found[i].match buildPattern
            j = 0 #build a new set of with only the selector and properties that have rem in the value

            while j < current.length
                rules = rules + current[j]
                rules = rules + "\n}" if j is current.length - 1
                j++
            i++
        parseIt()

    parseIt = -> #replace each set of parentheses with evaluated content
        css = ( Math.round(eval(rems.substr(0, rems.length - 3) * fontSize)) + "px" for rems in foundProps )
        loadCSS()

    loadCSS = -> #replace and load the new rules
        i = 0 #only run this loop as many times as css has entries

        while i < css.length
            rules = rules.replace(foundProps[i], css[i])  if css[i] #replace old rules with our processed rules
            i++

        rules = removeComments rules
        remcss = document.createElement "style"
        remcss.setAttribute "type", "text/css"
        remcss.id = "remReplace"
        document.getElementsByTagName("head")[0].appendChild remcss #create the new element
        remcss.styleSheet.cssText = rules # IE8 will not support innerHTML on read-only elements, such as STYLE

    getLinks = (url, callback, i) -> #create new XMLHttpRequest object and run it
        if window.XDomainRequest
            xdr = new XDomainRequest()
            xdr.open "get", url
            xdr.onload = -> callback xdr, i
            xdr.onerror = -> alert "IE XDR load fail."
            xdr.send()
        else
            xhr = new XMLHttpRequest()
            xhr.open "GET", url, true
            xhr.send()
            xhr.onreadystatechange = ->
                if xhr.readyState is 4
                    callback xhr, i
                else #callback function on AJAX error

    removeComments = ( rules ) -> rules.replace remComments, ""

    processSheets()
