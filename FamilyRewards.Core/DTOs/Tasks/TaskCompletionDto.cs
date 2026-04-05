using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.DTOs.Tasks;

public class TaskCompletionDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public int Stars { get; set; }
    public int ChildId { get; set; }
    public string ChildName { get; set; } = string.Empty;
    public string? ChildAvatarUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CompletedAt { get; set; }
    public string? Notes { get; set; }
    public string? ImageProofUrl { get; set; }
}
