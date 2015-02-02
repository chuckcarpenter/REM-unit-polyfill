[REM unit polyfill](http://chuckcarpenter.github.io/REM-unit-polyfill/)
=================

No fluff here. The polyfill will test any browser for REM support and patch it up if needed, although we all know IE8 and below is where the issue lies. Once lack of support is determined, it reads all the link tags for stylesheets and finds selectors that have rules using the REM unit. It then recalculates those rules to PX and writes them in the head to override in the cascade. Magic.

Special shout out to [Lucas Serven](https://github.com/lsvx) for the first version and all the amazing RegEx that's gone into this. 

It has been tested on a large production publishing site and works great with minor performance differences. 

We're always open to suggestions and/or improvements, so please fork!

Getting Started
---------------

Using rem.js is a cinch; you can load the polyfill conditionally using a loader like [yepnope](http://yepnopejs.com/) or simply by including a reference to it in your page like so: `<script src="js/rem.js" type="text/javascript"></script>`. As a best practice, you should either reference rem.js after all of your stylesheets or, better yet, at the end of your `<body>` tag.

In some cases you may want the polyfill to skip some stylesheets; if that's you then just add `data-norem` as an attribute to the link tags of the stylesheets to be ignored. There are a few reasons you may want to do this: if you are loading a crazy long stylesheet that you know doesn't use REM units, then having the polyfill skip it will give your page a moderate speed boost and will help avoid a Flash of Unstyled Content; and if your page loads CSS from another domain that doesn't have CORS enabled then you should tell the polyfill to ignore that CSS since it will not be able to load the stylesheet.

This repo includes a small example so you can bring up the polyfill in your browser to see how it works.

Install using Bower
-------------------
`bower install REM-unit-polyfill`

License
-------

This content is released under the [MIT License](http://chuckcarpenter.mit-license.org).
