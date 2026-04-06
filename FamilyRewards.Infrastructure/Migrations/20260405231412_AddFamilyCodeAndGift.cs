using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FamilyRewards.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFamilyCodeAndGift : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChildSequence",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Families",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChildSequence",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Families");
        }
    }
}
