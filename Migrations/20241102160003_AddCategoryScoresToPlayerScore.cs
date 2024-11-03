using Microsoft.EntityFrameworkCore.Migrations;

namespace Quiz.Migrations
{
    public partial class AddCategoryScoresToPlayerScore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Score",
                table: "PlayerScores",
                newName: "TotalScore");

            migrationBuilder.AddColumn<string>(
                name: "CategoryScoresJson",
                table: "PlayerScores",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryScoresJson",
                table: "PlayerScores");

            migrationBuilder.RenameColumn(
                name: "TotalScore",
                table: "PlayerScores",
                newName: "Score");
        }
    }
}
