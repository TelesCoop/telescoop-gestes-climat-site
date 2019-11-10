import {
	ThemeColoursContext,
	ThemeColoursProvider
} from 'Components/utils/withColours'
import React, { Suspense, useContext, useState } from 'react'
import Home from '../Iframes/SimulateurEmbauche'
let LazyColorPicker = React.lazy(() => import('./ColorPicker'))

export default function Couleur() {
	const { colour: defaultColour } = useContext(ThemeColoursContext)
	const [colour, setColour] = useState(defaultColour)
	return (
		<>
			<h1>Changez la couleur de l'integration </h1>
			<p className="indication">
				Visualisez sur cette page l’apparence du module pour différentes
				couleurs principales.
			</p>
			<Suspense fallback={<div>Chargement...</div>}>
				<LazyColorPicker colour={colour} onChange={setColour} />
			</Suspense>
			<p className="indication">
				La couleur sélectionnée, à déclarer comme attribut
				&quot;data-couleur&quot; du script sur votre page est : <b>{colour}</b>
			</p>
			<div className="ui__ card">
				<ThemeColoursProvider colour={colour}>
					<Home />
				</ThemeColoursProvider>
			</div>
		</>
	)
}
