namespace FamilyRewards.Core.Entities;

public class Penalty
{
    public int Id { get; set; }
    public int ChildId { get; set; }
    public int StarsDeducted { get; set; }
    public string Reason { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Child { get; set; } = null!;
    public User Creator { get; set; } = null!;
}
