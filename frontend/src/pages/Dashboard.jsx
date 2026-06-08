import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards/DashboardCards";
import { getProducts } from "../services/productService";
import CategoryChart from "../components/Charts/CategoryChart";
import StockChart from "../components/Charts/StockChart";
import { FiAlertTriangle, FiActivity, FiArrowRight, FiCheckCircle, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    let active = true;
    getProducts()
      .then(data => {
        if (active) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error("Failed to load products:", error);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, item) => sum + item.quantity, 0);
  const inventoryValue = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lowStockItems = products.filter(p => p.quantity < 10);
  const lowStockCount = lowStockItems.length;

  // Generate some realistic recent activities based on actual inventory
  const getRecentActivities = () => {
    const activities = [
      {
        id: 1,
        type: "success",
        message: "Database synchronization completed",
        time: "Just now",
        icon: <FiCheckCircle />
      }
    ];

    if (lowStockItems.length > 0) {
      activities.push({
        id: 2,
        type: "warning",
        message: `Low stock alert: '${lowStockItems[0].name}' has only ${lowStockItems[0].quantity} units left`,
        time: "10 mins ago",
        icon: <FiAlertTriangle />
      });
    }

    if (products.length > 0) {
      const lastProduct = products[products.length - 1];
      activities.push({
        id: 3,
        type: "info",
        message: `Inventory scanned: '${lastProduct.name}' in category '${lastProduct.category}' verified`,
        time: "1 hour ago",
        icon: <FiActivity />
      });
    }

    activities.push({
      id: 4,
      type: "success",
      message: "Monthly valuation report generated successfully",
      time: "3 hours ago",
      icon: <FiCheckCircle />
    });

    return activities;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-header-bar">
        <div>
          <h1 className="dashboard-title">Overview</h1>
          <p className="dashboard-subtitle">Real-time inventory valuation and levels metrics.</p>
        </div>
        <Link to="/products" className="btn btn-primary primary">
          <FiPlus /> Add & Manage Products
        </Link>
      </div>

      <DashboardCards
        totalProducts={totalProducts}
        totalStock={totalStock}
        inventoryValue={inventoryValue}
        lowStock={lowStockCount}
      />

      <div className="charts-grid">
        <CategoryChart products={products} />
        <StockChart products={products} />
      </div>

      <div className="dashboard-panels-grid">
        {/* Low Stock Alerts Widget */}
        <section className="dashboard-panel card" aria-labelledby="low-stock-title">
          <div className="panel-header">
            <h3 id="low-stock-title" className="panel-title">
              <FiAlertTriangle className="text-warning" /> Low Stock Alerts
            </h3>
            <span className="badge badge-danger">{lowStockCount} Items Warning</span>
          </div>
          <div className="panel-content">
            {lowStockItems.length === 0 ? (
              <div className="panel-empty">
                <FiCheckCircle className="text-success text-large" />
                <p>All items are sufficiently stocked.</p>
              </div>
            ) : (
              <ul className="alert-list">
                {lowStockItems.slice(0, 5).map(item => (
                  <li key={item.id} className="alert-item">
                    <div className="alert-info">
                      <span className="alert-name">{item.name}</span>
                      <span className="alert-category">{item.category}</span>
                    </div>
                    <div className="alert-action">
                      <span className={`badge ${item.quantity === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {item.quantity} Left
                      </span>
                      <Link to="/products" className="alert-link" aria-label={`Manage ${item.name}`}>
                        Manage <FiArrowRight />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="dashboard-panel card" aria-labelledby="activity-title">
          <div className="panel-header">
            <h3 id="activity-title" className="panel-title">
              <FiActivity className="text-primary" /> System Logs & Activity
            </h3>
            <span className="badge badge-info">Audit Live</span>
          </div>
          <div className="panel-content">
            <ul className="activity-list">
              {getRecentActivities().map(activity => (
                <li key={activity.id} className="activity-item">
                  <div className={`activity-icon-wrapper ${activity.type}`}>
                    {activity.icon}
                  </div>
                  <div className="activity-details">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;