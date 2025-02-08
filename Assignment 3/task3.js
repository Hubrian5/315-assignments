// Function to group sales by regions and compute the total sales, average sales, and salespeople
function regionalSalesSummary(salesRecords) {
    return salesRecords.reduce((acc, record) => {
        const { region, salesperson, salesAmount } = record;

        if (!acc[region]) {
            acc[region] = {
                totalSales: 0,
                salesCount: 0,
                salespeople: new Set() // Ensure list is unique
            };
        }

        acc[region].totalSales += salesAmount;
        acc[region].salesCount += 1;
        acc[region].salespeople.add(salesperson);

        return acc;
    }, {});
}

// Helper function to format the final output
function formatSummary(summary) {
    return Object.keys(summary).reduce((acc, region) => {
        acc[region] = {
            totalSales: summary[region].totalSales,
            averageSales: summary[region].totalSales / summary[region].salesCount,
            salespeople: Array.from(summary[region].salespeople)
        };
        return acc;
    }, {});
}

// Function to format the output properly
function formatOutput(summary) {
    let result = "{\n";
    for (const region in summary) {
        result += `  "${region}": {\n`;
        result += `    "totalSales": ${summary[region].totalSales},\n`;
        result += `    "averageSales": ${summary[region].averageSales},\n`;
        result += `    "salespeople": [${summary[region].salespeople.map(name => `"${name}"`).join(", ")}]\n`;
        result += "  },\n";
    }
    result = result.slice(0, -2); // Remove the trailing comma and newline
    result += "\n}";
    return result;
}

//  Test input
const salesRecords = [
    { region: "North", salesperson: "John", salesAmount: 5000, date: "2024-01-15" },
    { region: "South", salesperson: "Alice", salesAmount: 7000, date: "2024-01-20" },
    { region: "North", salesperson: "John", salesAmount: 3000, date: "2024-02-10" },
    { region: "North", salesperson: "Doe", salesAmount: 4000, date: "2024-03-05" }
];

const summary = regionalSalesSummary(salesRecords);
const formattedSummary = formatSummary(summary);
const finalOutput = formatOutput(formattedSummary);

console.log(finalOutput);