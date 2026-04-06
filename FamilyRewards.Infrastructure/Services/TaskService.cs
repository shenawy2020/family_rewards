using FamilyRewards.Core.DTOs.Tasks;
using FamilyRewards.Core.Entities;
using FamilyRewards.Core.Enums;
using FamilyRewards.Core.Interfaces;
using FamilyRewards.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FamilyRewards.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly IUnitOfWork _uow;
    private readonly AppDbContext _context;

    public TaskService(IUnitOfWork uow, AppDbContext context)
    {
        _uow = uow;
        _context = context;
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, int adminId, int familyId)
    {
        var task = new FamilyTask
        {
            Title = dto.Title,
            Description = dto.Description,
            Stars = dto.Stars,
            Type = dto.Type,
            CreatedBy = adminId,
            FamilyId = familyId,
            Icon = dto.Icon
        };
        await _uow.Tasks.AddAsync(task);
        await _uow.SaveChangesAsync();

        var creator = await _uow.Users.GetByIdAsync(adminId);
        return MapToTaskDto(task, creator?.FullName ?? "");
    }

    public async Task<IEnumerable<TaskDto>> GetTasksAsync(int familyId)
    {
        var tasks = await _context.Tasks
            .Where(t => t.FamilyId == familyId)
            .Include(t => t.Creator)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(t => MapToTaskDto(t, t.Creator.FullName));
    }

    public async Task DeleteTaskAsync(int taskId, int adminId)
    {
        var task = await _uow.Tasks.GetByIdAsync(taskId);
        if (task == null) return;

        var admin = await _uow.Users.GetByIdAsync(adminId);
        if (admin == null || admin.FamilyId != task.FamilyId) 
            throw new UnauthorizedAccessException("Not authorized to delete this task.");

        _uow.Tasks.Remove(task);
        await _uow.SaveChangesAsync();
    }

    public async Task<TaskCompletionDto> CompleteTaskAsync(CompleteTaskDto dto, int childId)
    {
        var task = await _uow.Tasks.GetByIdAsync(dto.TaskId)
            ?? throw new KeyNotFoundException("Task not found.");

        // Validation logic based on TaskType
        if (task.Type == TaskType.Daily)
        {
            var todayStart = DateTime.UtcNow.Date;
            var completedToday = await _context.TaskCompletions.AnyAsync(
                tc => tc.TaskId == dto.TaskId && tc.ChildId == childId && 
                tc.CompletedAt >= todayStart && 
                tc.Status != TaskCompletionStatus.Rejected);
            if (completedToday)
                throw new InvalidOperationException("You have already completed this daily task today.");
        }
        else if (task.Type == TaskType.Weekly)
        {
            var startOfWeek = DateTime.UtcNow.Date.AddDays(-7);
            var completedThisWeek = await _context.TaskCompletions.AnyAsync(
                tc => tc.TaskId == dto.TaskId && tc.ChildId == childId && 
                tc.CompletedAt >= startOfWeek && 
                tc.Status != TaskCompletionStatus.Rejected);
            if (completedThisWeek)
                throw new InvalidOperationException("You have already completed this weekly task this week.");
        }
        else if (task.Type == TaskType.Custom)
        {
            var pendingCustom = await _context.TaskCompletions.AnyAsync(
                tc => tc.TaskId == dto.TaskId && tc.ChildId == childId && 
                tc.Status == TaskCompletionStatus.Pending);
            if (pendingCustom)
                throw new InvalidOperationException("A pending submission already exists for this custom task.");
        }

        var completion = new TaskCompletion
        {
            TaskId = dto.TaskId,
            ChildId = childId,
            Status = TaskCompletionStatus.Pending,
            Notes = dto.Notes,
            ImageProofUrl = dto.ImageProofUrl
        };
        await _uow.TaskCompletions.AddAsync(completion);
        await _uow.SaveChangesAsync();

        var child = await _uow.Users.GetByIdAsync(childId);
        return MapToCompletionDto(completion, task, child);
    }

    public async Task<TaskCompletionDto> ApproveTaskAsync(ApproveTaskDto dto, int adminId)
    {
        var completion = await _context.TaskCompletions
            .Include(tc => tc.Task)
            .Include(tc => tc.Child)
            .FirstOrDefaultAsync(tc => tc.Id == dto.CompletionId)
            ?? throw new KeyNotFoundException("Task completion not found.");

        if (completion.Status != TaskCompletionStatus.Pending)
            throw new InvalidOperationException("Completion already processed.");

        completion.Status = dto.Status;
        _uow.TaskCompletions.Update(completion);

        if (dto.Status == TaskCompletionStatus.Approved)
        {
            // Credit wallet
            var wallet = await _uow.Wallets.FirstOrDefaultAsync(w => w.ChildId == completion.ChildId);
            if (wallet == null)
            {
                wallet = new Wallet { ChildId = completion.ChildId, Balance = 0 };
                await _uow.Wallets.AddAsync(wallet);
            }
            wallet.Balance += completion.Task.Stars;
            _uow.Wallets.Update(wallet);

            // Record transaction
            var tx = new WalletTransaction
            {
                ChildId = completion.ChildId,
                Amount = completion.Task.Stars,
                Type = TransactionType.Reward,
                Description = $"Task completed: {completion.Task.Title}"
            };
            await _uow.WalletTransactions.AddAsync(tx);
        }

        await _uow.SaveChangesAsync();
        return MapToCompletionDto(completion, completion.Task, completion.Child);
    }

    public async Task<IEnumerable<TaskCompletionDto>> GetPendingCompletionsAsync(int familyId)
    {
        var completions = await _context.TaskCompletions
            .Include(tc => tc.Task)
            .Include(tc => tc.Child)
            .Where(tc => tc.Task.FamilyId == familyId && tc.Status == TaskCompletionStatus.Pending)
            .OrderByDescending(tc => tc.CompletedAt)
            .ToListAsync();

        return completions.Select(tc => MapToCompletionDto(tc, tc.Task, tc.Child));
    }

    public async Task<IEnumerable<TaskCompletionDto>> GetChildCompletionsAsync(int childId)
    {
        var completions = await _context.TaskCompletions
            .Include(tc => tc.Task)
            .Include(tc => tc.Child)
            .Where(tc => tc.ChildId == childId)
            .OrderByDescending(tc => tc.CompletedAt)
            .ToListAsync();

        return completions.Select(tc => MapToCompletionDto(tc, tc.Task, tc.Child));
    }

    private static TaskDto MapToTaskDto(FamilyTask t, string creatorName) => new()
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        Stars = t.Stars,
        Type = t.Type.ToString(),
        CreatedBy = t.CreatedBy,
        CreatedByName = creatorName,
        CreatedAt = t.CreatedAt,
        Icon = t.Icon
    };

    private static TaskCompletionDto MapToCompletionDto(TaskCompletion tc, FamilyTask task, User child) => new()
    {
        Id = tc.Id,
        TaskId = tc.TaskId,
        TaskTitle = task.Title,
        Stars = task.Stars,
        ChildId = tc.ChildId,
        ChildName = child.FullName,
        ChildAvatarUrl = child.AvatarUrl,
        Status = tc.Status.ToString(),
        CompletedAt = tc.CompletedAt,
        Notes = tc.Notes,
        ImageProofUrl = tc.ImageProofUrl
    };
}
