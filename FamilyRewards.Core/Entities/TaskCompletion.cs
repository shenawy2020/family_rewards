using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.Entities;

public class TaskCompletion
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int ChildId { get; set; }
    public TaskCompletionStatus Status { get; set; } = TaskCompletionStatus.Pending;
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
    public string? ImageProofUrl { get; set; }

    public FamilyTask Task { get; set; } = null!;
    public User Child { get; set; } = null!;
}
