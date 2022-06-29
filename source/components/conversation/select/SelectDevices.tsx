import { updateSituation } from 'Actions/actions'
import Checkbox from 'Components/ui/Checkbox'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { Mosaic } from './UI'
import Stamp from '../../Stamp'
import { MosaicLabel } from './NumberedMosaic'

export default function SelectDevices({
	name,
	setFormValue,
	selectedRules,
	value: currentValue,
	question,
	options: { defaultsToFalse },
}) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)

	return (
		<div>
			<Mosaic>
				{selectedRules.map(
					([
						{
							dottedName: name,
							title,
							rawNode: { description, icônes },
						},
						question,
					]) => {
						const situationValue = situation[question.dottedName],
							value =
								situationValue != null
									? situationValue
									: // unlike the NumberedMosaic, we don't preselect cards choices here
									// user tests showed us it is now well received
									defaultsToFalse
									? 'non'
									: question.rawNode['par défaut'],
							isNotActive = question.rawNode['inactif']

						return (
							<li
								css={`
									padding: 2rem;

									:focus-within {
										outline: 3px solid var(--lightColor);
									}
									position: relative;
								`}
								className={
									isNotActive
										? `ui__ card light-border inactive`
										: `ui__ card interactive light-border ${
												value === 'oui' ? `selected` : ''
										  }`
								}
								key={name}
							>
								{icônes && <div css="font-size: 150%">{emoji(icônes)}</div>}
								<MosaicLabel htmlFor={name}>{title}</MosaicLabel>
								{false && description && <p>{description.split('\n')[0]}</p>}
								{!isNotActive && (
									<div css={'font-size: 1.8rem'}>
										<Checkbox
											name={name}
											id={name}
											checked={value === 'oui'}
											onChange={() =>
												dispatch(
													updateSituation(
														question.dottedName,
														value == 'oui' ? 'non' : 'oui'
													)
												)
											}
										/>
									</div>
								)}
								{isNotActive && (
									<Stamp
										css={`
											z-index: 1;
											max-width: 8rem;
											text-align: center;
											border: 2px solid var(--darkColor);
											color: var(--darkColor);
											font-size: 90%;
											@media (min-width: 800px) {
												left: 3rem;
												top: 4rem;
											}
										`}
									>
										Bientôt disponible !
									</Stamp>
								)}
							</li>
						)
					}
				)}
			</Mosaic>
		</div>
	)
}
