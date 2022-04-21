import { resetSimulation } from 'Actions/actions'
import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { setDifferentSituation } from '../../actions/actions'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import { useEngine } from '../../components/utils/EngineContext'
import { ScrollToTop } from '../../components/utils/Scroll'
import { situationSelector } from '../../selectors/simulationSelectors'
import { CardGrid } from './ListeActionPlus'

export default ({}) => {
	const persona = useSelector((state) => state.simulation?.persona)

	return (
		<div>
			<ScrollToTop />
			<h1>Personas</h1>
			<p>
				<em>Cliquez pour charger un dans le simulateur.</em>
			</p>
			{persona && (
				<IllustratedMessage
					emoji="✅"
					message={<p>Persona sélectionné : {persona}</p>}
				/>
			)}

			<PersonaGrid />
			<p>
				Les personas nous permettront de prendre le parti d'une diversité
				d'utilisateurs quand ils voient notamment notre écran "passer à
				l'action".
			</p>
			<h2>Comment créer un persona ?</h2>
			<p>
				C'est dans le fichier{' '}
				<a href="https://github.com/datagir/nosgestesclimat-site/blob/master/source/sites/publicodes/personas.yaml">
					personas.yaml
				</a>{' '}
				que ça se passe. On peut soit copier coller les données d'un autre
				persona et les modifier, soit en créer un de zéro depuis la simulation.
				Une fois la simulation satisfaisante, cliquer sur "Modifier mes
				réponses" puis taper Ctrl-C, ouvrir la console du navigateur (F12),
				vérifiez bien que vous êtes dans l'onglet "Console", allez tout en bas
				de la console (elle est un peu chargée...), puis copier le JSON affiché,
				le coller dans <a href="https://www.json2yaml.com">cet outil</a> pour
				générer un YAML, puis l'insérer dans personas.yaml.
			</p>

			<p>
				Pour les prénoms, on peut utiliser{' '}
				<a href="https://lorraine-hipseau.me">ce générateur</a>.
			</p>
		</div>
	)
}

export const PersonaGrid = ({ additionnalOnClick }) => {
	const dispatch = useDispatch(),
		objectif = 'bilan'
	const persona = useSelector((state) => state.simulation?.persona)
	const situation = useSelector(situationSelector)

	const rules = useSelector((state) => state.rules)

	const personasRules = Object.entries(rules)
		.filter(([dottedName]) => dottedName.includes('personas'))
		.map((arr) => {
			return arr[1]
		})

	const [warning, setWarning] = useState(false)

	const engine = useEngine()

	const setPersona = (persona) => {
		engine.setSituation({}) // Engine should be updated on simulation reset but not working here, useEngine to be investigated
		const { nom, icônes, data, description } = persona
		const missingVariables = engine.evaluate(objectif).missingVariables ?? {}
		const defaultMissingVariables = Object.entries(missingVariables).map(
			(arr) => {
				return arr[0]
			}
		)
		dispatch(
			setDifferentSituation({
				config: { objectifs: [objectif] },
				url: '/simulateur/bilan',
				// the schema of peronas is not fixed yet
				situation: data.situation || data,
				persona: nom,
				foldedSteps: data.foldedSteps || defaultMissingVariables, // If not specified, act as if all questions were answered : all that is not in the situation object is a validated default value
			})
		)
	}
	const hasSituation = Object.keys(situation).length
	if (warning)
		return (
			<IllustratedMessage
				emoji="⚠️"
				message={
					<div>
						<p>
							Attention, vous avez une simulation en cours : sélectionner un
							persona écrasera votre simulation.{' '}
						</p>{' '}
						<button
							className="ui__ button simple"
							onClick={() => {
								dispatch(resetSimulation())
								setPersona(warning)
								setWarning(false)
							}}
						>
							Continuer
						</button>
						<button
							className="ui__ button simple"
							onClick={() => setWarning(false)}
						>
							Annuler
						</button>
					</div>
				}
			/>
		)

	return (
		<CardGrid css="padding: 0; justify-content: center">
			{personasRules.map((persona) => {
				const { nom, icônes, data, description, résumé } = persona
				return (
					<li key={nom}>
						<div
							className="ui__ card interactive light-border"
							css={`
								width: 11rem !important;
								height: 15rem !important;
								${nom === persona
									? `border: 2px solid var(--color) !important`
									: ``}
							`}
						>
							<button
								className="ui__ button simple small"
								css={`
									width: 100% !important;
								`}
								onClick={() =>
									hasSituation ? setWarning(persona) : setPersona(persona)
								}
							>
								<div>{emoji(icônes || '👥')}</div>
								<div>{nom}</div>
							</button>
							<p css=" overflow-x: scroll">
								<small>{résumé || description}</small>
							</p>
						</div>
					</li>
				)
			})}
		</CardGrid>
	)
}
