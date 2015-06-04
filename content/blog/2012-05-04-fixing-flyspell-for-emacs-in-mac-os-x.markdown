---
image:
  feature: /images/threaded-blue-on-black-cropped.jpg
layout: post
title: "Fixing Flyspell for Emacs in Mac OS X"
date: 2012-05-04
comments: true
categories: mac emacs brew
---
I use the <a href="http://www.emacswiki.org/emacs/FlySpell">flyspell-mode</a> as a spell checking mechanism in emacs. Recently, I moved to Mac OS X, and I began to get this error whenever I started emacs:
{% codeblock lang:bash %}
Error enabling Flyspell mode:
(Searching for program No such file or directory aspell)
{% endcodeblock %}

I had installed aspell with Homebrew. The issue seemed to be that Emacs was unable to find the aspell binary. Homebrew installs binaries in **/usr/local/bin** and it was in my $PATH. It turns out Emacs uses it's own exec path to look for binaries to execute in sub-processes. So the fix is to add the **/usr/local/bin** path to the exec-path. This is the change needed to the **~/.emacs** file:
{% codeblock lang:clojure %}
 '(exec-path (quote ("/usr/bin" "/bin" "/usr/sbin" "/sbin" "/usr/local/bin"))))
{% endcodeblock %}

Notice the **/usr/local/bin** in there.

## Update
This does not seem to work. A better way to do this is to add the
following:

```clojure
(setenv "PATH" (concat (getenv "PATH") ":/usr/local/bin"))
(setq exec-path (append exec-path '("/usr/local/bin")))
```