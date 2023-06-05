const fs = require('fs')
const path = require('path')

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

/* Unfortunately, we can't yet import this function from engine/rules */
const encodeRuleName = (name) =>
	name
		.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-')

fs.writeFileSync(destinationURL, baseURLs, 'utf8')

const releasePath = path.resolve(
	__dirname,
	'../source/locales/releases/releases-fr.json'
)
const rawdata = fs.readFileSync(releasePath)
const data = JSON.parse(rawdata)
const newsURL = Object.values(data)
	.map(
		(version) =>
			`https://nosgestesclimat.fr/nouveautés/${encodeRuleName(version.name)}`
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
					`https://nosgestesclimat.fr/documentation/${encodeRuleName(
						dottedName
					)}`
			)
			.join('\n')
		const questionURLs = ruleNames
			.filter((dottedName) => {
				const rule = json[dottedName]
				return (
					rule != undefined && typeof rule === 'object' && 'question' in rule
				)
			})
			.map(
				(dottedName) =>
					`http://localhost:8080/simulateur/bilan/${encodeRuleName(dottedName)}`
			)
			.join('\n')
		fs.appendFileSync(
			destinationURL,
			documentationURLs + '\n' + questionURLs,
			'utf8'
		)
		console.log('Sitemap mis à jour avec les dernières règles publicodes :)')
	})
