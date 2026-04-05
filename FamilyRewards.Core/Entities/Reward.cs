namespace FamilyRewards.Core.Entities;

public class Reward
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StarsCost { get; set; }
    public int FamilyId { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Family Family { get; set; } = null!;
    public User Creator { get; set; } = null!;
}
