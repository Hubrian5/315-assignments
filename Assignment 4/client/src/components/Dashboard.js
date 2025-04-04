import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValues, setFilterValues] = useState({
    nameSort: 'asc',
    category: '',
    minPrice: '',
    maxPrice: '',
    stockSort: 'asc'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [activeFilter, filterValues]);

  const fetchProducts = () => {
    const params = new URLSearchParams();
    
    if (activeFilter === 'name') {
      params.append('sort', 'name');
      params.append('order', filterValues.nameSort);
    } 
    else if (activeFilter === 'category' && filterValues.category) {
      params.append('category', filterValues.category);
    }
    else if (activeFilter === 'price') {
      if (filterValues.minPrice) params.append('price_gte', filterValues.minPrice);
      if (filterValues.maxPrice) params.append('price_lte', filterValues.maxPrice);
    }
    else if (activeFilter === 'stock') {
      params.append('sort', 'stock');
      params.append('order', filterValues.stockSort);
    }

    axios.get(`http://localhost:5000/products?${params.toString()}`)
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        const uniqueCategories = [...new Set(response.data.map(p => p.category))];
        setCategories(uniqueCategories);
      });
  };

  const toggleFilter = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleNameSort = () => {
    const newSort = filterValues.nameSort === 'asc' ? 'desc' : 'asc';
    setFilterValues({...filterValues, nameSort: newSort});
    setActiveFilter('name');
  };

  const handleCategoryChange = (e) => {
    setFilterValues({...filterValues, category: e.target.value});
  };

  const handlePriceChange = (e) => {
    setFilterValues({...filterValues, [e.target.name]: e.target.value});
  };

  const handleStockSort = () => {
    const newSort = filterValues.stockSort === 'asc' ? 'desc' : 'asc';
    setFilterValues({...filterValues, stockSort: newSort});
    setActiveFilter('stock');
  };

  return (
    <div className="dashboard">
      <h1>Product Dashboard</h1>
      <button className="view-orders-button" onClick={() => navigate('/orders')}>
        View Orders
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th className={activeFilter === 'name' ? 'active-filter' : ''}>
              <div className="header-content" onClick={handleNameSort}>
                Product Name
                {activeFilter === 'name' && (
                  <span>{filterValues.nameSort === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </th>
            <th className={activeFilter === 'category' ? 'active-filter' : ''}>
              <div className="header-content">
                <div onClick={() => toggleFilter('category')}>
                  Category
                  {activeFilter === 'category' && (
                    <span> ▼</span>
                  )}
                </div>
                {activeFilter === 'category' && (
                  <select
                    value={filterValues.category}
                    onChange={handleCategoryChange}
                    className="category-filter"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>
            </th>
            <th className={activeFilter === 'price' ? 'active-filter' : ''}>
              <div className="header-content">
                <div onClick={() => toggleFilter('price')}>
                  Price
                  {activeFilter === 'price' && (
                    <span> ▼</span>
                  )}
                </div>
                {activeFilter === 'price' && (
                  <div className="price-range">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filterValues.minPrice}
                      onChange={handlePriceChange}
                      min="0"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filterValues.maxPrice}
                      onChange={handlePriceChange}
                      min="0"
                    />
                  </div>
                )}
              </div>
            </th>
            <th className={activeFilter === 'stock' ? 'active-filter' : ''}>
              <div className="header-content" onClick={handleStockSort}>
                Stock
                {activeFilter === 'stock' && (
                  <span>{filterValues.stockSort === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <Link to={`/order/${product._id}`}>
                  <button
                    className="order-button"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Order'}
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;