import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Lang } from './translation'
import unitsTranslations from './units.yaml'

i18next
	.use(initReactI18next)
	.init({
		fallbackLng: 'fr',
		resources: Object.fromEntries(
			Object.keys(Lang)
				.filter((key) => key !== 'Default')
				.map((key) => {
					const lng = key.toLowerCase()
					return [lng, { units: unitsTranslations[lng] }]
				})
		),
		react: {
			useSuspense: false,
		},
	})
	.catch((err) => console?.error('Error from i18n load', err))

export default i18next
