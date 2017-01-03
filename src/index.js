#!/usr/bin/env node

import fs from 'fs'
import minimist from 'minimist'

import Extractor from './extractor.js'


const argv = minimist(process.argv.slice(2))
const files = argv._.sort() || []
const attributes = argv.attribute || []
const outputFile = argv.output || null

if (!files || files.length === 0) {
  console.log('Usage: vue-i18n-xgettext [--attribute ATTRIBUTE] [--output OUTPUT_FILE] FILES')
  process.exit(1)
}

const defaultAttribtues = ['v-text']
if (typeof attributes === 'string') {
  defaultAttribtues.push(attributes)
} else {
  defaultAttribtues.concat(attributes)
}

const extractor = new Extractor({
  attributes: defaultAttribtues
})

files.forEach(function (filename) {
  const extension = filename.split('.').pop()
  if (extension !== 'vue') {
    console.log(`file ${filename} with extension ${extension} will not be processed (skipped)`)
    return
  }

  let data = fs.readFileSync(filename, {encoding: 'utf-8'}).toString()

  try {
    extractor.parse(filename, data)
  } catch (e) {
    console.trace(e)
    process.exit(1)
  }
})

const output = extractor.toString()
if (outputFile) {
  fs.writeFileSync(outputFile, output)
} else {
  console.log(output)
}

