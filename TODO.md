# Future Tasks

* Parse \limits and \nolimits more precisely -- there is a small set of
  functions they are valid after.
* Return information about the packages required to parse a given
  TeX string.  In particular: amsmath, teubner, euro, cancel, etc.
  This info is in
  https://git.wikimedia.org/blob/mediawiki%2Fextensions%2FMath/d0e998fbb0377bf71f89167ad36b0375b1c462ed/math%2Ftexutil.ml
* Verify UTF-8 handling
  - does CLI handle utf-8 correctly?
  - can we safely include utf-8 inside an \mbox?
* Move contains_func() implementation from test/ into official API.
