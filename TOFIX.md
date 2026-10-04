# TOFIX

Findings from a code scan on 2026-10-04.

## High

- `jssrc/keynote.php:47` - `$_GET['presentation']` is echoed unescaped into a JavaScript string literal, a reflected XSS (`?presentation=';alert(1);'`); emit it with `json_encode(..., JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT)` or validate it against the files in `presentations/`.
- `jssrc/keynote.php:26` - the viewer loads `../jsout/keynotejs-test.js`, which nothing builds any more (`rsconstruct.toml:66-68` calls the JS pipeline dead), so `Mgr`/`TransBlend` are undefined and every presentation, including the demo linked from `web/index.php:4`, fails to load; switch to the commented-out per-file `<script src="src/...">` list (lines 28-39, matching `support/order.txt`).

## Medium

- `web/index.php:7` - links to `../jsdoc`, which no longer exists (`rsconstruct.toml:67`); also closes a never-opened `</li>`. Remove the link or regenerate the docs.
- `scripts/keynote_java_wrapper.py:14` - builds the classpath from `lib/*.jar` and `out/bin`, but there is no `lib/` in the repo and nothing compiles `src/**/*.java` (no javac/maven/gradle step in `rsconstruct.toml`; `scripts/java_classpath.py:9` has the same problem); the Java converter cannot be built or run from a checkout. Add a dependency manifest (iText, ODF toolkit, args4j/JCommander) and a compile step, or drop the Java part and the wrappers.
- `src/org/meta/keynote/Main.java:41` - `switch` on `getParsedCommand()`, which returns `null` when no sub-command is given, throws `NullPointerException`; check for `null` and print usage.
- `scripts/tagname.py:11` - `check_output` returns `bytes`, so the script prints `b'v1.2'` instead of the tag; pass `text=True` (or `.decode()`).
- `rsconstruct.toml:12` - `processor.ruff`/`processor.mypy` (line 16) and `processor.shellcheck` (line 21) include `src`, which holds only Java; list only `scripts` per the precise-src_dirs rule.

## Low

- `rsconstruct.toml:40` - comment says sgml mode "comes from .aspell.conf", but `.aspell.conf:5` sets `mode markdown` and lines 47-49 say the conf mode is ignored; fix the comment (and the misleading `mode` line).
- `rsconstruct.toml:53` - "All links to veltzer.org must be https; see the script's docstring" refers to a script that does not exist and sits above the unrelated `[dependencies]` block; delete it. Line 67 "see above" points at nothing either.
- `rsconstruct.toml:28` - comments at lines 28, 39 and 62 describe "the Makefile", which is gone; reword to describe the current config.
- `src/org/meta/keynote/Main.java:7` - `oldmain` is dead args4j code (with `CmdLineValues.java`), and `doc/TODO.txt:17` already asks to drop args4j; remove it.
- `scripts/eclipse_java.sh:2` - launches a personal `~/install/eclipse-java` IDE; a machine-specific leftover - delete it.
- `doc/TODO.txt:5` - "do a github io page" / "add website on github" (line 24) are stale, since `README.md:13` already points at the Pages site; prune done items. `web/index.php:4` has the typo "keynot".
