import {goBackToSimulation} from 'Actions/actions'
import SearchBar from 'Components/SearchBar'
import SearchButton from 'Components/SearchButton'
import {EngineContext} from 'Components/utils/EngineContext'
import {ScrollToTop} from 'Components/utils/Scroll'
import {getDocumentationSiteMap, RulePage} from 'publicodes-react'
import {useCallback, useContext, useMemo} from 'react'
import {Helmet} from 'react-helmet'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {Link, Navigate, Route, useLocation} from 'react-router-dom'
import {RootState} from 'Reducers/rootReducer'
import styled from 'styled-components'
import Meta from '../../../components/utils/Meta'
import BandeauContribuer from '../BandeauContribuer'
import References from './DocumentationReferences'
import Méthode from './Méthode'
import {Markdown} from 'Components/utils/markdown'

export default function () {
	const currentSimulation = useSelector(
		(state: RootState) => !!state.simulation?.url
	)
	const engine = useContext(EngineContext)
	const documentationPath = '/documentation'
	const { pathname } = useLocation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)
	console.log(documentationSitePaths)
	const { i18n } = useTranslation()

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}
	if (!documentationSitePaths[pathname]) {
		return <Navigate to="/404" />
	}
	return (
		<div>
			<ScrollToTop key={pathname} />
			<div
				css={`
					display: flex;
					margin-top: 2rem;
					justify-content: space-between;
				`}
			>
				{currentSimulation ? <BackToSimulation /> : <span />}
				<SearchButton key={pathname} />
			</div>

			<Route
				language={i18n.language as 'fr' | 'en'}
				path={documentationPath + '/:name+'}
				engine={engine}
				render={({ match }) =>
				documentationPath={documentationPath}
					match.params.name && (
						<DocumentationStyle>
							<RulePage
								language={i18n.language as 'fr' | 'en'}
								rulePath={match.params.name}
								engine={engine}
								documentationPath={documentationPath}
								renderers={{
									Head: Helmet,
									Link: Link,
									Text: Markdown,
									References,
								}}
							/>
						</DocumentationStyle>
					)
				}
			/>
			<BandeauContribuer />
		</div>
	)
}
function BackToSimulation() {
	const dispatch = useDispatch()
	const handleClick = useCallback(() => {
		dispatch(goBackToSimulation())
	}, [])
	return (
		<button
			className="ui__ simple small push-left button"
			onClick={handleClick}
		>
			← <Trans i18nKey="back">Reprendre la simulation</Trans>
		</button>
	)
}

function DocumentationLanding() {
	return (
		<>
			<Meta
				title="Comprendre nos calculs"
				description="Notre modèle de calcul est entièrement transparent. Chacun peut l'explorer, donner son avis, l'améliorer."
			/>
			<Méthode />
			<h2>Explorer notre documentation</h2>
			<SearchBar showListByDefault={true} />
		</>
	)
}


export const DocumentationStyle = styled.div`
	max-width: 850px;
	margin: 0 auto;
	padding: 0 0.6rem;
	#documentationRuleRoot > p:first-of-type {
		display: inline-block;
		background: var(--darkerColor);
		padding: 0.4rem 0.6rem 0.2rem;
	}
	header {
		color: var(--textColor);
		a {
			color: var(--textColor);
		}
		h1 {
			margin-top: 0.6rem;
			margin-bottom: 0.6rem;
			a {
				text-decoration: none;
			}
		}
		background: linear-gradient(60deg, var(--darkColor) 0%, var(--color) 100%);
		padding: 0.6rem 1rem;
		box-shadow: 0 1px 3px rgba(var(--rgbColor), 0.12),
			0 1px 2px rgba(var(--rgbColor), 0.24);
		border-radius: 0.4rem;
	}
	button {
		color: inherit;
	}
	span {
		background: inherit;
	}
	small {
		background: none !important;
	}
	div[name='somme'] > div > div:nth-child(2n) {
		background: var(--darkerColor);
	}
	.tranche:nth-child(2n) {
		background: var(--darkerColor) !important;
	}
	.bHoORO .tranche.activated {
		background: var(--color) !important;
	}
`
