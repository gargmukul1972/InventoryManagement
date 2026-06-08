import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm/ProductForm";
import ProductTable from "../components/ProductTable/ProductTable";
import Modal from "../components/Modal/Modal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/productService";
import { toast } from "react-toastify";
import { FiSearch, FiPlus, FiAlertTriangle } from "react-icons/fi";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal and selection states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Search, Filter, Sort and Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const refreshProducts = () => {
    getProducts()
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products database");
      });
  };

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
        toast.error("Failed to load products database");
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleAdd = async (product) => {
    try {
      await createProduct(product);
      toast.success("Product Added Successfully");
      setShowAddModal(false);
      refreshProducts();
    } catch (error) {
      console.error("Add failed:", error);
      toast.error("Failed to add product");
    }
  };

  const handleUpdate = async (id, product) => {
    try {
      await updateProduct(id, product);
      toast.success("Product Updated Successfully");
      setShowEditModal(false);
      setSelectedProduct(null);
      refreshProducts();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      toast.success("Product Deleted Successfully");
      setShowDeleteModal(false);
      setDeleteId(null);
      refreshProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };

  // Sort and Filter logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All"
        ? true
        : product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination slicing
  const totalCount = sortedProducts.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const categories = [
    "All",
    ...new Set(products.map(p => p.category))
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Product Catalog...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="dashboard-header-bar">
        <div>
          <h1 className="dashboard-title">Product Catalog</h1>
          <p className="dashboard-subtitle">Manage, filter, and track warehouse inventory SKUs.</p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="filter-bar">
        <div className="filter-controls-left">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Product by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search products"
            />
          </div>

          <div className="category-select-wrapper">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by category"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions-right">
          <button 
            className="btn btn-primary primary" 
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Product Data Table */}
      <ProductTable
        products={paginatedProducts}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        startIndex={startIndex}
        totalCount={totalCount}
        onEdit={(product) => {
          setSelectedProduct(product);
          setShowEditModal(true);
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setShowDeleteModal(true);
        }}
        onView={(product) => {
          setSelectedProduct(product);
          setShowViewModal(true);
        }}
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        title="Add New Product"
        onClose={() => setShowAddModal(false)}
      >
        <ProductForm
          key="add"
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        title="Update Product"
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
      >
        <ProductForm
          key={selectedProduct ? selectedProduct.id : "edit"}
          selectedProduct={selectedProduct}
          onUpdate={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
        />
      </Modal>

      {/* View Product Details Modal */}
      <Modal
        isOpen={showViewModal}
        title="Product Details"
        onClose={() => {
          setShowViewModal(false);
          setSelectedProduct(null);
        }}
      >
        {selectedProduct && (
          <div className="product-detail-layout">
            <div className="detail-header-block">
              <div>
                <h3 className="detail-name">{selectedProduct.name}</h3>
                <span className="detail-category">Category: {selectedProduct.category}</span>
              </div>
              <span className={`badge ${
                selectedProduct.quantity === 0 
                  ? "badge-danger" 
                  : selectedProduct.quantity < 10 
                    ? "badge-warning" 
                    : "badge-success"
              }`}>
                {selectedProduct.quantity === 0 
                  ? "Out of Stock" 
                  : selectedProduct.quantity < 10 
                    ? "Low Stock" 
                    : "In Stock"}
              </span>
            </div>

            <div className="detail-meta-grid">
              <div className="detail-meta-card">
                <span className="detail-meta-label">Unit Price</span>
                <span className="detail-meta-value">₹{selectedProduct.price.toLocaleString()}</span>
              </div>
              <div className="detail-meta-card">
                <span className="detail-meta-label">Stock Quantity</span>
                <span className="detail-meta-value">{selectedProduct.quantity} units</span>
              </div>
              <div className="detail-meta-card">
                <span className="detail-meta-label">Asset Valuation</span>
                <span className="detail-meta-value">₹{(selectedProduct.price * selectedProduct.quantity).toLocaleString()}</span>
              </div>
              <div className="detail-meta-card">
                <span className="detail-meta-label">Database SKU ID</span>
                <span className="detail-meta-value">#{selectedProduct.id}</span>
              </div>
            </div>

            <div className="detail-desc-block">
              <span className="detail-meta-label">Description</span>
              <p className="detail-desc-text">
                {selectedProduct.description || "No description provided for this catalog SKU."}
              </p>
            </div>

            <div className="form-submit-actions">
              <button 
                className="btn btn-secondary secondary" 
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(null);
                }}
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        title="Confirm Deletion"
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
      >
        <div className="delete-modal-content">
          <FiAlertTriangle className="delete-modal-icon" />
          <p className="delete-modal-text">
            Are you sure you want to delete this product? This action is permanent and cannot be undone in the inventory ledger.
          </p>
          <div className="form-submit-actions delete-modal-actions">
            <button
              className="btn btn-secondary secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteId(null);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger primary delete-action-btn"
              onClick={handleDelete}
            >
              Delete Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Products;