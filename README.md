REM unit polyfill
=================

No fluff here. You can load this conditionally or just include a reference in your page. This will test for REM support, although we all know <IE8 is where the issue lies. 

An example is included that is small and you can bring up in your favorite browser to see how it works. Once lack of support is determined, the polyfill reads all links for stylesheets and finds selectors that have rules using the REM unit. It then recalculates those to PX and writes them in the head to override in the cascade. Magic.

Special shout out to [Lucas Serven](https://github.com/lsvx) for the first version and all the amazing RegEx that's gone into this. 

It's been tested on a large production publishing site and worked great in with minor performance differences. 

We're always open to suggestions and/or improvements, so please fork!

License
=======

This content is released under the [MIT License](http://chuckcarpenter.mit-license.org).