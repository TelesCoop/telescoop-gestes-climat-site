import {
	engineOptions,
	EngineProvider,
	SituationProvider,
} from 'Components/utils/EngineContext'
import {
	configSituationSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'

import useBranchData from 'Components/useBranchData'
import Engine from 'publicodes'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/* This component gets the publicode rules from the good URL,
 * then gives them
 * to the engine to parse, and hence makes it available to the whole component tree
 * through the state (state.rules) as unparsed, or through the useEngine hook as parsed.
 *
 * This component triggers loading rules as soon as possible, BUT the components that use
 * the engine should wait for it to be available. Hence the use of the WithRules
 * component that returns null if rules are not ready in the state.
 *
 * This logic is a handmade and basic implementation of react 18's Suspense for data loading
 * principles. Switching to this experimental feature could be great if we had concurrent
 * loading problems. Here, we only have one block of data (co2.json) at a time.
 * */

export default ({ children }) => {
	const branchData = useBranchData()
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const setRules = (rules) => dispatch({ type: 'SET_RULES', rules })

	useEffect(() => {
		if (!branchData.loaded) return
		if (NODE_ENV === 'development' && branchData.shouldUseLocalFiles) {
			// Rules are stored in nested yaml files
			const req = require.context(
				'../../nosgestesclimat/data/',
				true,
				/\.(yaml)$/
			)

			const rules = req.keys().reduce((memo, key) => {
				const jsonRuleSet = req(key).default || {}
				return { ...memo, ...jsonRuleSet }
			}, {})

			setRules(rules)
		} else {
			fetch(branchData.deployURL + '/co2.json', { mode: 'cors' })
				.then((response) => response.json())
				.then((json) => {
					setRules(json)
				})
		}
	}, [branchData.deployURL, branchData.loaded, branchData.shouldUseLocalFiles])

	return <EngineWrapper rules={rules}>{children}</EngineWrapper>
}

const EngineWrapper = ({ rules, children }) => {
	const engine = useMemo(
			() =>
				console.log('PERF TEST initialize engine') ||
				new Engine(rules, engineOptions),
			[rules, engineOptions]
		),
		userSituation = useSelector(situationSelector),
		configSituation = useSelector(configSituationSelector),
		situation = useMemo(
			() => ({
				...configSituation,
				...userSituation,
			}),
			[configSituation, userSituation]
		)

	return (
		<EngineProvider value={engine}>
			<SituationProvider situation={situation}>{children}</SituationProvider>
		</EngineProvider>
	)
}

export const WithRules = ({ children }) => {
	const rules = useSelector((state) => state.rules)

	if (!rules) return null
	return children
}
