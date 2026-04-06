using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FamilyRewards.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIconToTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Tasks",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Tasks");
        }
    }
}
