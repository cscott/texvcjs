# texvcjs x.x.x (not yet released)

* Changed return value of low-level `parse` API to allow providing
  more detailed information about the TeX functions encountered.
* Switch to text mode before emitting \AA and \textvisiblespace.
* Require mandatory argument for \overbrace, \overleftarrow,
  \overleftrightarrow, \overline, \overrightarrow, \underbrace, and
  \underline.
* Only allow \hline at the start of rows in a matrix context.

# texvcjs 0.2.0 (2014-07-23)

* Bug fixes to \begin{...} ... \end{...} environment parsing.
* Expose low-level API (parse, render, AST).

# texvcjs 0.1.0 (2014-07-22)

* First release.
