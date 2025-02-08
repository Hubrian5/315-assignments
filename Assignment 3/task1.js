// Take an array of order objects that contain id, customer name, and array of products to transform each order into a summary object
function summarizeOrders(orders) {
    return orders.map(order => { // Map iterates over each order in the orders array
        const totalAmount = order.products.reduce((sum, product) => sum + product.price * product.quantity, 0); // Reduce to calculate total by summing product of price and quantity
        
        const categories = order.products.reduce((acc, product) => { // Group products by category and sum up the quantities for each category
            if (!acc[product.category]) {
                acc[product.category] = 0;
            }
            acc[product.category] += product.quantity;
            return acc;
        }, {});

        return {
            orderId: order.id,
            customer: order.customer,
            totalAmount: totalAmount,
            categories: categories
        };
    });
}

// Test input
const orders = [
    { 
        id: 101,    
        customer: "Alice", 
        products: [ 
            { name: "Laptop", category: "Electronics", price: 1200, quantity: 1 }, 
            { name: "Mouse", category: "Electronics", price: 25, quantity: 2 }, 
            { name: "Notebook", category: "Stationery", price: 5, quantity: 5 }  
        ]   
    }, 
    { 
        id: 102,    
        customer: "Bob", 
        products: [ 
            { name: "T-shirt", category: "Clothing", price: 20, quantity: 3 }, 
            { name: "Jeans", category: "Clothing", price: 40, quantity: 1 }, 
            { name: "Cap", category: "Accessories", price: 15, quantity: 2 }  
        ]   
    }
];

const summarizedOrders = summarizeOrders(orders);
console.log(JSON.stringify(summarizedOrders, null, 2)); // Convert js object into a json string so I can make categories appear on newlines