const { I18n } = require('i18n')
const { join } = require("path");
const { readFileSync } = require("fs")

const yaml = require('js-yaml')

module.exports = () => {
    const i18n = new I18n()

    i18n.configure({
        extension: '.yml',
        parser: yaml,
        directory: join(__dirname, 'locales'),
        staticCatalog: {
            en: yaml.load(readFileSync(join(__dirname, '/locales/en.yml'), 'utf8')),
            fr: yaml.load(readFileSync(join(__dirname, '/locales/fr.yml'), 'utf8'))
        },
        defaultLocale: 'en'
    })

    return i18n
}
