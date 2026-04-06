using FamilyRewards.Core.Enums;

namespace FamilyRewards.Core.Entities;

public class FamilyTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Stars { get; set; }
    public TaskType Type { get; set; }
    public int FamilyId { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? ImageProofUrl { get; set; }
    public string? Icon { get; set; }

    public Family Family { get; set; } = null!;
    public User Creator { get; set; } = null!;
    public ICollection<TaskCompletion> Completions { get; set; } = new List<TaskCompletion>();
}
