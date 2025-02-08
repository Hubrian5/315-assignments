// Computes and returns an object with highest score, lowest score, overall average, and each individual student average
function analyzeStudentPerformance(students) {
    // Flatten all scores to find the highest and lowest scores
    const allScores = students.flatMap(student => student.scores); 

    // Calculate highest and lowest scores
    const highestScore = Math.max(...allScores);
    const lowestScore = Math.min(...allScores);

    // Calculate overall average
    const overallAverage = Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);

    // Calculate average score for each student and round it
    const studentAverages = students.map(student => ({
        name: student.name,
        average: Math.round(student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length)
    })).sort((a, b) => b.average - a.average); // Sort by average in descending order

    return {
        highestScore,
        lowestScore,
        overallAverage,
        studentAverages
    };
}

// Test Input
const students = [
    { name: "Alice", scores: [85, 92, 78] },
    { name: "Bob", scores: [80, 88, 92] },
    { name: "Charlie", scores: [90, 85, 88] }
];

const result = analyzeStudentPerformance(students);
console.log(result);