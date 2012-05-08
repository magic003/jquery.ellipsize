jquery.ellipsize
================

This is a jQuery ellipsis plugin based on [jquery-ellipsis](https://github.com/sakura-sky/jquery-ellipsis), with the following enhancements:
    * Using binary search to calculate the fit content
    * Taking care of the embedded HTML markup

Known Issues
------------

* It goes into an infinite loop if the cut element is a text node.
