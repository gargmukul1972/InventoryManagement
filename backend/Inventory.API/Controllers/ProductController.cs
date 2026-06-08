using Inventory.API.DTOs;
using Inventory.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _service;

    public ProductController(
        IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult>
        GetAllProducts()
    {
        var products =
            await _service.GetAllProductsAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult>
        GetProduct(Guid id)
    {
        var product =
            await _service.GetProductByIdAsync(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult>
        CreateProduct(
            CreateProductDto dto)
    {
        var product =
            await _service.CreateProductAsync(dto);

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = product.Id },
            product
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult>
        UpdateProduct(
            Guid id,
            UpdateProductDto dto)
    {
        var product =
            await _service.UpdateProductAsync(
                id,
                dto);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult>
        DeleteProduct(Guid id)
    {
        var deleted =
            await _service.DeleteProductAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}