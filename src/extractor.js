import cheerio from 'cheerio'
import Pofile from 'pofile'


class Translation {
  constructor(filename, lineNumber, msg) {
    this.filename = filename
    this.lineNumber = lineNumber
    this.msg = msg
  }

  toPofileItem() {
    const item = new Pofile.Item()
    item.msgid = this.msg
    item.msgctxt = null
    item.references = [`${this.filename}:${this.lineNumber}`];
    item.msgid_plural = null
    item.msgstr = []
    item.extractedComments = []
    return item
  }
}


export default class Extractor {

  constructor(options) {
    this.options = Object.assign({
      startDelim: '{{',
      endDelim: '}}',
      attributes: ['v-text'],
    }, options)
    this.translations = []
  }

  parse(filename, content) {
    const $ = cheerio.load(content, {
      decodeEntities: false,
      withStartIndices: true,
    })

    const translations = $('template *').map(function (i, el) {
      const node = $(el)
      const msg = this.extractTranslationMessage(node)
      if (msg) {
        const truncatedText = content.substr(0, el.startIndex)
        const lineNumber = truncatedText.split(/\r\n|\r|\n/).length
        return new Translation(filename, lineNumber, msg)
      }
    }.bind(this)).get()

    this.translations = this.translations.concat(translations)
  }

  extractTranslationMessage(node) {
    // extract from attributes
    for (let attr of this.options.attributes) {
        if (node.attr(attr)) {
          const content = node.attr(attr)

          // match text with format $t([string literal]) 
          const re = new RegExp('.*\\$t\\([\'\"\`](.*)[\'\"\`]\\).*')
          const matches = re.exec(content)

          if (matches) {
            return matches[1]
          }
        }
      }
  }

  toPofile() {
    const pofile = new Pofile()
    pofile.headers = {
      'Last-Translator': 'vue-i18n-xgettext',
      'Content-Type': 'text/plain; charset=UTF-8',
      'Content-Transfer-Encoding': '8bit',
      'MIME-Version': '1.1',
    }

    const itemMapping = {}
    for (let translation of this.translations) {
      const item = translation.toPofileItem()
      if (!itemMapping[item.msgid]) {
        itemMapping[item.msgid] = item
      } else {
        const oldItem = itemMapping[item.msgid]
        // TODO: deal with plurals/context
        if (item.references.length && oldItem.references.indexOf(item.references[0]) === -1) {
          oldItem.references.push(item.references[0])
        }
        if (item.extractedComments.length && soldItem.extractedComments.indexOf(item.extractedComments[0]) === -1) {
          oldItem.extractedComments.push(item.extractedComments[0])
        }
      } 
    }

    for (let msgid in itemMapping) {
      const item = itemMapping[msgid]
      pofile.items.push(item)
    }

    pofile.items.sort((a, b) => a.msgid.localeCompare(b.msgid))
    return pofile
  }

  toString() {
    return this.toPofile().toString()
  }
}

