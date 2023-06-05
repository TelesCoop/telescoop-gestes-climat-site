import { Category, DottedName } from '@/components/publicodesUtils'
import { sortBy } from '@/utils'

export function sortQuestionsByCategory(
	nextQuestions: DottedName[],
	orderByCategories: Category[]
): DottedName[] {
	let sort = sortBy((question: string | string[]) => {
		const category = orderByCategories.find(
			(c) => question.indexOf(c.dottedName) === 0
		)
		if (!category) {
			return 1000000
		}
		// We artificially put this category (since it has no actionable question) at the end
		if (category.name === 'services sociétaux') {
			return 100000
		}
		return -(category?.nodeValue ?? 0)
	})
	return sort(nextQuestions)
}

export function getPreviousQuestion(
	currentQuestionIndex: number,
	previousAnswers: DottedName[],
	isMosaic: boolean,
	questionsToSubmit: DottedName[] | undefined
): DottedName | undefined {
	const currentIsNew = currentQuestionIndex < 0

	if (currentIsNew && previousAnswers.length > 0) {
		return previousAnswers[previousAnswers.length - 1]
	}

	if (isMosaic) {
		const res = [...previousAnswers].reverse().find((el, index) => {
			const currentQuestionReversedIndex =
				previousAnswers.length - currentQuestionIndex
			return (
				index > currentQuestionReversedIndex &&
				// The previous question shouldn't be one of the current mosaic's questions
				!questionsToSubmit?.includes(el)
			)
		})
		return res
	}

	// We'll explore the previous answers starting from the end,
	// to find the first question that is not in the current mosaic
	return previousAnswers[currentQuestionIndex - 1]
}
