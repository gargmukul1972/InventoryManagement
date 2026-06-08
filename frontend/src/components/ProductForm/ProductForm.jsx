import { useState } from "react";

function ProductForm({
  onAdd,
  onUpdate,
  selectedProduct,
  onClose
}) {
  const [product, setProduct] = useState(() => {
    if (selectedProduct) {
      return {
        name: selectedProduct.name || "",
        category: selectedProduct.category || "",
        price: selectedProduct.price ?? "",
        quantity: selectedProduct.quantity ?? "",
        description: selectedProduct.description || ""
      };
    }
    return {
      name: "",
      category: "",
      price: "",
      quantity: "",
      description: ""
    };
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when editing field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!product.name.trim()) {
      tempErrors.name = "Product name is required";
    }
    if (!product.category.trim()) {
      tempErrors.category = "Category is required";
    }
    
    // Price checks
    if (product.price === "" || product.price === null || product.price === undefined) {
      tempErrors.price = "Price is required";
    } else {
      const numPrice = Number(product.price);
      if (isNaN(numPrice)) {
        tempErrors.price = "Price must be a number";
      } else if (numPrice <= 0) {
        tempErrors.price = "Price must be greater than 0";
      }
    }

    // Quantity checks
    if (product.quantity === "" || product.quantity === null || product.quantity === undefined) {
      tempErrors.quantity = "Quantity is required";
    } else {
      const numQty = Number(product.quantity);
      if (isNaN(numQty)) {
        tempErrors.quantity = "Quantity must be a number";
      } else if (numQty < 0 || !Number.isInteger(numQty)) {
        tempErrors.quantity = "Quantity must be a positive whole number";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity)
    };

    if (selectedProduct) {
      await onUpdate(selectedProduct.id, payload);
    } else {
      await onAdd(payload);
    }

    // Reset fields if adding
    if (!selectedProduct) {
      setProduct({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: ""
      });
    }
  };

  return (
    <form className="enterprise-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className={`form-group ${errors.name ? "has-error" : ""}`}>
          <label htmlFor="name" className="form-label">Product Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-input focus-ring"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className={`form-group ${errors.category ? "has-error" : ""}`}>
          <label htmlFor="category" className="form-label">Category *</label>
          <input
            id="category"
            name="category"
            type="text"
            className="form-input focus-ring"
            placeholder="Enter category"
            value={product.category}
            onChange={handleChange}
            required
          />
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.price ? "has-error" : ""}`}>
          <label htmlFor="price" className="form-label">Price (₹) *</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            className="form-input focus-ring"
            placeholder="0.00"
            value={product.price}
            onChange={handleChange}
            required
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className={`form-group ${errors.quantity ? "has-error" : ""}`}>
          <label htmlFor="quantity" className="form-label">Quantity *</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            className="form-input focus-ring"
            placeholder="0"
            value={product.quantity}
            onChange={handleChange}
            required
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          className="form-textarea focus-ring"
          placeholder="Brief description of product features..."
          value={product.description || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-submit-actions">
        {onClose && (
          <button 
            type="button" 
            className="btn btn-secondary secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
        )}
        
        <button type="submit" className="btn btn-primary primary">
          {selectedProduct ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;