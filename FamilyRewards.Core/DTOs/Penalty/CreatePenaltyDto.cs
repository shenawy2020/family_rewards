namespace FamilyRewards.Core.DTOs.Penalty;

public class CreatePenaltyDto
{
    public int ChildId { get; set; }
    public int StarsDeducted { get; set; }
    public string Reason { get; set; } = string.Empty;
}
