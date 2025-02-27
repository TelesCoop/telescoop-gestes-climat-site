import * as fs from 'fs'
import * as path from 'path'
import Engine, { utils } from 'publicodes'
import {
	encodeRuleNameToSearchParam,
	isValidRule,
	NGCRulesNodes,
} from '../source/components/publicodesUtils'

const destinationURL = path.resolve(
	__dirname,
	'../source/sites/publicodes/sitemap.txt'
)

const baseURLs = `https://nosgestesclimat.fr/simulateur/bilan
https://nosgestesclimat.fr/vie-privée
https://nosgestesclimat.fr/documentation
https://nosgestesclimat.fr/modèle
https://nosgestesclimat.fr/à-propos
https://nosgestesclimat.fr/pétrole-et-gaz
https://nosgestesclimat.fr/nouveautés
https://nosgestesclimat.fr/groupe
https://nosgestesclimat.fr/profil
https://nosgestesclimat.fr/partenaires
https://nosgestesclimat.fr/contribuer
https://nosgestesclimat.fr/personas
https://nosgestesclimat.fr/stats
https://nosgestesclimat.fr/actions
https://nosgestesclimat.fr/actions/plus
`

// /* Unfortunately, we can't yet import this function from engine/rules */
// const encodeRuleNameURL = (name) =>
// 	name
// 		.replaceAll(/\s\.\s/g, '/')
// 		.replaceAll(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
// 		.replaceAll(/\s/g, '-')
//
// const encodeRuleNameSearchParam = (name) =>
// 	encodeRuleNameURL(name).replaceAll('/', '.')

fs.writeFileSync(destinationURL, baseURLs, 'utf8')

const releasePath = path.resolve(
	__dirname,
	'../source/locales/releases/releases-fr.json'
)
const rawdata = fs.readFileSync(releasePath)
const data = JSON.parse(rawdata.toString())
const newsURL = Object.values(data)
	.map(
		(version: any) =>
			`https://nosgestesclimat.fr/nouveautés/${utils.encodeRuleName(
				version.name
			)}`
	)
	.join('\n')
fs.appendFileSync(destinationURL, newsURL + '\n', 'utf8')

console.log('Sitemap mis à jour avec les dernières nouveautés :)')

fetch('https://data.nosgestesclimat.fr/co2-model.FR-lang.fr.json')
	.then((res) => res.json())
	.then((json) => {
		const ruleNames = Object.keys(json)
		const documentationURLs = ruleNames
			.map(
				(dottedName) =>
					`https://nosgestesclimat.fr/documentation/${utils.encodeRuleName(
						dottedName
					)}`
			)
			.join('\n')
		const parsedRules: NGCRulesNodes = new Engine(json).getParsedRules()
		const questionURLs = ruleNames
			.filter((dottedName) => isValidRule(dottedName, parsedRules))
			.map(
				(dottedName) =>
					`http://localhost:8080/simulateur/bilan?question=${encodeRuleNameToSearchParam(
						dottedName
					)}`
			)
			.join('\n')
		fs.appendFileSync(
			destinationURL,
			documentationURLs + '\n' + questionURLs,
			'utf8'
		)
		console.log('Sitemap mis à jour avec les dernières règles publicodes :)')
	})
