using Microsoft.EntityFrameworkCore.Migrations;

namespace Quiz.Migrations
{
    public partial class AddCreatedByUserToGame4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameCode",
                table: "PlayerScores");

            migrationBuilder.DropColumn(
                name: "PlayerName",
                table: "PlayerScores");

            migrationBuilder.AddColumn<string>(
                name: "Salt",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GameId",
                table: "PlayerScores",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "PlayerScores",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerScores_GameId",
                table: "PlayerScores",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerScores_UserId",
                table: "PlayerScores",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerScores_Games_GameId",
                table: "PlayerScores",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerScores_Users_UserId",
                table: "PlayerScores",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerScores_Games_GameId",
                table: "PlayerScores");

            migrationBuilder.DropForeignKey(
                name: "FK_PlayerScores_Users_UserId",
                table: "PlayerScores");

            migrationBuilder.DropIndex(
                name: "IX_PlayerScores_GameId",
                table: "PlayerScores");

            migrationBuilder.DropIndex(
                name: "IX_PlayerScores_UserId",
                table: "PlayerScores");

            migrationBuilder.DropColumn(
                name: "Salt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GameId",
                table: "PlayerScores");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "PlayerScores");

            migrationBuilder.AddColumn<string>(
                name: "GameCode",
                table: "PlayerScores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlayerName",
                table: "PlayerScores",
                type: "TEXT",
                nullable: true);
        }
    }
}
