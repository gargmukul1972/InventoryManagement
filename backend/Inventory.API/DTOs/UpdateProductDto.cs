using System.ComponentModel.DataAnnotations;

namespace Inventory.API.DTOs;

public class UpdateProductDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Range(0.01, 1000000)]
    public decimal Price { get; set; }

    [Range(0, 100000)]
    public int Quantity { get; set; }

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}