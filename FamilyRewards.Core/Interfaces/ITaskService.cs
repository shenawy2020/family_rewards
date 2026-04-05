using FamilyRewards.Core.DTOs.Tasks;

namespace FamilyRewards.Core.Interfaces;

public interface ITaskService
{
    Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, int adminId, int familyId);
    Task<IEnumerable<TaskDto>> GetTasksAsync(int familyId);
    Task<TaskCompletionDto> CompleteTaskAsync(CompleteTaskDto dto, int childId);
    Task<TaskCompletionDto> ApproveTaskAsync(ApproveTaskDto dto, int adminId);
    Task<IEnumerable<TaskCompletionDto>> GetPendingCompletionsAsync(int familyId);
    Task<IEnumerable<TaskCompletionDto>> GetChildCompletionsAsync(int childId);
}
