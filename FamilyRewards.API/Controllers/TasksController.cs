using System.Security.Claims;
using FamilyRewards.Core.DTOs.Tasks;
using FamilyRewards.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyRewards.API.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    public TasksController(ITaskService taskService) => _taskService = taskService;

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var familyId = int.Parse(User.FindFirst("familyId")!.Value);
        return Ok(await _taskService.CreateTaskAsync(dto, adminId, familyId));
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var familyId = int.Parse(User.FindFirst("familyId")!.Value);
        return Ok(await _taskService.GetTasksAsync(familyId));
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPendingCompletions()
    {
        var familyId = int.Parse(User.FindFirst("familyId")!.Value);
        return Ok(await _taskService.GetPendingCompletionsAsync(familyId));
    }

    [HttpGet("my-completions")]
    [Authorize(Roles = "Child")]
    public async Task<IActionResult> GetMyCompletions()
    {
        var childId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _taskService.GetChildCompletionsAsync(childId));
    }

    [HttpPost("complete")]
    [Authorize(Roles = "Child")]
    public async Task<IActionResult> CompleteTask([FromBody] CompleteTaskDto dto)
    {
        var childId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _taskService.CompleteTaskAsync(dto, childId));
    }

    [HttpPost("approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveTask([FromBody] ApproveTaskDto dto)
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _taskService.ApproveTaskAsync(dto, adminId));
    }
}
