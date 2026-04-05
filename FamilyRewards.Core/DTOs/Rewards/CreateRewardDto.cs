namespace FamilyRewards.Core.DTOs.Rewards;

public class CreateRewardDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StarsCost { get; set; }
}
