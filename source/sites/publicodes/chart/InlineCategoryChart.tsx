import AnimatedLoader from '@/AnimatedLoader'
import { extractCategories } from '@/components/publicodesUtils'
import { useEngine } from '@/components/utils/EngineContext'
import { AppState } from '@/reducers/rootReducer'
import { WithEngine } from '@/RulesProvider'
import {
	currentQuestionSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { useQuery } from '@/utils'
import Engine from 'publicodes'
import React, { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CategoryVisualisation from '../CategoryVisualisation'
import DetailedBarChartIcon from './DetailedBarChartIcon'
import Chart from './index.js'
import { activatedSpecializedVisualisations } from './SpecializedVisualisation'
import SubCategoriesChart from './SubCategoriesChart'
import useContinuousCategory from './useContinuousCategory'

const SpecializedVisualisation = React.lazy(
	() =>
		import(
			/* webpackChunkName: 'SpecializedVisualisation' */ './SpecializedVisualisation'
		)
)

function mapAbreviation(rules: any, engine: Engine) {
	return extractCategories(rules, engine).map((category) => {
		return {
			...category,
			abbreviation: rules[category.dottedName]?.abréviation,
		}
	})
}

export default ({ givenEngine }) => {
	const { t } = useTranslation()
	const situation = useSelector(situationSelector) // needed for this component to refresh on situation change :
	const rules = useSelector((state: AppState) => state.rules)
	const engine = givenEngine ?? useEngine()
	const [categories, setCategories] = useState(mapAbreviation(rules, engine))
	console.log("### categories", categories);
	const tutorials = useSelector((state: AppState) => state.tutorials)

	useEffect(() => {
		setCategories(mapAbreviation(rules, engine))
	}, [rules, situation])

	const displayedCategory = useContinuousCategory(categories)

	const currentQuestion = useSelector(currentQuestionSelector)
	const focusedCategory = useQuery().get('catégorie')

	if (!categories) return null

	const inRespiration =
		displayedCategory &&
		!tutorials['testCategory-' + displayedCategory.dottedName]

	const categoryColor = displayedCategory && displayedCategory.color

	const value = currentQuestion && engine.evaluate(currentQuestion).nodeValue
	const [traditionalChartShown, showTraditionalChart] = useState(false)

	const showSecondLevelChart =
		!inRespiration &&
		displayedCategory &&
		(!focusedCategory || focusedCategory === displayedCategory.dottedName)

	const specializedVisualisationShown =
		activatedSpecializedVisualisations.includes(currentQuestion)

	if (!inRespiration && specializedVisualisationShown)
		return (
			<div
				css={`
					padding: 1rem 0.2rem;
					height: 50rem;
					overflow: scroll;
					margin: 0 auto;
				`}
			>
				<Suspense fallback={<AnimatedLoader />}>
					<WithEngine options={{ optimized: false, parsed: true }}>
						<SpecializedVisualisation
							{...{ currentQuestion, categoryColor, value }}
						/>
					</WithEngine>
				</Suspense>
			</div>
		)

	return (
		<div
			css={`
				margin: 1rem 0;
			`}
		>
			<div
				css={`
					margin-bottom: 1rem;
				`}
			>
				{showSecondLevelChart && (
					<CategoryVisualisation questionCategory={displayedCategory} />
				)}
			</div>
			<SubCategoriesChart
				{...{
					key: 'categoriesChart',
					categories: categories,
					delay: 0,
					indicator: showSecondLevelChart,
					questionCategory: displayedCategory,
					filterSimulationOnClick: true,
					onRestClick: () => showTraditionalChart(!traditionalChartShown),
				}}
			/>
			<button
				css={`
					display: block;
					margin: 0 auto;
				`}
				onClick={() => showTraditionalChart(!traditionalChartShown)}
				title={
					traditionalChartShown
						? t('Cacher le graphique détaillé')
						: t('Afficher le graphique détaillé')
				}
			>
				<DetailedBarChartIcon />
			</button>
			{traditionalChartShown && <Chart />}
		</div>
	)
}
