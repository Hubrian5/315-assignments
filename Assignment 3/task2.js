// Function to return a sorted list of employees that pass our criteria
function getTopPerformers(employees, criteria) {
    return employees
        .filter(employee => 
            employee.department === criteria.department &&
            employee.performanceRating >= criteria.minPerformance &&
            employee.yearsOfExperience >= criteria.minExperience &&
            employee.salary < criteria.maxSalary
        )
        .sort((a, b) => {
            if (b.performanceRating !== a.performanceRating) {
                return b.performanceRating - a.performanceRating;
            } else {
                return a.salary - b.salary;
            }
        });
}

// Test input
const employees = [
    { id: 1, name: "Alice", department: "Sales", salary: 60000, yearsOfExperience: 4, performanceRating: 85 },
    { id: 2, name: "Brian", department: "Sales", salary: 65000, yearsOfExperience: 5, performanceRating: 90 },
    { id: 3, name: "John", department: "Sales", salary: 70000, yearsOfExperience: 3, performanceRating: 80 },
    { id: 4, name: "Balatro", department: "Sales", salary: 55000, yearsOfExperience: 6, performanceRating: 90 },
    { id: 5, name: "Steve", department: "HR", salary: 50000, yearsOfExperience: 2, performanceRating: 75 }
];

const criteria = {
    department: "Sales",
    minPerformance: 80,
    minExperience: 3,
    maxSalary: 70000
};

const topPerformers = getTopPerformers(employees, criteria);
console.log(topPerformers);