using Inventory.API.DTOs;
using Inventory.API.Entities;
using Inventory.API.Repositories;

namespace Inventory.API.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    public ProductService(
        IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProductResponseDto>>
        GetAllProductsAsync()
    {
        var products =
            await _repository.GetAllAsync();

        return products.Select(p =>
            new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Category = p.Category,
                Price = p.Price,
                Quantity = p.Quantity,
                Description = p.Description
            }).ToList();
    }

    public async Task<ProductResponseDto?>
        GetProductByIdAsync(Guid id)
    {
        var product =
            await _repository.GetByIdAsync(id);

        if (product == null)
            return null;

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Price = product.Price,
            Quantity = product.Quantity,
            Description = product.Description
        };
    }

    public async Task<ProductResponseDto>
        CreateProductAsync(
            CreateProductDto dto)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Category = dto.Category,
            Price = dto.Price,
            Quantity = dto.Quantity,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result =
            await _repository.AddAsync(product);

        return new ProductResponseDto
        {
            Id = result.Id,
            Name = result.Name,
            Category = result.Category,
            Price = result.Price,
            Quantity = result.Quantity,
            Description = result.Description
        };
    }

    public async Task<ProductResponseDto?>
        UpdateProductAsync(
            Guid id,
            UpdateProductDto dto)
    {
        var product =
            await _repository.GetByIdAsync(id);

        if (product == null)
            return null;

        product.Name = dto.Name;
        product.Category = dto.Category;
        product.Price = dto.Price;
        product.Quantity = dto.Quantity;
        product.Description = dto.Description;
        product.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(product);

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Price = product.Price,
            Quantity = product.Quantity,
            Description = product.Description
        };
    }

    public async Task<bool>
        DeleteProductAsync(Guid id)
    {
        var product =
            await _repository.GetByIdAsync(id);

        if (product == null)
            return false;

        await _repository.DeleteAsync(product);

        return true;
    }
}