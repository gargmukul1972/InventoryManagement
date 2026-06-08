import { FiEdit2, FiTrash2, FiEye, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ProductTable({
  products,
  onDelete,
  onEdit,
  onView,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  totalCount
}) {
  const getStatusBadge = (quantity) => {
    if (quantity === 0) {
      return <span className="badge badge-danger">Out of Stock</span>;
    }
    if (quantity < 10) {
      return <span className="badge badge-warning">Low Stock</span>;
    }
    return <span className="badge badge-success">In Stock</span>;
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <FiChevronUp className="sort-icon" /> : <FiChevronDown className="sort-icon" />;
  };

  return (
    <div className="table-wrapper card">
      <div className="table-responsive">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th onClick={() => onSort("name")} className="sortable-header">
                Name {renderSortIcon("name")}
              </th>
              <th onClick={() => onSort("category")} className="sortable-header">
                Category {renderSortIcon("category")}
              </th>
              <th onClick={() => onSort("price")} className="sortable-header">
                Price {renderSortIcon("price")}
              </th>
              <th onClick={() => onSort("quantity")} className="sortable-header">
                Quantity {renderSortIcon("quantity")}
              </th>
              <th>Status</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty-state">
                  <div className="empty-state-content">
                    <FiEye className="empty-state-icon" />
                    <h4>No products found</h4>
                    <p>Try refining your search or add a new product to start.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="table-row">
                  <td className="font-semibold text-primary">{product.name}</td>
                  <td>
                    <span className="table-category-tag">{product.category}</span>
                  </td>
                  <td className="font-mono">₹{product.price.toLocaleString()}</td>
                  <td className="font-mono">{product.quantity}</td>
                  <td>{getStatusBadge(product.quantity)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn view-btn"
                        onClick={() => onView(product)}
                        title="View Details"
                        aria-label={`View details for ${product.name}`}
                      >
                        <FiEye />
                      </button>

                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                        aria-label={`Edit ${product.name}`}
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(product.id)}
                        title="Delete Product"
                        aria-label={`Delete ${product.name}`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalCount > 0 && (
        <div className="table-pagination-footer">
          <div className="pagination-info">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(startIndex + products.length, totalCount)}
            </span>{" "}
            of <span className="font-semibold">{totalCount}</span> entries
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => onPageChange(index + 1)}
                aria-label={`Go to page ${index + 1}`}
                aria-current={currentPage === index + 1 ? "page" : undefined}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;