/*
	This module contains all types and functions related to the translation.
*/

import { useTranslation } from 'react-i18next'

export enum Lang {
	Default = 'Fr',
	Fr = 'Fr',
	En = 'En',
	Es = 'Es',
	It = 'It',
}

export type LangInfos = {
	name: string
	abrv: string
	icon?: string
}

export const defaultLang = Lang.Fr

export function getLangInfos(lang: Lang): LangInfos {
	switch (lang) {
		case Lang.Fr: {
			return {
				name: 'Français',
				abrv: 'fr',
			}
		}
		case Lang.En: {
			return {
				name: 'English',
				abrv: 'en',
			}
		}
		case Lang.Es: {
			return {
				name: 'Español',
				abrv: 'es',
			}
		}
		case Lang.It: {
			return {
				name: 'Italiano',
				abrv: 'it',
			}
		}
	}
}

export function changeLangTo(i18n, currentLangState) {
	const langInfos = getLangInfos(currentLangState.currentLang)
	i18n.changeLanguage(langInfos.abrv)
}
