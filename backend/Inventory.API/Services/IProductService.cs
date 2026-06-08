using Inventory.API.DTOs;

namespace Inventory.API.Services;

public interface IProductService
{
    Task<List<ProductResponseDto>>
        GetAllProductsAsync();

    Task<ProductResponseDto?>
        GetProductByIdAsync(Guid id);

    Task<ProductResponseDto>
        CreateProductAsync(
            CreateProductDto dto);

    Task<ProductResponseDto?>
        UpdateProductAsync(
            Guid id,
            UpdateProductDto dto);

    Task<bool>
        DeleteProductAsync(Guid id);
}