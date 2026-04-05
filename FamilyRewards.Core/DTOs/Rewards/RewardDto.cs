namespace FamilyRewards.Core.DTOs.Rewards;

public class RewardDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StarsCost { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}
