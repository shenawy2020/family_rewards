using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.DTOs.Tasks;

public class ApproveTaskDto
{
    public int CompletionId { get; set; }
    public TaskCompletionStatus Status { get; set; }
    public string? Notes { get; set; }
}
