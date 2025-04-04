import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrdersList.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValues, setFilterValues] = useState({
    orderId: '',
    productName: '',
    quantitySort: 'asc',
    deliveryDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [activeFilter, filterValues]);

  const fetchOrders = () => {
    const params = new URLSearchParams();
    
    if (activeFilter === 'orderId' && filterValues.orderId) {
      params.append('_id', filterValues.orderId);
    }
    else if (activeFilter === 'productName' && filterValues.productName) {
      params.append('productName', filterValues.productName);
    }
    else if (activeFilter === 'quantity') {
      params.append('sort', 'quantity');
      params.append('order', filterValues.quantitySort);
    }
    else if (activeFilter === 'deliveryDate' && filterValues.deliveryDate) {
      params.append('deliveryDate', filterValues.deliveryDate);
    }

    axios.get(`http://localhost:5000/orders?${params.toString()}`)
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  };

  const fetchProducts = () => {
    axios.get('http://localhost:5000/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const toggleFilter = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleOrderIdChange = (e) => {
    setFilterValues({...filterValues, orderId: e.target.value});
  };

  const handleProductNameChange = (e) => {
    setFilterValues({...filterValues, productName: e.target.value});
  };

  const handleQuantitySort = () => {
    const newSort = filterValues.quantitySort === 'asc' ? 'desc' : 'asc';
    setFilterValues({...filterValues, quantitySort: newSort});
    setActiveFilter('quantity');
  };

  const handleDeliveryDateChange = (e) => {
    setFilterValues({...filterValues, deliveryDate: e.target.value});
  };

  return (
    <div className="orders-page">
      <h1>Orders List</h1>
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Dashboard
      </button>

      <table className="orders-table">
        <thead>
          <tr>
            <th>
              <div onClick={() => toggleFilter('orderId')}>
                Order ID
                {activeFilter === 'orderId' && ' ▼'}
              </div>
              {activeFilter === 'orderId' && (
                <input
                  type="text"
                  value={filterValues.orderId}
                  onChange={handleOrderIdChange}
                  placeholder="Search Order ID"
                />
              )}
            </th>
            <th>
              <div onClick={() => toggleFilter('productName')}>
                Product
                {activeFilter === 'productName' && ' ▼'}
              </div>
              {activeFilter === 'productName' && (
                <select
                  value={filterValues.productName}
                  onChange={handleProductNameChange}
                >
                  <option value="">All Products</option>
                  {products.map(product => (
                    <option key={product._id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
            </th>
            <th onClick={handleQuantitySort}>
              Quantity
              {activeFilter === 'quantity' && (
                filterValues.quantitySort === 'asc' ? ' ↑' : ' ↓'
              )}
            </th>
            <th>
              <div onClick={() => toggleFilter('deliveryDate')}>
                Delivery Date
                {activeFilter === 'deliveryDate' && ' ▼'}
              </div>
              {activeFilter === 'deliveryDate' && (
                <input
                  type="date"
                  value={filterValues.deliveryDate}
                  onChange={handleDeliveryDateChange}
                />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.productId?.name || 'N/A'}</td>
              <td>{order.quantity}</td>
              <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;