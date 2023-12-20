import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    completed: [],
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        submitQuiz: (state, action) => {
            const idx = state.completed.findIndex((c) => c?.topic === action.payload.topic) || 0;

            if (idx === -1) {
                state.completed.push({
                    topic: action.payload.topic,
                    quiz: [
                        {
                            correct: action.payload.correct,
                            incorrect: action.payload.incorrect,
                            totalMark: action.payload.totalMark,
                            obtainedMark: action.payload.obtainedMark,
                            quizNo: action.payload.quizNo,
                            answered: action.payload.answered,
                        },
                    ],
                });
            } else {
                const duplicateQuiz = state.completed[idx]?.quiz.findIndex((c) => c.quizNo === action.payload.quizNo);

                if (duplicateQuiz === -1) {
                    state.completed[idx].quiz.push({
                        correct: action.payload.correct,
                        incorrect: action.payload.incorrect,
                        totalMark: action.payload.totalMark,
                        obtainedMark: action.payload.obtainedMark,
                        quizNo: action.payload.quizNo,
                        answered: action.payload.answered,
                    });
                } else {
                    // do nothing ...
                }
            }

            // }
        },
    },
});

export default quizSlice.reducer;
export const { submitQuiz } = quizSlice.actions;
