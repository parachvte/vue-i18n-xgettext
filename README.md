xgettext for vue-i18n
---

Extract translations from templates that use [vue-i18n](https://github.com/kazupon/vue-i18n), and generate .po file for them.

Since vue-i18n uses json file, but in many cases, .po files are preferred due to historial reasons. We generate .po files from .vue files so that translation work can be done within pot files.

This project is for self-use purpose, so we only support attribute extraction, while translations with delimiter {{ and }} are not supported yet.

(TO BE CONTINUED)
