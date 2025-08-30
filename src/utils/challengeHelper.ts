import questions from "@/Data/questions.json";

const  getRandomQuestion = () => {
    const randonIndex = Math.floor(Math.random() * questions.length);
    questions.splice(randonIndex, 1);
    return questions[randonIndex]; 
}

export { getRandomQuestion };