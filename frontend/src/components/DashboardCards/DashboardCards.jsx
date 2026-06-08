import { FiBox, FiLayers, FiDollarSign, FiAlertOctagon } from "react-icons/fi";

function DashboardCards({
  totalProducts,
  totalStock,
  inventoryValue,
  lowStock
}) {
  return (
    <div className="cards-container">
      {/* Total Products */}
      <article className="card kpi-card" aria-label="Total Unique Products">
        <div className="kpi-header">
          <span className="kpi-title">Total Products</span>
          <div className="kpi-icon-wrapper blue">
            <FiBox />
          </div>
        </div>
        <div className="kpi-body">
          <p className="kpi-value">{totalProducts}</p>
          <span className="kpi-trend text-success">Active SKUs</span>
        </div>
      </article>

      {/* Total Stock */}
      <article className="card kpi-card" aria-label="Total Available Stock Units">
        <div className="kpi-header">
          <span className="kpi-title">Total Stock</span>
          <div className="kpi-icon-wrapper teal">
            <FiLayers />
          </div>
        </div>
        <div className="kpi-body">
          <p className="kpi-value">{totalStock.toLocaleString()}</p>
          <span className="kpi-trend text-info">Total units in warehouse</span>
        </div>
      </article>

      {/* Inventory Value */}
      <article className="card kpi-card" aria-label="Total Stock Value">
        <div className="kpi-header">
          <span className="kpi-title">Inventory Value</span>
          <div className="kpi-icon-wrapper indigo">
            <FiDollarSign />
          </div>
        </div>
        <div className="kpi-body">
          <p className="kpi-value">₹{inventoryValue.toLocaleString()}</p>
          <span className="kpi-trend text-primary">Estimated net asset value</span>
        </div>
      </article>

      {/* Low Stock Items */}
      <article className="card kpi-card" aria-label="Low Stock Alert Items">
        <div className="kpi-header">
          <span className="kpi-title">Low Stock Items</span>
          <div className="kpi-icon-wrapper red">
            <FiAlertOctagon />
          </div>
        </div>
        <div className="kpi-body">
          <p className="kpi-value">{lowStock}</p>
          <span className={`kpi-trend ${lowStock > 0 ? "text-danger" : "text-success"}`}>
            {lowStock > 0 ? "Requires restock action" : "All items optimal"}
          </span>
        </div>
      </article>
    </div>
  );
}

export default DashboardCards;