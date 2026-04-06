using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.DTOs.Tasks;

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Stars { get; set; }
    public TaskType Type { get; set; }
    public string? Icon { get; set; }
}
