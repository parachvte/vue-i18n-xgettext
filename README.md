xgettext for vue-i18n
---

Extract translations from templates that use [vue-i18n](https://github.com/kazupon/vue-i18n), and generate .po file for them.

Since vue-i18n uses json file, but in many cases, .po files are preferred due to historial reasons. We generate .po files from .vue files so that translation work can be done within pot files.

This project is for self-use purpose, so we only support attribute extraction, while translations with delimiter {{ and }} are not supported yet.

(TO BE CONTINUED)

## Installation

```
npm install vue-i18n-xgettext -g
```

## Usage

```
vue-i18n-xgettext --attribute v-text --attribute {another attr} --output message.po Alert.vue Breadcrumb.vue ...
```

file `Breadcrumb.vue`:

```
<template>
  <div class="sp-Breadcrumb">
    <ol>
      <li>
        <a
          class="Breadcrumb-item--name__first"
          href="#"
          v-text="$t('Manage MV')"
          v-link="{ name: 'MVView' }"
        >Manage MV</a>
      </li>
      <li v-if="mvId === 0">
        <span class="Breadcrumb-item--name" v-text="$t('add a MV')"></span>
      </li>
      <li v-if="mvId > 0">
        <span class="Breadcrumb-item--name" v-text="$t('modify MV information')"></span>
      </li>
    </ol>
  </div>
</template>

...
```

then within elements with attribute `v-text`, its translation form `$t("some text to be i18n'd")` will be extracted (only the text itself). Output may look like this:

```
msgid ""
msgstr ""
"Last-Translator: vue-i18n-xgettext\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"MIME-Version: 1.1\n"

#: path/to/Breadcrumb.vue:8
msgid "Manage MV"
msgstr ""

#: path/to/Breadcrumb.vue:13
msgid "add a MV"
msgstr ""

#: path/to/Breadcrumb.vue:16
msgid "modify MV information"
msgstr ""
```

## Reference

- [vue-i18n](https://github.com/kazupon/vue-i18n)
- [easygettext](https://github.com/Polyconseil/easygettext)

## License
MIT
